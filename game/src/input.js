// Pointer input and hit-testing. A click is mapped from page pixels into
// the panel's own 560x560 space, then tested against every difference that
// is still unfound; the nearest hit inside its circle wins.

import { PANEL } from './config.js';

export function attachPanelInput(canvas, onPick) {
  canvas.addEventListener('pointerdown', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * PANEL;
    const y = ((event.clientY - rect.top) / rect.height) * PANEL;
    onPick(x, y);
  });
}

export function hitTest(scene, found, x, y) {
  let best = null;
  let bestD = Infinity;
  for (const diff of scene.diffs) {
    if (found.has(diff.id)) continue;
    const d = Math.hypot(x - diff.x, y - diff.y);
    if (d <= diff.r && d < bestD) {
      best = diff;
      bestD = d;
    }
  }
  return best;
}
