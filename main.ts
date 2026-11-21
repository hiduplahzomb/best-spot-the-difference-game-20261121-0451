// The Other Shore — hand-in program (Node 22, standard library only).
//
// The game itself is the static files under game/ (index.html plus its ES
// modules, no build step, no network request). This program hands it in: it
// copies game/ and screenshots/ from beside this file into the output
// directory and writes dossier.json, the summary the judge reads, with the
// vendored make.fun library. The scorer rebuilds that dossier with the same
// library and requires the two to match byte for byte, so the dossier is
// always written by buildDossier, never by hand.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// In the grader's container MAKEFUN_OUTPUT_DIR is unset and /output is used.
// The program is deterministic: two runs write the same bytes.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repo = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(repo, 'game'), join(out, 'game'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(repo, 'screenshots'))) {
  cpSync(join(repo, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The scorer's own caps: the text budget shapes the dossier's bytes, and the
// rest refuse an entry the scorer would refuse (too many or too large
// screenshots; too many files or bytes under game/; a path under game/ over
// 1000 bytes). game/ shares /output's own 1000-entry cap with screenshots/
// and dossier.json.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
