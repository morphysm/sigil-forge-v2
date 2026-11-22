// The original 600 × 600 renderer. All geometry depends on letter count and randomness.
export function forgeLegacySigil({ letters }, random = Math.random) {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = "#050505";
  ctx.fillRect(0, 0, 600, 600);

  ctx.strokeStyle = "rgba(0, 255, 65, 0.12)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 600; i += 25) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 600);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(600, i);
    ctx.stroke();
  }

  ctx.strokeStyle = "#c70c0c";
  ctx.lineWidth = 15;
  ctx.shadowBlur = 15;
  ctx.shadowColor = "#c70c0c";
  ctx.lineCap = "square";
  ctx.lineJoin = "miter";

  ctx.beginPath();
  ctx.moveTo(100 + random() * 400, 100 + random() * 400);
  const nodes = Math.max(4, letters.length);
  for (let i = 0; i < nodes; i++) {
    ctx.lineTo(100 + random() * 400, 100 + random() * 400);
  }
  ctx.stroke();

  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.shadowBlur = 5;
  ctx.stroke();

  return { src: canvas.toDataURL(), filename: 'sigil.png' };
}
