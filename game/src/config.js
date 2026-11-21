// One place for the game's tuning: panel size, per-level time and hints,
// scoring, and the feel of a wrong click. The scenes themselves live in
// scenes.js; this file only says how a level is run.

export const PANEL = 560; // each picture is PANEL x PANEL pixels

export const LEVELS = [
  { id: 'harbour', name: 'Harbour at Dusk', time: 180, hints: 3 },
  { id: 'camp', name: 'Forest Camp', time: 150, hints: 3 },
  { id: 'market', name: 'Market Street', time: 120, hints: 3 },
];

export const SCORE_FIND = 100; // points for each difference found
export const SCORE_MISTAKE = 25; // points lost on a wrong click
export const TIME_PENALTY = 5; // seconds lost on a wrong click
export const HINT_MS = 2500; // how long a hint ring stays visible
export const MARK_MS = 700; // how long a wrong-click cross stays visible
export const LOW_TIME = 30; // seconds left when the timer turns urgent
