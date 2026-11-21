// The Other Shore — a spot-the-difference game.
// Two pictures side by side, one of them changed: find every difference
// before the clock runs out. Three scenes, each harder than the last.

import { HINT_MS, LEVELS, PANEL, SCORE_FIND, SCORE_MISTAKE, TIME_PENALTY } from './config.js';
import { SCENES } from './scenes.js';
import { drawPanel } from './render.js';
import { attachPanelInput, hitTest } from './input.js';
import { playClick, playFind, playMiss, playWin, unlockAudio } from './audio.js';
import { buildLevelCards, formatTime, hideOverlay, showOverlay, showToast, starsHTML, updateHud } from './hud.js';
import { SHOT_NOW, applyShot, readShot } from './shots.js';

const $ = (id) => document.getElementById(id);
const leftCanvas = $('panelLeft');
const rightCanvas = $('panelRight');

const state = {
  screen: 'start',
  levelIndex: 0,
  scene: SCENES[0],
  levelTime: LEVELS[0].time,
  found: new Map(),
  hint: null,
  misses: [],
  floats: [],
  hintsLeft: LEVELS[0].hints,
  timeLeft: LEVELS[0].time,
  score: 0,
  mistakes: 0,
  streak: 0,
  frozen: false,
  shot: false,
  over: false,
};

function allDiffs() {
  return new Set(state.scene.diffs.map((d) => d.id));
}

function showScreen(name) {
  state.screen = name;
  $('startScreen').hidden = name !== 'start';
  $('playScreen').hidden = name !== 'play';
  $('topbar').classList.toggle('playing', name === 'play');
}

function startLevel(index) {
  state.levelIndex = index;
  state.scene = SCENES[index];
  state.levelTime = LEVELS[index].time;
  state.found = new Map();
  state.hint = null;
  state.misses = [];
  state.floats = [];
  state.hintsLeft = LEVELS[index].hints;
  state.timeLeft = LEVELS[index].time;
  state.mistakes = 0;
  state.streak = 0;
  state.over = false;
  hideOverlay();
  showScreen('play');
  updateHud(state);
}

function levelStars() {
  if (state.mistakes === 0 && state.timeLeft > state.levelTime * 0.25) return 3;
  if (state.mistakes <= 2) return 2;
  return 1;
}

function finishLevel() {
  state.over = true;
  const bonus = Math.round(state.timeLeft) * 2;
  state.score += bonus;
  playWin();
  const last = state.levelIndex === SCENES.length - 1;
  showOverlay(`
    ${starsHTML(levelStars())}
    <h2>${last ? 'Every shore explored!' : 'Level complete!'}</h2>
    <p class="overlay-sub">${state.scene.name} · all ${state.scene.diffs.length} differences found</p>
    <p class="overlay-score">Time bonus +${bonus} · Score ${state.score}</p>
    <div class="overlay-buttons">
      ${last
        ? `<button class="btn primary" id="ovMenu">Back to the menu</button>`
        : `<button class="btn primary" id="ovNext">Next level →</button>
           <button class="btn" id="ovAgain">Replay level</button>`}
    </div>`);
  const next = $('ovNext');
  if (next) next.addEventListener('click', () => { playClick(); startLevel(state.levelIndex + 1); });
  const again = $('ovAgain');
  if (again) again.addEventListener('click', () => { playClick(); startLevel(state.levelIndex); });
  const menu = $('ovMenu');
  if (menu) menu.addEventListener('click', () => { playClick(); hideOverlay(); showScreen('start'); });
  updateHud(state);
}

function timeUp() {
  state.over = true;
  playMiss();
  showOverlay(`
    <h2>Out of time</h2>
    <p class="overlay-sub">${state.scene.name} · ${state.found.size} of ${state.scene.diffs.length} differences found</p>
    <p class="overlay-score">Score ${state.score}</p>
    <div class="overlay-buttons">
      <button class="btn primary" id="ovRetry">Try again</button>
      <button class="btn" id="ovMenu2">Back to the menu</button>
    </div>`);
  $('ovRetry').addEventListener('click', () => { playClick(); startLevel(state.levelIndex); });
  $('ovMenu2').addEventListener('click', () => { playClick(); hideOverlay(); showScreen('start'); });
}

function useHint() {
  if (state.screen !== 'play' || state.over || state.hintsLeft <= 0 || state.hint) return;
  const remaining = state.scene.diffs.filter((d) => !state.found.has(d.id));
  if (!remaining.length) return;
  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  state.hintsLeft -= 1;
  state.hint = { id: pick.id, until: performance.now() + HINT_MS };
  playClick();
  updateHud(state);
}

function onPick(x, y) {
  if (state.screen !== 'play' || state.over) return;
  unlockAudio();
  const now = performance.now();
  const diff = hitTest(state.scene, state.found, x, y);
  if (diff) {
    state.found.set(diff.id, now);
    state.streak += 1;
    state.score += SCORE_FIND;
    state.floats.push({ x, y: y - 18, text: `+${SCORE_FIND}`, at: now });
    if (state.hint && state.hint.id === diff.id) state.hint = null;
    playFind(state.streak);
    showToast(`Found: ${diff.label}`);
    if (state.found.size === state.scene.diffs.length) finishLevel();
  } else {
    state.streak = 0;
    state.mistakes += 1;
    state.score = Math.max(0, state.score - SCORE_MISTAKE);
    state.timeLeft = Math.max(0, state.timeLeft - TIME_PENALTY);
    state.misses.push({ x, y, at: now });
    state.floats.push({ x, y: y - 18, text: `-${TIME_PENALTY}s`, at: now });
    playMiss();
    showToast('Not there — 5 seconds lost');
  }
  updateHud(state);
}

function frame(now) {
  const t = state.shot ? SHOT_NOW : now;
  if (state.screen === 'play' && !state.over && !state.frozen) {
    state.timeLeft -= (now - frame.last) / 1000;
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      updateHud(state);
      timeUp();
    } else {
      updateHud(state);
    }
  }
  frame.last = now;
  if (state.hint && t >= state.hint.until) {
    state.hint = null;
    updateHud(state);
  }
  state.misses = state.misses.filter((m) => t - m.at < 700);
  state.floats = state.floats.filter((f) => t - f.at < 1100);
  if (state.screen === 'play') {
    const overlays = { found: state.found, hint: state.hint, misses: state.misses, floats: state.floats };
    drawPanel(leftCanvas, state.scene, new Set(), overlays, t);
    drawPanel(rightCanvas, state.scene, allDiffs(), overlays, t);
  }
  requestAnimationFrame(frame);
}
frame.last = performance.now();

function init() {
  leftCanvas.width = PANEL;
  leftCanvas.height = PANEL;
  rightCanvas.width = PANEL;
  rightCanvas.height = PANEL;
  buildLevelCards(SCENES, LEVELS, (i) => {
    unlockAudio();
    playClick();
    startLevel(i);
  });
  attachPanelInput(leftCanvas, onPick);
  attachPanelInput(rightCanvas, onPick);
  $('hintBtn').addEventListener('click', useHint);
  $('restartBtn').addEventListener('click', () => { playClick(); startLevel(state.levelIndex); });
  $('menuBtn').addEventListener('click', () => { playClick(); hideOverlay(); showScreen('start'); });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'h' || event.key === 'H') useHint();
    if (event.key === 'r' || event.key === 'R') {
      if (state.screen === 'play') startLevel(state.levelIndex);
    }
    if (event.key === 'Escape') {
      hideOverlay();
      showScreen('start');
    }
  });

  const preset = readShot();
  if (preset) {
    const overlayKind = applyShot(state, preset, SCENES);
    showScreen(state.screen);
    updateHud(state);
    if (overlayKind === 'level') {
      const bonus = Math.round(state.timeLeft) * 2;
      showOverlay(`
        ${starsHTML(3)}
        <h2>Level complete!</h2>
        <p class="overlay-sub">${state.scene.name} · all ${state.scene.diffs.length} differences found</p>
        <p class="overlay-score">Time bonus +${bonus} · Score ${state.score}</p>
        <div class="overlay-buttons">
          <button class="btn primary">Next level →</button>
          <button class="btn">Replay level</button>
        </div>`);
    }
  } else {
    showScreen('start');
  }
  requestAnimationFrame(frame);
  window.__READY__ = true;
}

init();
