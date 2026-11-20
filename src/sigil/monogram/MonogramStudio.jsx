import { useEffect, useMemo, useRef, useState } from 'react';
import { downloadMonogram, MONOGRAM_INK, monogramPng, monogramSvg } from './export';
import { forgeMonogram } from './forge';
import './monogram.css';

export default function MonogramStudio({ prepared, messages, focused, setFocused, onAnalyze, onReset }) {
  const title = useRef(null);
  const [layout, setLayout] = useState('shared');
  const [variant, setVariant] = useState(0);
  const [construction, setConstruction] = useState({ mode: 'forge' });
  const [transparent, setTransparent] = useState(true);
  const [exportState, setExportState] = useState('idle');
  const sigil = useMemo(() => forgeMonogram(prepared.glyphs, {
    seed: prepared.seed, variant, layout,
  }), [prepared, variant, layout]);
  const { size, paths } = sigil;
  const replay = construction?.mode === 'replay' ? construction : null;
  const forgeInterval = Math.min(86, 1120 / paths.length);
  const replayInterval = Math.min(290, 1800 / Math.max(1, paths.length - 1));

  useEffect(() => title.current?.focus(), []);

  useEffect(() => {
    if (!focused) return undefined;
    const escape = event => {
      if (event.key === 'Escape') setFocused(false);
    };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [focused, setFocused]);

  useEffect(() => {
    if (!replay || replay.visible >= paths.length) return undefined;
    const timer = window.setTimeout(() => {
      setConstruction(current => current === replay ? {
        mode: 'replay', visible: current.visible + 1,
      } : current);
    }, replay.visible === 0 ? 200 : replayInterval);
    return () => window.clearTimeout(timer);
  }, [replay, paths.length, replayInterval]);

  function generateVariation() {
    setVariant(value => value + 1);
    setConstruction(null);
  }

  function reveal() {
    setConstruction({ mode: 'replay', visible: 0 });
  }

  async function exportSigil(extension) {
    setExportState('working');
    try {
      const blob = extension === 'svg'
        ? new Blob([monogramSvg(sigil, transparent)], { type: 'image/svg+xml' })
        : await monogramPng(sigil, transparent);
      downloadMonogram(blob, extension);
      setExportState('idle');
    } catch {
      setExportState('failed');
    }
  }

  return (
    <section className={`monogram${focused ? ' monogram--focus' : ''}`} aria-label={messages.monogramMode}>
      <header className="monogram__heading">
        {!focused && <h2 ref={title} tabIndex={-1}>{messages.monogramMode}</h2>}
        <button type="button" onClick={() => {
          setConstruction(null);
          setFocused(!focused);
        }} aria-pressed={focused}>
          {focused ? messages.exitFocus : messages.focusView}
        </button>
      </header>

      <div className="monogram__workspace">
        <div className="monogram__plate">
          <svg
            role="img"
            aria-label={messages.monogramAlt}
            viewBox={`0 0 ${size} ${size}`}
            fill="none"
            stroke={MONOGRAM_INK}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <g className={replay ? 'monogram__replay' : undefined}>
              {paths.map(({ d, width }, index) => {
                const hidden = replay !== null && index >= replay.visible;
                return (
                  <path
                    key={index}
                    d={d}
                    strokeWidth={width}
                    pathLength="1"
                    visibility={hidden ? 'hidden' : undefined}
                    className={construction && !hidden ? 'monogram__drawing-stroke' : undefined}
                    style={construction?.mode === 'forge' ? { '--stroke-delay': `${index * forgeInterval}ms` } : undefined}
                  />
                );
              })}
            </g>
          </svg>
        </div>

        {!focused && (
          <div className="monogram__controls">
            <div className="monogram__actions">
              <button type="button" aria-pressed={layout === 'spiral'} onClick={() => {
                setLayout(current => current === 'spiral' ? 'shared' : 'spiral');
                setVariant(0);
                setConstruction(null);
              }}>{messages.spiralLayout}</button>
              <button type="button" onClick={generateVariation}>{messages.variation}</button>
              <button type="button" onClick={reveal}>{messages.revealConstruction}</button>
            </div>

            <fieldset className="monogram__export">
              <legend>{messages.exportSigil}</legend>
              <div className="monogram__actions">
                <button type="button" disabled={exportState === 'working'} onClick={() => exportSigil('svg')}>
                  {messages.exportSvg}
                </button>
                <button type="button" disabled={exportState === 'working'} onClick={() => exportSigil('png')}>
                  {messages.exportPng}
                </button>
              </div>
              <label>
                <input type="checkbox" checked={transparent} onChange={event => setTransparent(event.target.checked)} />
                {messages.transparentExport}
              </label>
              {exportState === 'failed' && <p role="alert">{messages.exportFailed}</p>}
            </fieldset>
          </div>
        )}
      </div>

      {!focused && (
        <div className="monogram__footer monogram__actions">
          <button type="button" className="monogram__primary" onClick={onAnalyze}>{messages.analyze}</button>
          <button type="button" onClick={onReset}>{messages.forgeNew}</button>
        </div>
      )}
    </section>
  );
}
