import { useEffect, useRef, useState } from 'react';
import { publicAsset } from './assets';
import { getInterface, getReading, languages } from './i18n/catalogs';
import { prepareIntent } from './sigil/intent';
import { forgeLegacySigil } from './sigil/legacy';
import { MAX_MONOGRAM_LETTERS } from './sigil/monogram/forge';
import { loadGlyphs } from './sigil/monogram/glyphs';
import MonogramStudio from './sigil/monogram/MonogramStudio';
import { getCard } from './tarot/cards';
import IllustratedReading from './tarot/IllustratedReading';
import LegacyCardArt from './tarot/LegacyCardArt';

export default function App() {
  const [step, setStep] = useState(0);
  const [intent, setIntent] = useState('');
  const [inputMode, setInputMode] = useState('monogram');
  const [locale, setLocale] = useState('en');
  const [prepared, setPrepared] = useState(null);
  const [sigil, setSigil] = useState(null);
  const [resonance, setResonance] = useState(null);
  const [status, setStatus] = useState(null);
  const [unsupported, setUnsupported] = useState([]);
  const [preparing, setPreparing] = useState(false);
  const [focused, setFocused] = useState(false);
  const [muted, setMuted] = useState(false);
  const activeAudio = useRef(null);
  const { language, messages } = getInterface(locale);
  const reading = resonance && getReading(locale, resonance.id);
  const illustrated = inputMode === 'monogram' && resonance?.illustration
    ? getReading(locale, resonance.id, 'expanded')
    : null;

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => () => {
    activeAudio.current?.pause();
    activeAudio.current = null;
  }, []);

  const purge = () => {
    if (activeAudio.current) {
      activeAudio.current.pause();
      activeAudio.current.currentTime = 0;
      activeAudio.current = null;
    }
    setIntent('');
    setPrepared(null);
    setSigil(null);
    setResonance(null);
    setStatus(null);
    setUnsupported([]);
    setFocused(false);
    setStep(0);
  };

  const processIntent = async () => {
    if (preparing) return;
    setUnsupported([]);
    if (inputMode === 'monogram' && intent.length > 4096) {
      setStatus('monogramTooLong');
      return;
    }
    const result = prepareIntent(intent, inputMode);
    if (!result) {
      setStatus(intent.trim() ? 'intentNoLetters' : 'intentEmpty');
      return;
    }
    setStatus(null);

    if (inputMode === 'monogram') {
      if (result.letters.length > MAX_MONOGRAM_LETTERS) {
        setStatus('monogramTooLong');
        return;
      }
      setPreparing(true);
      try {
        const { glyphs, unsupported: missing } = await loadGlyphs(result.letters);
        if (missing.length) {
          setUnsupported(missing);
          setStatus('monogramUnsupported');
          return;
        }
        setPrepared({ ...result, glyphs });
      } catch {
        setStatus('monogramLoadFailed');
        return;
      } finally {
        setPreparing(false);
      }
    } else {
      setPrepared(result);
    }
    setStep(1);
  };

  const createSigil = () => {
    if (inputMode === 'monogram') {
      setStep(3);
      return;
    }
    const result = forgeLegacySigil(prepared);
    if (!result) {
      setStatus('canvasUnavailable');
      return;
    }
    setStatus(null);
    setSigil(result);
    setStep(3);
  };

  const calculateResonance = () => {
    const selected = getCard(prepared.cardId);
    setResonance(selected);
    setStep(4);

    const sound = new Audio(publicAsset(selected.audio));
    sound.volume = 0.5;
    if (inputMode === 'monogram' && selected.illustration) sound.muted = muted;
    activeAudio.current?.pause();
    activeAudio.current = sound;
    sound.play().catch(() => {
      if (activeAudio.current === sound) setStatus('audioUnavailable');
    });
  };

  const toggleCue = () => {
    if (activeAudio.current) activeAudio.current.muted = !muted;
    setMuted(!muted);
  };

  return (
    <div
      className={focused ? 'sf-focus-mode' : undefined}
      style={{
        backgroundColor: '#080a08',
        color: '#00ff41',
        minHeight: '100vh',
        width: '100vw',
        margin: 0,
        padding: '40px 0',
        overflowX: 'hidden',
        fontFamily: 'monospace',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <style>
        {`
          .sf-container, .sf-textarea, .sf-resonance-art {
            box-sizing: border-box;
          }
          .sf-focus-mode .sf-header,
          .sf-focus-mode .sf-interface-language,
          .sf-focus-mode .sf-footer {
            display: none !important;
          }
          .sf-focus-mode .sf-main-panel {
            border-color: transparent !important;
          }
          .sf-setting {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 8px 12px;
          }
          .sf-interface-language {
            margin-bottom: 24px;
          }
          .sf-setting select {
            background: #050505;
            border: 1px solid #00ff41;
            color: inherit;
            font: inherit;
            max-width: 100%;
            padding: 6px;
          }
          .sf-setting p {
            flex-basis: 100%;
            margin: 0;
          }

          @media (max-width: 768px) {
            .sf-container {
              padding: 16px !important;
            }
            .sf-header {
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: 16px !important;
            }
            .sf-header-title {
              font-size: 2.4rem !important;
              line-height: 1.1 !important;
              word-break: break-word !important;
            }
            .sf-header-logo {
              width: 72px !important;
              height: 72px !important;
            }
            .sf-main-panel {
              padding: 20px !important;
            }
            .sf-textarea {
              height: 120px !important;
              font-size: 1.1rem !important;
              padding: 14px !important;
            }
            .sf-primary-btn,
            .sf-secondary-btn,
            .sf-full-btn {
              padding: 16px !important;
              font-size: 1rem !important;
            }
            .sf-flex-row {
              flex-direction: column !important;
            }
            .sf-letters-display {
              font-size: 2.6rem !important;
              padding: 24px 8px !important;
              word-break: break-word !important;
            }
            .sf-sigil-wrapper {
              padding: 20px !important;
            }
            .sf-resonance-card {
              padding: 24px !important;
            }
            .sf-resonance-title {
              font-size: 1.8rem !important;
              letter-spacing: 2px !important;
            }
            .sf-resonance-theme {
              font-size: 1rem !important;
            }
            .sf-resonance-text {
              font-size: 0.95rem !important;
            }
            .sf-footer {
              padding: 0 16px;
              font-size: 0.8rem !important;
            }
          }
        `}
      </style>

      <div className="sf-container" style={{ width: '100%', maxWidth: '800px', padding: '20px' }}>
        <div
          className="sf-header"
          style={{
            border: '3px solid #00ff41',
            padding: '30px',
            marginBottom: '40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#050505'
          }}
        >
          <div>
            <h1
              className="sf-header-title"
              style={{
                fontSize: '3.5rem',
                fontWeight: '900',
                color: '#00ff41',
                margin: 0,
                letterSpacing: '2px',
                textShadow: '3px 3px 0px #ff4444'
              }}
            >
              SIGIL.FORGE
            </h1>
            <p
              style={{
                color: '#00ff41',
                margin: '10px 0 0 0',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              {inputMode === 'monogram' ? messages.monogramSubtitle : messages.subtitle}
            </p>
            <p
              style={{
                color: '#00ff41',
                margin: '10px 0 0 0',
                fontSize: '1rem',
                fontWeight: 'bold',
                whiteSpace: 'nowrap'
              }}
            >
              <span
                style={{
                  color: '#ffffff',
                  textShadow: '0 0 8px #00ff41, 0 0 16px #00ff41'
                }}
              >
                o
              </span>
              {' '}{messages.motto}{' '}
              <span
                style={{
                  color: '#ffffff',
                  textShadow: '0 0 8px #00ff41, 0 0 16px #00ff41'
                }}
              >
                o
              </span>
            </p>
          </div>
          <img
            src={publicAsset('logo.jpg')}
            className="sf-header-logo"
            style={{
              width: '100px',
              height: '100px',
              border: '2px solid #ff4444',
              filter: 'drop-shadow(0 0 10px #ff4444)',
              backgroundColor: '#000'
            }}
            alt={messages.logoAlt}
          />
        </div>

        <div
          className="sf-main-panel"
          style={{ border: '2px solid #ff4444', padding: '40px', backgroundColor: '#050505' }}
        >
          <div className="sf-setting sf-interface-language">
            <label htmlFor="interface-language">{messages.interfaceLanguage}</label>
            <select id="interface-language" value={locale} onChange={event => setLocale(event.target.value)}>
              {Object.entries(languages).map(([code, name]) => (
                <option key={code} value={code} lang={code}>{name}</option>
              ))}
            </select>
            {locale !== language && <p role="status">{messages.interfaceFallback}</p>}
          </div>
          {status && (
            <p role="alert">
              {messages[status]} {status === 'monogramUnsupported' && <bdi>{unsupported.join(' · ')}</bdi>}
            </p>
          )}

          {step === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div className="sf-setting">
                <label htmlFor="input-mode">{messages.inputMode}</label>
                <select
                  id="input-mode"
                  value={inputMode}
                  disabled={preparing}
                  onChange={event => {
                    setInputMode(event.target.value);
                    setStatus(null);
                  }}
                >
                  <option value="monogram">{messages.monogramMode}</option>
                  <option value="unicode">{messages.unicodeMode}</option>
                </select>
              </div>
              <label htmlFor="intent" style={{ color: '#ff4444', margin: 0 }}>{messages.intentLabel}</label>
              <textarea
                id="intent"
                className="sf-textarea"
                style={{
                  width: '100%',
                  height: '150px',
                  backgroundColor: '#000',
                  border: '1px solid #ff4444',
                  padding: '20px',
                  color: '#00ff41',
                  fontSize: '1.5rem',
                  outline: 'none',
                  resize: 'none',
                  caretColor: '#ff4444',
                  fontFamily: 'monospace'
                }}
                value={intent}
                disabled={preparing}
                onChange={event => {
                  setIntent(event.target.value);
                  setStatus(null);
                }}
                placeholder={messages.intentPlaceholder}
              />
              <button
                onClick={processIntent}
                disabled={preparing}
                className="sf-full-btn"
                style={{
                  width: '100%',
                  padding: '20px',
                  backgroundColor: 'transparent',
                  color: '#00ff41',
                  border: '2px solid #00ff41',
                  fontWeight: '900',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  fontFamily: 'monospace'
                }}
              >
                {preparing ? messages.monogramLoading : messages.execute}
              </button>
            </div>
          )}

          {step === 1 && (
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#ff4444', marginBottom: '20px', textAlign: 'left' }}>
                {messages.reduced}
              </p>
              <div
                className="sf-letters-display"
                style={{
                  fontSize: prepared.letters.length > 10 ? '3rem' : '5rem',
                  color: '#ff4444',
                  fontWeight: '900',
                  padding: '40px 0',
                  marginBottom: '40px',
                  border: '1px solid #ff4444',
                  backgroundColor: '#000',
                  letterSpacing: '5px',
                  wordBreak: 'break-all'
                }}
              >
                {prepared.letters.join('')}
              </div>
              <div className="sf-flex-row" style={{ display: 'flex', gap: '20px' }}>
                <button
                  onClick={createSigil}
                  className="sf-primary-btn"
                  style={{
                    flex: 2,
                    padding: '25px',
                    backgroundColor: '#ff4444',
                    color: '#000',
                    fontWeight: '900',
                    fontSize: '1.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    animation: 'button-pulse 2s infinite ease-in-out',
                    fontFamily: 'monospace'
                  }}
                >
                  <style>
                    {`@keyframes button-pulse { 
                      0% { box-shadow: 0 0 15px rgba(255, 68, 68, 0.4); transform: scale(1); } 
                      50% { box-shadow: 0 0 35px rgba(255, 68, 68, 0.8); transform: scale(1.02); } 
                      100% { box-shadow: 0 0 15px rgba(255, 68, 68, 0.4); transform: scale(1); } 
                    }`}
                  </style>
                  {messages.forge}
                </button>
                <button
                  onClick={purge}
                  className="sf-secondary-btn"
                  style={{
                    flex: 1,
                    padding: '25px',
                    border: '1px solid #00ff41',
                    color: '#00ff41',
                    backgroundColor: 'transparent',
                    fontWeight: '900',
                    cursor: 'pointer',
                    fontFamily: 'monospace'
                  }}
                >
                  {messages.cancel}
                </button>
              </div>
            </div>
          )}

          {step === 3 && inputMode === 'monogram' && (
            <MonogramStudio
              prepared={prepared}
              messages={messages}
              focused={focused}
              setFocused={setFocused}
              onAnalyze={calculateResonance}
              onReset={purge}
            />
          )}

          {step === 3 && sigil && (
            <div>
              <p style={{ color: '#ff4444', marginBottom: '20px' }}>{messages.forged}</p>
              <div
                className="sf-sigil-wrapper"
                style={{
                  border: '1px solid #ff4444',
                  backgroundColor: '#000',
                  padding: '40px',
                  marginBottom: '30px',
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <img
                  src={sigil.src}
                  alt={messages.sigilAlt}
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    display: 'block',
                    animation: 'sigil-glow 3s infinite ease-in-out',
                    border: '1px solid rgba(255, 68, 68, 0.2)'
                  }}
                />
                <style>
                  {`@keyframes sigil-glow { 
                    0% { filter: drop-shadow(0 0 5px #ff4444); transform: scale(1); } 
                    50% { filter: drop-shadow(0 0 25px #ff4444); transform: scale(1.01); } 
                    100% { filter: drop-shadow(0 0 5px #ff4444); transform: scale(1); } 
                  }`}
                </style>
              </div>
              <div style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
                <button
                  onClick={calculateResonance}
                  className="sf-full-btn"
                  style={{
                    width: '100%',
                    padding: '25px',
                    backgroundColor: '#FF0000',
                    color: '#fff',
                    fontWeight: '900',
                    fontSize: '1.2rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'monospace'
                  }}
                >
                  {messages.analyze}
                </button>
                <div className="sf-flex-row" style={{ display: 'flex', gap: '20px' }}>
                  <button
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = sigil.src;
                      a.download = sigil.filename;
                      a.click();
                    }}
                    className="sf-secondary-btn"
                    style={{
                      flex: 1,
                      padding: '25px',
                      border: '1px solid #ff4444',
                      color: '#ff4444',
                      backgroundColor: 'transparent',
                      fontWeight: '900',
                      fontSize: '1.2rem',
                      cursor: 'pointer',
                      fontFamily: 'monospace'
                    }}
                  >
                    {messages.download}
                  </button>
                  <button
                    onClick={purge}
                    className="sf-secondary-btn"
                    style={{
                      flex: 1,
                      padding: '25px',
                      border: '2px solid #00ff41',
                      color: '#00ff41',
                      backgroundColor: 'transparent',
                      fontWeight: '900',
                      cursor: 'pointer',
                      fontFamily: 'monospace'
                    }}
                  >
                    {messages.forgeNew}
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 4 && illustrated && (
            <IllustratedReading
              key={resonance.id}
              illustration={resonance.illustration}
              reading={illustrated}
              original={reading}
              interfaceLanguage={language}
              messages={messages}
              muted={muted}
              onMute={toggleCue}
              onDismiss={purge}
            />
          )}

          {step === 4 && resonance && !illustrated && (
            <div style={{ textAlign: 'center', animation: 'screen-shake 0.5s ease-out both' }}>
              <style>
                {`
                  @keyframes screen-shake { 
                    0% { transform: translate(0, 0) scale(1); filter: hue-rotate(0deg); } 
                    10% { transform: translate(-5px, 5px) scale(1.02); filter: hue-rotate(90deg); } 
                    20% { transform: translate(5px, -5px) scale(1.01); filter: hue-rotate(-90deg); } 
                    30% { transform: translate(-5px, -2px) scale(1.02); } 
                    40% { transform: translate(2px, 2px) scale(1); } 
                    50% { transform: translate(-1px, -1px) scale(1); filter: hue-rotate(0deg); } 
                    100% { transform: translate(0, 0); } 
                  }
                  @keyframes glitch-red-blue { 
                    0% { text-shadow: 2px 0 #ff4444, -2px 0 #00ff41; } 
                    20% { text-shadow: -3px 0 #ff4444, 3px 0 #00ff41; } 
                    40% { text-shadow: 2px 0 #ff4444, -2px 0 #00ff41; } 
                    100% { text-shadow: 0 0 0px transparent; } 
                  }
                  @keyframes vhs-flicker { 
                    0% { opacity: 0.6; filter: brightness(0.9); } 
                    5% { opacity: 1; filter: brightness(1.5); } 
                    10% { opacity: 0.15; } 
                    100% { opacity: 0.65; filter: brightness(0.85); } 
                  }
                  @keyframes typewriter { 
                    from { opacity: 0; transform: translateY(10px); } 
                    to { opacity: 1; transform: translateY(0); } 
                  }
                `}
              </style>
              <p style={{ color: '#00ff41', marginBottom: '10px', fontSize: '1.2rem' }}>
                {messages.resonance}
              </p>
              {reading.language !== language && <p>{messages.tarotFallback}</p>}
              <div
                className="sf-resonance-card"
                lang={reading.language}
                style={{
                  border: '2px solid #00ff41',
                  padding: '40px',
                  backgroundColor: '#000',
                  marginBottom: '30px',
                  boxShadow: '0 0 20px rgba(0, 255, 65, 0.2)'
                }}
              >
                <h2
                  className="sf-resonance-title"
                  style={{
                    fontSize: '2.5rem',
                    color: '#00ff41',
                    margin: '0 0 10px 0',
                    letterSpacing: '4px',
                    animation: 'glitch-red-blue 0.4s ease-out 2'
                  }}
                >
                  {reading.name}
                </h2>
                <h3
                  className="sf-resonance-theme"
                  style={{
                    fontSize: '1.2rem',
                    color: '#ff4444',
                    margin: '0 0 20px 0',
                    opacity: 0.8
                  }}
                >
                  {reading.theme}
                </h3>
                <div
                  className="sf-resonance-art"
                  style={{
                    width: '100%',
                    border: '1px solid #00ff41',
                    margin: '20px 0',
                    backgroundColor: '#000',
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <LegacyCardArt cardId={resonance.id} intentLength={intent.length} />
                </div>
                <p
                  className="sf-resonance-text"
                  style={{
                    color: '#f5f1f1',
                    fontSize: '1.1rem',
                    lineHeight: '1.6',
                    fontStyle: 'normal',
                    animation: 'typewriter 2s ease-out forwards'
                  }}
                >
                  "{reading.text}"
                </p>
              </div>
              <button
                onClick={purge}
                className="sf-full-btn"
                style={{
                  width: '100%',
                  padding: '25px',
                  border: '2px solid #ff4444',
                  color: '#ff4444',
                  backgroundColor: 'transparent',
                  fontWeight: '900',
                  cursor: 'pointer',
                  fontFamily: 'monospace'
                }}
              >
                {messages.returnToVoid}
              </button>
            </div>
          )}
        </div>

        <div
          className="sf-footer"
          style={{
            marginTop: '30px',
            textAlign: 'center',
            fontSize: '0.9rem',
            color: '#00ff41',
            opacity: 0.6,
            letterSpacing: '1px'
          }}
        >
          {messages.footer}
        </div>
      </div>
    </div>
  );
}
