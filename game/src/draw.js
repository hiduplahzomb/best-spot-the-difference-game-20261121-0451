// Shared drawing helpers: the small shapes every scene is built from. Each
// helper draws one thing and takes its position, size and colours as plain
// arguments, so a scene reads like a list of what is in the picture.

export function sky(ctx, w, h, stops) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  for (const [at, color] of stops) g.addColorStop(at, color);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

export function disc(ctx, x, y, r, color) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

export function ring(ctx, x, y, r, color, width) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

export function glow(ctx, x, y, r, color) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

export function star(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fill();
}

export function cloud(ctx, x, y, s, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, 42 * s, 15 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(x - 28 * s, y + 5 * s, 26 * s, 11 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 30 * s, y + 5 * s, 28 * s, 12 * s, 0, 0, Math.PI * 2);
  ctx.fill();
}

export function bird(ctx, x, y, s, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.2 * s;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 12 * s, y);
  ctx.quadraticCurveTo(x - 6 * s, y - 7 * s, x, y);
  ctx.quadraticCurveTo(x + 6 * s, y - 7 * s, x + 12 * s, y);
  ctx.stroke();
}

export function pine(ctx, x, y, s, dark, light) {
  ctx.fillStyle = '#4a3220';
  ctx.fillRect(x - 4 * s, y - 14 * s, 8 * s, 16 * s);
  for (let i = 0; i < 3; i++) {
    const w = (44 - i * 11) * s;
    const top = y - (62 - i * 16) * s;
    const base = y - (30 - i * 16) * s;
    ctx.fillStyle = i % 2 ? light : dark;
    ctx.beginPath();
    ctx.moveTo(x, top);
    ctx.lineTo(x + w / 2, base);
    ctx.lineTo(x - w / 2, base);
    ctx.closePath();
    ctx.fill();
  }
}

export function roundTree(ctx, x, y, s, trunk, leaf) {
  ctx.fillStyle = trunk;
  ctx.fillRect(x - 5 * s, y - 26 * s, 10 * s, 28 * s);
  ctx.fillStyle = leaf;
  ctx.beginPath();
  ctx.arc(x, y - 44 * s, 26 * s, 0, Math.PI * 2);
  ctx.arc(x - 20 * s, y - 30 * s, 18 * s, 0, Math.PI * 2);
  ctx.arc(x + 20 * s, y - 30 * s, 18 * s, 0, Math.PI * 2);
  ctx.fill();
}

export function house(ctx, x, y, w, h, body, roof, windows) {
  ctx.fillStyle = body;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = roof;
  ctx.beginPath();
  ctx.moveTo(x - 6, y);
  ctx.lineTo(x + w / 2, y - h * 0.55);
  ctx.lineTo(x + w + 6, y);
  ctx.closePath();
  ctx.fill();
  for (const win of windows) {
    ctx.fillStyle = win.lit ? '#ffd97a' : '#2c2340';
    ctx.fillRect(x + win.dx, y + win.dy, win.w, win.h);
    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + win.dx, y + win.dy, win.w, win.h);
  }
}

export function sailboat(ctx, x, y, s, sail, hull) {
  ctx.fillStyle = '#3a2c22';
  ctx.fillRect(x - 1.5 * s, y - 52 * s, 3 * s, 52 * s);
  ctx.fillStyle = sail;
  ctx.beginPath();
  ctx.moveTo(x + 3 * s, y - 50 * s);
  ctx.lineTo(x + 3 * s, y - 8 * s);
  ctx.lineTo(x + 34 * s, y - 8 * s);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - 3 * s, y - 44 * s);
  ctx.lineTo(x - 3 * s, y - 8 * s);
  ctx.lineTo(x - 24 * s, y - 8 * s);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = hull;
  ctx.beginPath();
  ctx.moveTo(x - 38 * s, y - 6 * s);
  ctx.lineTo(x + 38 * s, y - 6 * s);
  ctx.lineTo(x + 28 * s, y + 8 * s);
  ctx.lineTo(x - 28 * s, y + 8 * s);
  ctx.closePath();
  ctx.fill();
}

export function text(ctx, str, x, y, size, color, align = 'center', weight = 700) {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px "Trebuchet MS", Verdana, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(str, x, y);
}

export function panel(ctx, x, y, w, h, r, fill, stroke) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}
