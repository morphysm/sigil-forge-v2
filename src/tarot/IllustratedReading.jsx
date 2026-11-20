import { useEffect, useRef, useState } from 'react';
import { publicAsset } from '../assets';
import './illustrated-reading.css';

export default function IllustratedReading({
  illustration, reading, original, interfaceLanguage, messages, muted, onMute, onDismiss,
}) {
  const [plateStatus, setPlateStatus] = useState('loading');
  const title = useRef(null);

  useEffect(() => {
    title.current?.focus();
  }, []);

  const facets = [
    [messages.tarotArchetype, reading.archetype],
    [messages.tarotMorphystic, reading.morphystic],
    [messages.tarotIntent, reading.intentReflection],
    [messages.tarotTension, reading.tension],
  ];

  return (
    <article className="illustrated-reading" aria-labelledby="illustrated-title">
      <p className="illustrated-reading__status">{messages.resonance}</p>
      <div className="illustrated-reading__layout">
        <div className="illustrated-reading__plate">
          {plateStatus === 'error' ? (
            <p className="illustrated-reading__plate-error" role="status">
              {messages.tarotPlateUnavailable}
            </p>
          ) : (
            <img
              className={plateStatus === 'ready' ? 'illustrated-reading__face' : undefined}
              src={publicAsset(illustration.src)}
              srcSet={`${publicAsset(illustration.small)} 420w, ${publicAsset(illustration.src)} ${illustration.width}w`}
              sizes="(max-width: 380px) 70vw, 17.5rem"
              width={illustration.width}
              height={illustration.height}
              alt={reading.artAlt}
              lang={reading.language}
              decoding="async"
              onLoad={() => setPlateStatus('ready')}
              onError={() => setPlateStatus('error')}
            />
          )}
        </div>
        <div className="illustrated-reading__copy">
          {reading.language !== interfaceLanguage && (
            <p className="illustrated-reading__language-note">{messages.tarotFallback}</p>
          )}
          <header className="illustrated-reading__header" lang={reading.language}>
            <span className="illustrated-reading__numeral">{illustration.numeral}</span>
            <h2 id="illustrated-title" tabIndex={-1} ref={title}>{reading.name}</h2>
            <p>{reading.theme}</p>
          </header>
          <dl className="illustrated-reading__facets">
            {facets.map(([label, text]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd lang={reading.language}>{text}</dd>
              </div>
            ))}
          </dl>
          <p className="illustrated-reading__question" lang={reading.language}>{reading.question}</p>
          <p className="illustrated-reading__closing" lang={reading.language}>{reading.closing}</p>
          <details className="illustrated-reading__original">
            <summary>{messages.tarotOriginal}</summary>
            {original.language !== interfaceLanguage && original.language !== reading.language && (
              <p>{messages.tarotFallback}</p>
            )}
            <p lang={original.language}>{original.text}</p>
          </details>
        </div>
      </div>
      <footer className="illustrated-reading__actions">
        <button type="button" className="illustrated-reading__mute" aria-pressed={muted} onClick={onMute}>
          {messages.tarotMuteCue}
        </button>
        <button type="button" className="illustrated-reading__dismiss" onClick={onDismiss}>
          {messages.returnToVoid}
        </button>
      </footer>
    </article>
  );
}
