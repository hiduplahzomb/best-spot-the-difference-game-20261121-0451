[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/hiduplahzomb/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/hiduplahzomb/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

# The Other Shore — Spot the Difference

Two pictures of the same place. One of them changed. Find every difference
before the clock runs out.

Three original scenes, each drawn entirely in code (no image assets, no
network): **Harbour at Dusk** (8 differences, 3:00), **Forest Camp**
(10 differences, 2:30) and **Market Street** (12 differences, 2:00). Click a
difference in either picture and it is ringed on both; wrong clicks cost
points and seconds; hints point at one difference, three per level. A
complete run ends with a score, a time bonus and a star rating per level.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

The game is plain static files under `game/` — any static HTTP server works,
and it plays fully offline. `main.ts` hands the game in for make.fun: it
copies `game/` and `screenshots/` to `/output` and writes `dossier.json`.

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=2wgaefze&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
