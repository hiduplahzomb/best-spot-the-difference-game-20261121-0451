// The frame around the pictures: the counter, the timer bar, the hints, the
// score, the level cards on the start screen, the toast that names each find,
// and the overlays for a finished level, a run-out clock and the whole game.

import { LOW_TIME } from './config.js';

const $ = (id) => document.getElementById(id);

export function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function updateHud(state) {
  const scene = state.scene;
  $('levelName').textContent = scene.name;
  $('counter').textContent = `${state.found.size} / ${scene.diffs.length}`;
  $('timerText').textContent = formatTime(state.timeLeft);
  const bar = $('timerBar');
  bar.style.width = `${Math.max(0, (state.timeLeft / state.levelTime) * 100)}%`;
  bar.classList.toggle('urgent', state.timeLeft <= LOW_TIME);
  $('timerText').classList.toggle('urgent', state.timeLeft <= LOW_TIME);
  $('hints').textContent = '●'.repeat(state.hintsLeft) + '○'.repeat(3 - state.hintsLeft);
  $('hintBtn').disabled = state.hintsLeft <= 0 || !!state.hint;
  $('score').textContent = String(state.score);
}

let toastTimer = null;
export function showToast(text) {
  const toast = $('toast');
  toast.textContent = text;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
}

export function showOverlay(innerHTML) {
  $('overlayCard').innerHTML = innerHTML;
  $('overlay').hidden = false;
}

export function hideOverlay() {
  $('overlay').hidden = true;
}

export function buildLevelCards(scenes, levels, onPick) {
  const wrap = $('levelCards');
  wrap.innerHTML = '';
  scenes.forEach((scene, i) => {
    const level = levels[i];
    const card = document.createElement('button');
    card.className = 'level-card';
    card.type = 'button';
    const preview = document.createElement('canvas');
    preview.width = 200;
    preview.height = 200;
    preview.className = 'level-preview';
    const pctx = preview.getContext('2d');
    pctx.save();
    pctx.scale(200 / 560, 200 / 560);
    scene.draw(pctx, new Set());
    pctx.restore();
    const label = document.createElement('span');
    label.className = 'level-label';
    label.innerHTML = `<b>${i + 1}. ${scene.name}</b><br>${scene.diffs.length} differences · ${formatTime(level.time)}`;
    card.append(preview, label);
    card.addEventListener('click', () => onPick(i));
    wrap.appendChild(card);
  });
}

export function starsHTML(stars) {
  return `<div class="stars">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>`;
}
