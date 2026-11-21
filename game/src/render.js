// Draws one picture panel: the scene, then everything the game adds on top
// of it — the gold rings on the differences already found, the pulsing hint
// ring, the red cross of a wrong click, and floating score text. `now` is
// passed in so screenshot mode can freeze time and render deterministically.

import { PANEL } from './config.js';

function foundRing(ctx, diff, age) {
  const pop = age < 240 ? 0.6 + (age / 240) * 0.55 : 1.15 - Math.min(0.15, (age - 240) / 4000);
  const r = diff.r + 10;
  ctx.save();
  ctx.strokeStyle = '#ffd23e';
  ctx.lineWidth = 4;
  ctx.shadowColor = 'rgba(255,210,62,0.9)';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, r * pop, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, r * pop - 5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function hintRing(ctx, diff, now) {
  const pulse = 1 + 0.12 * Math.sin(now / 160);
  ctx.save();
  ctx.strokeStyle = '#7ec8e8';
  ctx.lineWidth = 4;
  ctx.setLineDash([10, 8]);
  ctx.lineDashOffset = -now / 40;
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, (diff.r + 12) * pulse, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function missCross(ctx, x, y, age) {
  const alpha = Math.max(0, 1 - age / 700);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = '#ff5a4a';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 10, y - 10);
  ctx.lineTo(x + 10, y + 10);
  ctx.moveTo(x + 10, y - 10);
  ctx.lineTo(x - 10, y + 10);
  ctx.stroke();
  ctx.restore();
}

function floatText(ctx, fx, fy, text, age) {
  const rise = Math.min(26, age / 18);
  const alpha = Math.max(0, 1 - age / 1100);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.font = '700 20px "Trebuchet MS", Verdana, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineWidth = 4;
  ctx.strokeStyle = 'rgba(20,12,40,0.85)';
  ctx.strokeText(text, fx, fy - rise);
  ctx.fillStyle = text.startsWith('-') ? '#ff8a7a' : '#ffd23e';
  ctx.fillText(text, fx, fy - rise);
  ctx.restore();
}

export function drawPanel(canvas, scene, active, overlays, now) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, PANEL, PANEL);
  scene.draw(ctx, active);
  for (const [id, at] of overlays.found) {
    const diff = scene.diffs.find((d) => d.id === id);
    if (diff) foundRing(ctx, diff, now - at);
  }
  if (overlays.hint && now < overlays.hint.until) {
    const diff = scene.diffs.find((d) => d.id === overlays.hint.id);
    if (diff) hintRing(ctx, diff, now);
  }
  for (const miss of overlays.misses) {
    if (now - miss.at < 700) missCross(ctx, miss.x, miss.y, now - miss.at);
  }
  for (const fl of overlays.floats) {
    if (now - fl.at < 1100) floatText(ctx, fl.x, fl.y, fl.text, now - fl.at);
  }
}
