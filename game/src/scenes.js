// The three scenes. Each scene is a draw function plus its list of
// differences. draw(ctx, active) paints the picture; `active` is the set of
// difference ids applied to this panel — empty for the left picture, all of
// them for the right one. Every decorative dot comes from the stateless
// scatter() in random.js, so the two panels agree on everything except the
// differences themselves. Each difference carries its hit circle (x, y, r)
// and a label, shown when it is found.

import { bird, cloud, disc, glow, house, panel, pine, ring, roundTree, sailboat, sky, star, text } from './draw.js';
import { scatter } from './random.js';

function crescent(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, Math.PI * 0.35, Math.PI * 1.65);
  ctx.arc(x + r * 0.45, y - r * 0.15, r * 0.82, Math.PI * 1.55, Math.PI * 0.45, true);
  ctx.closePath();
  ctx.fill();
}

function glitter(ctx, cx, top, bottom, half, count, group, color) {
  for (let i = 0; i < count; i++) {
    const y = scatter(group, i, top, bottom);
    const spread = half * (0.4 + 0.6 * ((y - top) / (bottom - top)));
    const x = cx + scatter(group + 1, i, -spread, spread);
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.25 + scatter(group + 2, i, 0, 0.6);
    ctx.fillRect(x, y, scatter(group + 3, i, 2, 9), 1.6);
  }
  ctx.globalAlpha = 1;
}

// ---------------------------------------------------------------- harbour
function drawHarbour(ctx, active) {
  sky(ctx, 560, 360, [[0, '#1b1040'], [0.35, '#4a1e63'], [0.6, '#9e3d6e'], [0.85, '#e8735a'], [1, '#ffb066']]);
  for (let i = 0; i < 26; i++) {
    star(ctx, scatter(11, i, 10, 550), scatter(12, i, 8, 190), scatter(13, i, 1.2, 2.6), 'rgba(255,240,210,0.9)');
  }
  glow(ctx, 400, 300, 150, 'rgba(255,190,90,0.5)');
  disc(ctx, 400, 300, 46, '#ffd97a');
  disc(ctx, 400, 300, 38, '#ffe9a8');
  if (active.has('moon')) crescent(ctx, 90, 80, 24, '#f5e9c8');
  cloud(ctx, 150, 150, 0.9, 'rgba(255,180,150,0.5)');
  cloud(ctx, 330, 108, 1.1, 'rgba(255,170,140,0.45)');
  cloud(ctx, 485, 185, 0.7, 'rgba(255,190,160,0.4)');
  bird(ctx, 180, 120, 1, '#2a1840');
  if (!active.has('bird')) bird(ctx, 230, 100, 0.9, '#2a1840');
  bird(ctx, 280, 130, 1.1, '#2a1840');

  // Sea.
  const sea = ctx.createLinearGradient(0, 360, 0, 560);
  sea.addColorStop(0, '#ff9e5e');
  sea.addColorStop(0.25, '#c65a6e');
  sea.addColorStop(0.6, '#4a2a6e');
  sea.addColorStop(1, '#1c1440');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 360, 560, 200);
  glitter(ctx, 400, 372, 540, 70, 42, 14, '#ffd98a');

  // Headland with three cottages.
  ctx.fillStyle = '#241a3d';
  ctx.beginPath();
  ctx.moveTo(0, 362);
  ctx.quadraticCurveTo(55, 320, 110, 318);
  ctx.quadraticCurveTo(165, 320, 212, 356);
  ctx.lineTo(212, 362);
  ctx.closePath();
  ctx.fill();
  house(ctx, 30, 288, 44, 44, '#5a3d5e', '#33204a', [
    { dx: 7, dy: 12, w: 10, h: 12, lit: true },
    { dx: 27, dy: 12, w: 10, h: 12, lit: false },
  ]);
  house(ctx, 88, 282, 48, 48, '#6e4a63', '#3a2448', [
    { dx: 8, dy: 12, w: 10, h: 12, lit: true },
    { dx: 30, dy: 12, w: 10, h: 12, lit: !active.has('window') },
  ]);
  house(ctx, 146, 292, 42, 40, '#52406b', '#2e1d42', [
    { dx: 7, dy: 10, w: 10, h: 12, lit: false },
    { dx: 25, dy: 10, w: 10, h: 12, lit: true },
  ]);

  // Lighthouse on the rocks.
  ctx.fillStyle = '#1d1533';
  ctx.beginPath();
  ctx.ellipse(478, 362, 52, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f2ead8';
  ctx.beginPath();
  ctx.moveTo(462, 362);
  ctx.lineTo(470, 204);
  ctx.lineTo(490, 204);
  ctx.lineTo(498, 362);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#c93a4a';
  ctx.fillRect(465, 232, 30, 18);
  if (!active.has('stripes')) ctx.fillRect(467, 272, 26, 18);
  ctx.fillRect(469, 312, 22, 18);
  ctx.fillStyle = '#2a1c33';
  ctx.fillRect(466, 190, 28, 16);
  glow(ctx, 480, 198, 34, 'rgba(255,230,150,0.55)');
  disc(ctx, 480, 198, 6, '#ffe9a0');
  ctx.strokeStyle = '#2a1c33';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(480, 190);
  ctx.lineTo(480, 166);
  ctx.stroke();
  ctx.fillStyle = active.has('flag') ? '#ffd23e' : '#d84a3a';
  ctx.beginPath();
  ctx.moveTo(480, 166);
  ctx.lineTo(458, 172);
  ctx.lineTo(480, 180);
  ctx.closePath();
  ctx.fill();

  // Pier.
  ctx.fillStyle = '#4a3220';
  ctx.fillRect(0, 428, 150, 10);
  for (const px of [20, 70, 120]) ctx.fillRect(px, 436, 8, 26);
  ctx.fillStyle = '#5d4028';
  ctx.fillRect(0, 428, 150, 4);

  // Boats.
  sailboat(ctx, 300, 442, 1, active.has('sail') ? '#3a6fd8' : '#d84a3a', '#5d3a28');
  ctx.fillStyle = '#6e4a30';
  ctx.beginPath();
  ctx.moveTo(118, 478);
  ctx.lineTo(168, 478);
  ctx.lineTo(158, 490);
  ctx.lineTo(128, 490);
  ctx.closePath();
  ctx.fill();

  // Buoy and the jumping fish.
  if (!active.has('buoy')) {
    disc(ctx, 430, 476, 9, '#ff7a2e');
    ctx.fillStyle = '#ffd23e';
    ctx.fillRect(428, 462, 4, 10);
    disc(ctx, 430, 460, 3, '#ffd23e');
  }
  if (active.has('fish')) {
    ctx.strokeStyle = '#bfe3f7';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(240, 398, 12, Math.PI * 1.15, Math.PI * 1.95);
    ctx.stroke();
    ctx.fillStyle = '#bfe3f7';
    ctx.beginPath();
    ctx.moveTo(228, 390);
    ctx.lineTo(220, 384);
    ctx.lineTo(224, 394);
    ctx.closePath();
    ctx.fill();
    disc(ctx, 252, 388, 2, '#bfe3f7');
    disc(ctx, 226, 406, 2, '#bfe3f7');
  }

  // Foreground rocks.
  ctx.fillStyle = '#191029';
  ctx.beginPath();
  ctx.ellipse(24, 552, 46, 16, 0, 0, Math.PI * 2);
  ctx.ellipse(536, 548, 40, 14, 0, 0, Math.PI * 2);
  ctx.fill();
}

const HARBOUR_DIFFS = [
  { id: 'moon', x: 90, y: 80, r: 26, label: 'A moon rises' },
  { id: 'bird', x: 230, y: 100, r: 20, label: 'A bird flew off' },
  { id: 'window', x: 123, y: 298, r: 15, label: 'A window went dark' },
  { id: 'stripes', x: 480, y: 280, r: 30, label: 'A lighthouse stripe is missing' },
  { id: 'flag', x: 462, y: 174, r: 18, label: 'The flag changed colour' },
  { id: 'sail', x: 300, y: 405, r: 30, label: 'The sail changed colour' },
  { id: 'buoy', x: 430, y: 472, r: 18, label: 'The buoy drifted away' },
  { id: 'fish', x: 240, y: 395, r: 22, label: 'A fish jumped' },
];

// ------------------------------------------------------------------- camp
const FLY2 = { x: scatter(23, 2, 80, 480), y: scatter(24, 2, 380, 520) };

function drawCamp(ctx, active) {
  sky(ctx, 560, 560, [[0, '#0b1026'], [0.5, '#16224d'], [1, '#24406b']]);
  for (let i = 0; i < 30; i++) {
    star(ctx, scatter(21, i, 10, 550), scatter(22, i, 8, 250), scatter(23, i, 1.1, 2.4), 'rgba(220,235,255,0.9)');
  }
  if (!active.has('star')) star(ctx, 300, 70, 5, '#fff6c8');
  glow(ctx, 440, 90, 90, 'rgba(245,237,208,0.35)');
  if (active.has('moon')) {
    crescent(ctx, 440, 90, 34, '#f5edd0');
  } else {
    disc(ctx, 440, 90, 34, '#f5edd0');
    disc(ctx, 428, 80, 6, '#ddd2ac');
    disc(ctx, 452, 100, 4.5, '#ddd2ac');
    disc(ctx, 436, 104, 3.5, '#ddd2ac');
  }

  // Mountains and ground.
  ctx.fillStyle = '#1d2f52';
  ctx.beginPath();
  ctx.moveTo(0, 330);
  ctx.lineTo(110, 240);
  ctx.lineTo(210, 320);
  ctx.lineTo(320, 232);
  ctx.lineTo(430, 318);
  ctx.lineTo(560, 250);
  ctx.lineTo(560, 330);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#16233d';
  ctx.beginPath();
  ctx.moveTo(0, 350);
  ctx.lineTo(150, 290);
  ctx.lineTo(280, 348);
  ctx.lineTo(420, 292);
  ctx.lineTo(560, 345);
  ctx.lineTo(560, 360);
  ctx.lineTo(0, 360);
  ctx.closePath();
  ctx.fill();
  const ground = ctx.createLinearGradient(0, 360, 0, 560);
  ground.addColorStop(0, '#22331d');
  ground.addColorStop(1, '#121a10');
  ctx.fillStyle = ground;
  ctx.fillRect(0, 360, 560, 200);
  ctx.fillStyle = '#2a3d24';
  ctx.beginPath();
  ctx.ellipse(280, 462, 220, 62, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pines.
  pine(ctx, 60, 362, 1.3, '#12261a', '#1d3a26');
  pine(ctx, 120, 342, 1.0, '#12261a', '#1d3a26');
  pine(ctx, 172, 366, 0.8, '#12261a', '#1d3a26');
  pine(ctx, 470, 356, 1.2, '#12261a', '#1d3a26');
  pine(ctx, 522, 342, 0.9, '#12261a', '#1d3a26');
  pine(ctx, 420, 352, 0.7, '#12261a', '#1d3a26');

  // Owl on a branch.
  ctx.strokeStyle = '#3a2a1a';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(118, 232);
  ctx.lineTo(168, 226);
  ctx.stroke();
  if (!active.has('owl')) {
    ctx.fillStyle = '#6e5136';
    ctx.beginPath();
    ctx.ellipse(150, 214, 13, 17, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(140, 200);
    ctx.lineTo(144, 192);
    ctx.lineTo(148, 200);
    ctx.moveTo(152, 200);
    ctx.lineTo(156, 192);
    ctx.lineTo(160, 200);
    ctx.fill();
    disc(ctx, 145, 210, 4, '#ffe9a0');
    disc(ctx, 155, 210, 4, '#ffe9a0');
    disc(ctx, 145, 210, 2, '#1a1208');
    disc(ctx, 155, 210, 2, '#1a1208');
  }

  // Tent.
  ctx.fillStyle = '#e8734a';
  ctx.beginPath();
  ctx.moveTo(150, 420);
  ctx.lineTo(205, 344);
  ctx.lineTo(260, 420);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#a34a2e';
  ctx.beginPath();
  ctx.moveTo(185, 420);
  ctx.lineTo(205, 372);
  ctx.lineTo(225, 420);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,220,180,0.6)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(205, 344);
  ctx.lineTo(150, 420);
  ctx.moveTo(205, 344);
  ctx.lineTo(260, 420);
  ctx.stroke();
  if (!active.has('flag')) {
    ctx.strokeStyle = '#3a2a1a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(205, 344);
    ctx.lineTo(205, 326);
    ctx.stroke();
    ctx.fillStyle = '#ffd23e';
    ctx.beginPath();
    ctx.moveTo(205, 326);
    ctx.lineTo(221, 331);
    ctx.lineTo(205, 336);
    ctx.closePath();
    ctx.fill();
  }

  // Lantern on a tripod.
  ctx.strokeStyle = '#4a3520';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(265, 372);
  ctx.lineTo(250, 414);
  ctx.moveTo(265, 372);
  ctx.lineTo(280, 414);
  ctx.moveTo(265, 372);
  ctx.lineTo(265, 414);
  ctx.stroke();
  if (!active.has('lantern')) glow(ctx, 265, 398, 44, 'rgba(255,200,110,0.5)');
  ctx.fillStyle = '#2a1c10';
  ctx.fillRect(258, 386, 14, 4);
  ctx.fillStyle = active.has('lantern') ? '#3a3226' : '#ffd97a';
  ctx.fillRect(258, 390, 14, 18);
  ctx.fillStyle = '#2a1c10';
  ctx.fillRect(258, 408, 14, 3);

  // Campfire.
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    disc(ctx, 330 + Math.cos(a) * 26, 448 + Math.sin(a) * 10, 5, '#6e6a62');
  }
  ctx.strokeStyle = '#4a2c18';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(312, 452);
  ctx.lineTo(330, 432);
  ctx.lineTo(348, 452);
  ctx.stroke();
  if (!active.has('logs')) {
    ctx.beginPath();
    ctx.moveTo(318, 454);
    ctx.lineTo(342, 454);
    ctx.stroke();
  }
  glow(ctx, 330, 428, 46, 'rgba(255,140,50,0.45)');
  ctx.fillStyle = '#ff7a2e';
  ctx.beginPath();
  ctx.moveTo(330, 398);
  ctx.quadraticCurveTo(348, 424, 344, 448);
  ctx.quadraticCurveTo(330, 454, 316, 448);
  ctx.quadraticCurveTo(312, 424, 330, 398);
  ctx.fill();
  ctx.fillStyle = '#ffd23e';
  ctx.beginPath();
  ctx.moveTo(330, 414);
  ctx.quadraticCurveTo(341, 430, 339, 448);
  ctx.quadraticCurveTo(330, 452, 321, 448);
  ctx.quadraticCurveTo(319, 430, 330, 414);
  ctx.fill();
  for (let i = 0; i < 8; i++) {
    glow(ctx, scatter(25, i, 312, 348), scatter(26, i, 368, 404), 4, 'rgba(255,190,90,0.8)');
  }

  // Backpack, sleeping bag, mushrooms, log and axe.
  ctx.fillStyle = active.has('pack') ? '#b03a30' : '#4a7a3a';
  panel(ctx, 132, 438, 36, 40, 10, active.has('pack') ? '#b03a30' : '#4a7a3a');
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(132, 456, 36, 6);
  panel(ctx, 224, 464, 62, 20, 10, '#3a6fd8');
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fillRect(240, 464, 6, 20);
  ctx.fillRect(258, 464, 6, 20);
  const shrooms = [[412, 482, 1], [428, 476, 1.25]];
  if (!active.has('shrooms')) shrooms.push([444, 482, 0.9]);
  for (const [mx, my, ms] of shrooms) {
    ctx.fillStyle = '#e8ddc8';
    ctx.fillRect(mx - 3 * ms, my - 8 * ms, 6 * ms, 10 * ms);
    ctx.fillStyle = '#d8402e';
    ctx.beginPath();
    ctx.arc(mx, my - 8 * ms, 9 * ms, Math.PI, 0);
    ctx.fill();
    disc(ctx, mx - 3 * ms, my - 12 * ms, 1.6, '#fff');
    disc(ctx, mx + 3 * ms, my - 10 * ms, 1.3, '#fff');
  }
  ctx.fillStyle = '#5d4028';
  ctx.beginPath();
  ctx.ellipse(480, 448, 26, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#8a6a44';
  ctx.beginPath();
  ctx.ellipse(480, 446, 26, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  if (!active.has('axe')) {
    ctx.strokeStyle = '#8a6a44';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(482, 446);
    ctx.lineTo(494, 416);
    ctx.stroke();
    ctx.fillStyle = '#9aa4ad';
    ctx.beginPath();
    ctx.moveTo(494, 416);
    ctx.lineTo(506, 408);
    ctx.lineTo(510, 420);
    ctx.lineTo(498, 424);
    ctx.closePath();
    ctx.fill();
  }

  // Fireflies.
  for (let i = 0; i < 5; i++) {
    if (active.has('firefly') && i === 2) continue;
    glow(ctx, scatter(23, i, 80, 480), scatter(24, i, 380, 520), 7, 'rgba(200,255,140,0.85)');
  }
}

const CAMP_DIFFS = [
  { id: 'moon', x: 440, y: 90, r: 34, label: 'The moon changed phase' },
  { id: 'star', x: 300, y: 70, r: 16, label: 'A bright star went out' },
  { id: 'owl', x: 150, y: 212, r: 22, label: 'The owl flew away' },
  { id: 'flag', x: 210, y: 331, r: 16, label: 'The tent flag is gone' },
  { id: 'logs', x: 330, y: 448, r: 24, label: 'A fire log is missing' },
  { id: 'lantern', x: 265, y: 399, r: 20, label: 'The lantern went out' },
  { id: 'pack', x: 150, y: 458, r: 24, label: 'The backpack changed colour' },
  { id: 'shrooms', x: 430, y: 478, r: 22, label: 'A mushroom vanished' },
  { id: 'firefly', x: FLY2.x, y: FLY2.y, r: 16, label: 'A firefly blinked out' },
  { id: 'axe', x: 492, y: 420, r: 20, label: 'The axe is gone' },
];

// ----------------------------------------------------------------- market
function clockHands(ctx, x, y, hour, minute) {
  const ha = ((hour % 12) / 12) * Math.PI * 2 - Math.PI / 2;
  const ma = (minute / 60) * Math.PI * 2 - Math.PI / 2;
  ctx.strokeStyle = '#2a2a2a';
  ctx.lineCap = 'round';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(ha) * 13, y + Math.sin(ha) * 13);
  ctx.stroke();
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(ma) * 19, y + Math.sin(ma) * 19);
  ctx.stroke();
  disc(ctx, x, y, 2.5, '#2a2a2a');
}

function drawMarket(ctx, active) {
  sky(ctx, 560, 560, [[0, '#7ec0ee'], [0.6, '#bfe3f7'], [1, '#fdf0c8']]);
  glow(ctx, 482, 70, 70, 'rgba(255,240,160,0.6)');
  disc(ctx, 482, 70, 28, '#ffdf6e');
  cloud(ctx, 120, 80, 1, 'rgba(255,255,255,0.85)');
  cloud(ctx, 300, 55, 0.8, 'rgba(255,255,255,0.8)');
  cloud(ctx, 520, 140, 0.7, 'rgba(255,255,255,0.7)');

  // Buildings.
  ctx.fillStyle = '#f2dfbc';
  ctx.fillRect(0, 180, 140, 180);
  ctx.fillStyle = '#c96a4a';
  ctx.fillRect(420, 180, 140, 180);
  ctx.fillStyle = '#e8c890';
  ctx.fillRect(140, 210, 110, 150);
  ctx.fillRect(310, 210, 110, 150);
  for (const wx of [24, 68, 112]) {
    panel(ctx, wx, 220, 26, 34, 3, '#7ec0ee', '#8a6a44');
  }
  for (const wx of [444, 488, 524]) {
    panel(ctx, wx, 220, 26, 34, 3, '#7ec0ee', '#6e3a28');
  }
  // Flower pots on the left sills.
  for (const wx of [24, 68, 112]) {
    ctx.fillStyle = '#b03a30';
    ctx.fillRect(wx + 4, 256, 18, 8);
    disc(ctx, wx + 8, 252, 4, '#ff6a8a');
    disc(ctx, wx + 18, 252, 4, '#ffd23e');
  }

  // Clock tower.
  ctx.fillStyle = '#d8c8a8';
  ctx.fillRect(250, 60, 60, 220);
  ctx.fillStyle = '#8a6a44';
  ctx.beginPath();
  ctx.moveTo(246, 60);
  ctx.lineTo(280, 28);
  ctx.lineTo(314, 60);
  ctx.closePath();
  ctx.fill();
  disc(ctx, 280, 26, 4, '#8a6a44');
  disc(ctx, 280, 110, 28, '#fdf8ea');
  ring(ctx, 280, 110, 28, '#8a6a44', 3);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    disc(ctx, 280 + Math.cos(a) * 23, 110 + Math.sin(a) * 23, 1.6, '#2a2a2a');
  }
  if (active.has('clock')) clockHands(ctx, 280, 110, 2, 35);
  else clockHands(ctx, 280, 110, 10, 10);

  // Cobblestones.
  ctx.fillStyle = '#b8a894';
  ctx.fillRect(0, 360, 560, 200);
  ctx.strokeStyle = 'rgba(90,70,50,0.35)';
  ctx.lineWidth = 1.5;
  for (let row = 0; row < 6; row++) {
    const y = 372 + row * 32;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(560, y);
    ctx.stroke();
    for (let col = 0; col < 12; col++) {
      const x = col * 48 + (row % 2 ? 24 : 0);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + 30);
      ctx.stroke();
    }
  }
  if (!active.has('puddle')) {
    ctx.fillStyle = 'rgba(150,200,235,0.75)';
    ctx.beginPath();
    ctx.ellipse(300, 515, 42, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath();
    ctx.ellipse(288, 512, 14, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Bunting and lantern strings.
  ctx.strokeStyle = '#5d4028';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(60, 140);
  ctx.quadraticCurveTo(280, 210, 500, 140);
  ctx.stroke();
  const flagColors = ['#d8402e', '#ffd23e', '#3a6fd8', '#d8402e', '#ffd23e', '#3a6fd8', '#d8402e', '#ffd23e', '#3a6fd8'];
  for (let i = 0; i < 9; i++) {
    const t = 0.1 + i * 0.1;
    const x = (1 - t) * (1 - t) * 60 + 2 * (1 - t) * t * 280 + t * t * 500;
    const y = (1 - t) * (1 - t) * 140 + 2 * (1 - t) * t * 210 + t * t * 140;
    ctx.fillStyle = active.has('bunting') && i === 4 ? '#2e9e5b' : flagColors[i];
    ctx.beginPath();
    ctx.moveTo(x - 8, y);
    ctx.lineTo(x + 8, y);
    ctx.lineTo(x, y + 15);
    ctx.closePath();
    ctx.fill();
  }
  ctx.strokeStyle = '#5d4028';
  ctx.beginPath();
  ctx.moveTo(40, 210);
  ctx.quadraticCurveTo(280, 262, 520, 210);
  ctx.stroke();
  const lanternTs = [0.15, 0.32, 0.5, 0.68, 0.85];
  lanternTs.forEach((t, i) => {
    if (active.has('lantern') && i === 2) return;
    const x = (1 - t) * (1 - t) * 40 + 2 * (1 - t) * t * 280 + t * t * 520;
    const y = (1 - t) * (1 - t) * 210 + 2 * (1 - t) * t * 262 + t * t * 210;
    ctx.strokeStyle = '#5d4028';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + 6);
    ctx.stroke();
    ctx.fillStyle = ['#ff8a5c', '#ffd23e', '#ff6a8a', '#7ec8e8', '#9ed86a'][i];
    ctx.beginPath();
    ctx.ellipse(x, y + 14, 8, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  // Balloons.
  const balloons = [[458, 160, '#d8402e'], [472, 148, '#ffd23e'], [486, 162, '#3a6fd8']];
  balloons.forEach(([bx, by, bc], i) => {
    if (active.has('balloons') && i === 1) return;
    ctx.strokeStyle = 'rgba(60,40,20,0.6)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(bx, by + 14);
    ctx.quadraticCurveTo(bx + 4, by + 30, bx - 2, by + 44);
    ctx.stroke();
    ctx.fillStyle = bc;
    ctx.beginPath();
    ctx.ellipse(bx, by, 10, 13, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  // Left stall with striped awning.
  const stripeA = active.has('awning') ? '#3a6fd8' : '#d8402e';
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i % 2 ? '#fdf8ea' : stripeA;
    ctx.beginPath();
    ctx.moveTo(40 + i * 17, 292);
    ctx.lineTo(57 + i * 17, 292);
    ctx.lineTo(57 + i * 17, 312);
    ctx.lineTo(40 + i * 17, 312);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = '#8a6a44';
  ctx.fillRect(40, 312, 102, 6);
  ctx.fillRect(44, 318, 6, 40);
  ctx.fillRect(132, 318, 6, 40);
  ctx.fillStyle = '#a8825a';
  ctx.fillRect(40, 356, 102, 34);
  ctx.fillStyle = '#7a5a38';
  ctx.fillRect(40, 356, 102, 6);
  // Fruit crates.
  ctx.fillStyle = '#8a6a44';
  ctx.fillRect(52, 392, 34, 22);
  ctx.fillRect(112, 396, 34, 22);
  for (let i = 0; i < 4; i++) disc(ctx, 60 + i * 8, 390, 5, '#d8402e');
  for (let i = 0; i < 4; i++) disc(ctx, 120 + i * 8, 394, 5, active.has('fruit') ? '#ff8a2e' : '#d8402e');

  // Right stall.
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i % 2 ? '#fdf8ea' : '#2e9e5b';
    ctx.beginPath();
    ctx.moveTo(420 + i * 17, 292);
    ctx.lineTo(437 + i * 17, 292);
    ctx.lineTo(437 + i * 17, 312);
    ctx.lineTo(420 + i * 17, 312);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = '#8a6a44';
  ctx.fillRect(420, 312, 102, 6);
  ctx.fillRect(424, 318, 6, 40);
  ctx.fillRect(512, 318, 6, 40);
  ctx.fillStyle = '#a8825a';
  ctx.fillRect(420, 356, 102, 34);
  ctx.fillStyle = '#7a5a38';
  ctx.fillRect(420, 356, 102, 6);
  for (let i = 0; i < 5; i++) disc(ctx, 432 + i * 16, 352, 6, '#9ed86a');

  // Chalkboard sign.
  ctx.fillStyle = '#5d4028';
  ctx.beginPath();
  ctx.moveTo(336, 428);
  ctx.lineTo(344, 380);
  ctx.lineTo(356, 380);
  ctx.lineTo(364, 428);
  ctx.closePath();
  ctx.fill();
  panel(ctx, 330, 372, 56, 44, 4, '#2e3a2e', '#5d4028');
  text(ctx, 'TODAY:', 358, 386, 9, '#fdf8ea');
  text(ctx, active.has('sign') ? 'SOUR' : 'SOUP', 358, 402, 11, '#ffd23e');

  // Barrel with a cat.
  ctx.fillStyle = '#8a6a44';
  ctx.beginPath();
  ctx.ellipse(455, 398, 16, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#6e5232';
  ctx.fillRect(439, 392, 32, 4);
  ctx.fillRect(439, 406, 32, 4);
  if (!active.has('cat')) {
    ctx.fillStyle = '#e8963a';
    ctx.beginPath();
    ctx.ellipse(455, 372, 11, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    disc(ctx, 455, 360, 7, '#e8963a');
    ctx.beginPath();
    ctx.moveTo(449, 356);
    ctx.lineTo(451, 349);
    ctx.lineTo(455, 355);
    ctx.moveTo(455, 355);
    ctx.lineTo(459, 349);
    ctx.lineTo(461, 356);
    ctx.fill();
    ctx.strokeStyle = '#e8963a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(465, 376);
    ctx.quadraticCurveTo(474, 372, 472, 362);
    ctx.stroke();
  }

  // Dog.
  if (!active.has('dog')) {
    ctx.fillStyle = '#8a5a30';
    ctx.beginPath();
    ctx.ellipse(140, 462, 18, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    disc(ctx, 156, 448, 9, '#8a5a30');
    ctx.beginPath();
    ctx.moveTo(150, 442);
    ctx.lineTo(152, 434);
    ctx.lineTo(157, 441);
    ctx.fill();
    ctx.strokeStyle = '#8a5a30';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(124, 458);
    ctx.quadraticCurveTo(114, 452, 116, 444);
    ctx.stroke();
    ctx.fillStyle = '#5d4028';
    ctx.fillRect(130, 470, 5, 10);
    ctx.fillRect(146, 470, 5, 10);
  }

  // Bicycle with a basket.
  ctx.strokeStyle = '#3a3a3a';
  ctx.lineWidth = 2.5;
  ring(ctx, 500, 452, 14, '#3a3a3a', 2.5);
  ring(ctx, 536, 452, 14, '#3a3a3a', 2.5);
  ctx.beginPath();
  ctx.moveTo(500, 452);
  ctx.lineTo(514, 428);
  ctx.lineTo(536, 452);
  ctx.moveTo(514, 428);
  ctx.lineTo(508, 428);
  ctx.moveTo(514, 428);
  ctx.lineTo(524, 418);
  ctx.moveTo(524, 418);
  ctx.lineTo(540, 420);
  ctx.stroke();
  if (!active.has('bike')) {
    ctx.fillStyle = '#a8825a';
    ctx.beginPath();
    ctx.moveTo(536, 420);
    ctx.lineTo(552, 420);
    ctx.lineTo(549, 436);
    ctx.lineTo(538, 436);
    ctx.closePath();
    ctx.fill();
  }

  // Pigeons.
  const pigeons = [[220, 490], [250, 500], [280, 488]];
  pigeons.forEach(([px, py], i) => {
    if (active.has('pigeons') && i === 1) return;
    ctx.fillStyle = '#8a8a9a';
    ctx.beginPath();
    ctx.ellipse(px, py, 8, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    disc(ctx, px + 6, py - 6, 4, '#8a8a9a');
    ctx.fillStyle = '#d8902e';
    ctx.beginPath();
    ctx.moveTo(px + 9, py - 6);
    ctx.lineTo(px + 13, py - 5);
    ctx.lineTo(px + 9, py - 4);
    ctx.closePath();
    ctx.fill();
  });

  // Round trees framing the street.
  roundTree(ctx, 30, 400, 0.9, '#5d4028', '#3e7a34');
  roundTree(ctx, 540, 330, 0.7, '#5d4028', '#4a8a3c');
}

const MARKET_DIFFS = [
  { id: 'clock', x: 280, y: 110, r: 26, label: 'The clock shows another time' },
  { id: 'bunting', x: 280, y: 182, r: 16, label: 'A bunting flag changed colour' },
  { id: 'lantern', x: 280, y: 238, r: 18, label: 'A lantern is missing' },
  { id: 'awning', x: 90, y: 302, r: 30, label: 'The awning changed colour' },
  { id: 'fruit', x: 130, y: 396, r: 22, label: 'Apples turned to oranges' },
  { id: 'sign', x: 358, y: 394, r: 24, label: 'The sign says something else' },
  { id: 'balloons', x: 472, y: 158, r: 26, label: 'A balloon floated off' },
  { id: 'cat', x: 455, y: 372, r: 22, label: 'The cat wandered off' },
  { id: 'dog', x: 140, y: 458, r: 24, label: 'The dog ran off' },
  { id: 'bike', x: 543, y: 428, r: 20, label: 'The basket is gone' },
  { id: 'pigeons', x: 250, y: 498, r: 18, label: 'A pigeon flew off' },
  { id: 'puddle', x: 300, y: 515, r: 26, label: 'The puddle dried up' },
];

// ------------------------------------------------------------------ export
export const SCENES = [
  { id: 'harbour', name: 'Harbour at Dusk', draw: drawHarbour, diffs: HARBOUR_DIFFS },
  { id: 'camp', name: 'Forest Camp', draw: drawCamp, diffs: CAMP_DIFFS },
  { id: 'market', name: 'Market Street', draw: drawMarket, diffs: MARKET_DIFFS },
];

export function sceneById(id) {
  return SCENES.find((s) => s.id === id);
}
