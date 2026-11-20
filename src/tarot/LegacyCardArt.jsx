import { useCallback } from 'react';

export default function LegacyCardArt({ cardId, intentLength }) {
  const draw = useCallback(canvas => {
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, 64, 64);
    ctx.fillStyle = '#de0a18ef';
    for (let x = 0; x < 32; x += 4) {
      for (let y = 0; y < 64; y += 4) {
        const noise = Math.sin(x * cardId + y * intentLength);
        if (noise > 0.2) {
          ctx.fillRect(x, y, 4, 4);
          ctx.fillRect(64 - x - 4, y, 4, 4);
        }
      }
    }
    ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
    for (let i = 0; i < 64; i += 2) {
      ctx.fillRect(0, i, 64, 1);
    }
  }, [cardId, intentLength]);

  return (
    <canvas
      ref={draw}
      aria-hidden="true"
      width="64"
      height="64"
      style={{
        position: 'relative',
        width: '180px',
        height: '180px',
        imageRendering: 'pixelated',
        border: '2px solid #00ff41',
        backgroundColor: '#050505',
        animation: 'vhs-flicker 0.66s infinite alternate',
        filter: 'contrast(1.9) brightness(1.2) drop-shadow(0 0 5px rgba(0, 255, 65, 0.5))',
      }}
    />
  );
}
