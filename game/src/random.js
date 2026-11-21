// Deterministic scatter for the scenes: a stateless hash, so the two panels
// of a level always agree on every decorative dot, star and sparkle. There is
// no shared random state anywhere in the drawing code, which means a
// difference can only ever come from a difference spec, never from a drifting
// random stream.

export function hash01(n) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

// A stable pseudo-random value in [min, max) for the i-th item of a group.
export function scatter(group, i, min, max) {
  return min + hash01(group * 7919 + i * 104729) * (max - min);
}
