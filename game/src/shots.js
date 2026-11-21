// Screenshot presets, driven by the page's query string (see shots.json):
//   ?shot=start                        the title screen with its level cards
//   ?shot=play&level=1&found=0,1,2     mid-game, three differences found
//   ?shot=win&level=1                  the level-complete overlay
// In shot mode the clock is frozen and every animation runs at one fixed
// timestamp, so a screenshot is the same render every time it is taken.

export const SHOT_NOW = 10000;

export function readShot() {
  const params = new URLSearchParams(window.location.search);
  const shot = params.get('shot');
  if (!shot) return null;
  const found = (params.get('found') || '')
    .split(',')
    .filter((s) => s !== '')
    .map((s) => Number(s));
  return {
    shot,
    level: Number(params.get('level') || 1) - 1,
    found,
    timeLeft: 154,
  };
}

// Applies a preset to a fresh state object. Returns the overlay kind the
// preset wants ('level' for a win shot), or null.
export function applyShot(state, preset, scenes) {
  state.frozen = true;
  state.shot = true;
  const levelIndex = Math.min(Math.max(preset.level, 0), scenes.length - 1);
  state.levelIndex = levelIndex;
  state.scene = scenes[levelIndex];
  if (preset.shot === 'start') {
    state.screen = 'start';
    return null;
  }
  state.screen = 'play';
  state.timeLeft = preset.timeLeft;
  if (preset.shot === 'win') {
    for (const diff of state.scene.diffs) state.found.set(diff.id, SHOT_NOW - 400);
    state.score = state.scene.diffs.length * 100 + Math.round(state.timeLeft) * 2;
    return 'level';
  }
  for (const idx of preset.found) {
    const diff = state.scene.diffs[idx];
    if (diff) state.found.set(diff.id, SHOT_NOW - 400);
  }
  state.score = state.found.size * 100;
  return null;
}
