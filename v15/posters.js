/* Blauwerk 2027 — poster generator (v13), shared by index.html and archive.html.
   120 one-off posters: ~50 layouts × 8 blue colour schemes. Every poster has its own seed,
   title, number and photo, so no two of them are the same. */
(function () {
'use strict';
const NAVY = '#0a1a4a', COBALT = '#1f45e6', ICE = '#dfe7ff', SKY = '#6fa3ff', PAPER = '#f5f7fd', CYAN = '#38c6ff', DEEP = '#06102e', INK = '#0b1433', WHITE = '#ffffff';
const CW = 512, CH = 712;
const TAU = Math.PI * 2;

function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const rgba = (h, a) => { const [r, g, b] = hex(h); return `rgba(${r},${g},${b},${a})`; };
const luma = h => { const [r, g, b] = hex(h); return (r * .3 + g * .59 + b * .11) / 255; };
const on = bg => luma(bg) > .55 ? INK : WHITE;

const SCHEMES = {
  paper:  { bg: PAPER,  ink: NAVY,  a: COBALT, b: SKY,    c: CYAN,  dark: false, duo: [NAVY, PAPER] },
  ice:    { bg: ICE,    ink: NAVY,  a: COBALT, b: WHITE,  c: SKY,   dark: false, duo: [NAVY, ICE] },
  white:  { bg: WHITE,  ink: INK,   a: COBALT, b: ICE,    c: CYAN,  dark: false, duo: [INK, '#eef2ff'] },
  sky:    { bg: SKY,    ink: NAVY,  a: WHITE,  b: COBALT, c: DEEP,  dark: false, duo: [NAVY, '#cfe0ff'] },
  cyan:   { bg: CYAN,   ink: DEEP,  a: WHITE,  b: COBALT, c: NAVY,  dark: false, duo: [DEEP, '#d6f3ff'] },
  cobalt: { bg: COBALT, ink: WHITE, a: NAVY,   b: SKY,    c: CYAN,  dark: true,  duo: [NAVY, SKY] },
  navy:   { bg: NAVY,   ink: WHITE, a: COBALT, b: SKY,    c: CYAN,  dark: true,  duo: [DEEP, SKY] },
  deep:   { bg: DEEP,   ink: ICE,   a: CYAN,   b: COBALT, c: SKY,   dark: true,  duo: [DEEP, CYAN] },
};

const KICKERS = ['OPEN CALL 2027', 'EXHIBITION', 'RADIO EDITION', 'ISSUE 04', 'FIELD NOTES', 'THE INTERVIEW', 'ROTTERDAM / ONLINE', 'EDITION 03', 'ESSAY NO. 3', 'SCREEN PRINT', 'RISOGRAPH · 2 DRUMS', 'OFFSET · 2 COLOURS', 'LETTERPRESS', 'PUBLIC NOTICE', 'A SERIES OF SIX', 'WHAT DO WE OWE', 'EACH OTHER?', 'NIGHT PROGRAM', 'WALL 27', 'FREE ENTRY', 'LECTURE', 'WORKSHOP', 'CITY WALK', 'FROM THE ARCHIVE', 'SPRING 2027', 'LISTENING SESSION', 'IN PRINT', 'FOR NEIGHBOURS', 'CYANOTYPE', 'LIMITED RUN'];
const QUOTES = ['“We owe each other the time to listen.”', '“A wall is a promise kept in public.”', '“Print it twice — one for you, one for them.”', '“Nobody gets home alone.”', '“The street reads faster than we write.”', '“Leave the door the way you found it: open.”'];
const CODES = ['LOS', 'KBP', 'LIS', 'OSL', 'BER', 'MEX', 'HND', 'BOG', 'ACC', 'ICN', 'GRU', 'KEF', 'BOM', 'CAI', 'RTM', 'LYS'];

/* ---- the original 28 (titles kept, so the copy on the page still matches) ---- */
const OLD = [
  ['deep', 'Deep\nField', 'orb'], ['cobalt', 'Tide', 'duo', [NAVY, SKY]], ['ice', 'Azul', 'photoTop', [NAVY, ICE]], ['paper', 'Blue\nHour', 'circles'],
  ['paper', 'Quiet\nVoices\nCarry', 'editorial', [COBALT, PAPER]], ['cobalt', 'B', 'bigLetter', [NAVY, SKY]], ['sky', 'Undertow', 'waves'], ['navy', 'Field\nNotes', 'photoFull', [DEEP, SKY]],
  ['navy', 'Indigo', 'duo', [DEEP, COBALT]], ['ice', 'Glass', 'photoTop', [COBALT, ICE]], ['cobalt', 'Harbour', 'photoFull', [NAVY, CYAN]], ['deep', 'Kobalt\n27', 'orb'],
  ['paper', 'Wave\nForm', 'waves'], ['navy', 'Ø', 'bigLetter', [DEEP, COBALT]], ['paper', 'Common\nGround', 'swiss'], ['cobalt', 'Signal\nLost', 'halftone'],
  ['ice', 'Arches', 'arch'], ['navy', 'Listen', 'bigword'], ['sky', 'Low\nTide', 'stripes'], ['paper', 'Second\nLanguage', 'typeTop', [NAVY, SKY]],
  ['deep', 'Night\nSwim', 'horizon'], ['ice', 'Open\nWindow', 'window', [NAVY, ICE]], ['paper', 'A—Z', 'alphabet'], ['paper', 'Ripple', 'rings'],
  ['deep', 'The Long\nQueue', 'queue'], ['ice', 'Kite', 'kite'], ['cobalt', 'Two\nCities', 'split', [DEEP, SKY]], ['cobalt', 'Grain', 'grain'],
];
const NEW_TITLES = ['Owed', 'Common Wealth', 'Neighbours', 'Borrowed Light', 'Return Address', 'Half & Half', 'Shared Table', 'Hand to Hand', 'Small Debts', 'Open Door',
  'The Commons', 'Low Voices', 'Carry Over', 'Mutual', 'Echo Room', 'Long Distance', 'Same Sky', 'Paper Trail', 'Lend Me', 'Night Bus',
  'Salt Water', 'Thank You Note', 'Undivided', 'Interval', 'Field Guide', 'Soft Border', 'Ninth Floor', 'Weather Report', 'Postcard', 'Kinship',
  'Blue Print', 'Leftovers', 'Other Side', 'Common Tongue', 'Fair Share', 'Tenants', 'Waiting Room', 'Lighthouse', 'Duet', 'Night Shift',
  'Overlap', 'The Ferry', 'First Language', 'Quiet Street', 'Hold Still', 'Cross Fade', 'Polar', 'Mother Tongue', 'Shoreline', 'Rain Check',
  'Equal Parts', 'Lullaby', 'Courtyard', 'Two Keys', 'Shelter', 'Static', 'Laundry Day', 'Morning Call', 'Margins', 'Commute',
  'The Promise', 'Tiles', 'Distance', 'Tandem', 'Reciprocal', 'Haven', 'Weightless', 'Monsoon', 'Overture', 'Repair',
  'Footnote', 'Satellite', 'Gather', 'Under One Roof', 'Lagoon', 'Cobalt Hour', 'In Common', 'Signal', 'Bridges', 'Visitors',
  'Mend', 'Afterglow', 'Exchange', 'Rooftops', 'Tenderness', 'Orbit', 'Flood Line', 'Every Other', 'Debt of Light', 'Hum',
  'Palimpsest', 'Keepsake'];
const NEW_STYLES = ['contour', 'moire', 'blocks', 'reach', 'ticket', 'route', 'flow', 'stack', 'strips', 'circleCrop', 'repeat', 'blobs', 'checker', 'sunburst',
  'mosaic', 'letters', 'bars', 'spiral', 'truchet', 'outline', 'mirror', 'lineScan', 'dotPhoto', 'triangles', 'tear', 'columns', 'gridType'];
const OLD_STYLES = ['orb', 'duo', 'photoTop', 'circles', 'editorial', 'bigLetter', 'waves', 'photoFull', 'swiss', 'halftone', 'arch', 'bigword', 'stripes', 'typeTop', 'horizon', 'window', 'alphabet', 'rings', 'queue', 'kite', 'split', 'grain'];
const PHOTO = new Set(['duo', 'photoTop', 'editorial', 'bigLetter', 'photoFull', 'typeTop', 'window', 'split', 'strips', 'circleCrop', 'mosaic', 'mirror', 'lineScan', 'dotPhoto', 'tear']);
const DARK_ONLY = { orb: ['deep', 'navy'], horizon: ['deep', 'navy'], grain: ['cobalt', 'navy', 'deep'] };

/* break "Under One Roof" into stacked lines, keeping tiny words with the next one */
function stack(t) {
  const w = t.split(' '), out = [];
  for (let i = 0; i < w.length; i++) { if (w[i].length <= 2 && i < w.length - 1) { out.push(w[i] + ' ' + w[i + 1]); i++; } else out.push(w[i]); }
  return out.join('\n');
}

const designs = [];
OLD.forEach(([sk, title, style, duo], i) => designs.push({ s: SCHEMES[sk], scheme: sk, title, style, duo, seed: 1000 + i * 7919 }));
{
  const rr = mulberry(2027);
  let seq = [...NEW_STYLES, ...NEW_STYLES, ...OLD_STYLES, ...NEW_STYLES.slice(0, 16)].slice(0, NEW_TITLES.length);
  for (let i = seq.length - 1; i > 0; i--) { const j = (rr() * (i + 1)) | 0; [seq[i], seq[j]] = [seq[j], seq[i]]; }
  for (let i = 1; i < seq.length; i++) if (seq[i] === seq[i - 1]) { const j = (i + 5) % seq.length; [seq[i], seq[j]] = [seq[j], seq[i]]; }
  const pool = ['paper', 'paper', 'ice', 'ice', 'white', 'sky', 'cyan', 'cobalt', 'cobalt', 'navy', 'navy', 'deep', 'deep'];
  let prev = '';
  const used = {}; designs.forEach(d => (used[d.style] = used[d.style] || new Set()).add(d.scheme));
  NEW_TITLES.forEach((t, k) => {
    const style = seq[k], u = used[style] = used[style] || new Set();
    let sk, tries = 0;
    do { const p = DARK_ONLY[style] || pool; sk = p[(rr() * p.length) | 0]; } while ((sk === prev || u.has(sk)) && tries++ < 30);
    prev = sk; u.add(sk);
    designs.push({ s: SCHEMES[sk], scheme: sk, title: stack(t), style, seed: 5000 + k * 104729 });
  });
}
designs.forEach((d, i) => {
  d.i = i;
  d.num = String(101 + (i * 37) % 899);
  d.kicker = KICKERS[(i * 7) % KICKERS.length];
  d.name = d.title.replace(/\n/g, ' ');
  d.photo = PHOTO.has(d.style);
  d.src = d.photo ? (i < 28 ? `https://picsum.photos/seed/blau${i * 11 + 5}/600/820?grayscale` : `https://picsum.photos/seed/bw13-${i}/600/820?grayscale`) : null;
});

function duotone(ctx, x, y, w, h, dark, light) {
  try {
    const d = ctx.getImageData(x, y, w, h), a = hex(dark), b = hex(light), px = d.data;
    for (let i = 0; i < px.length; i += 4) {
      const l = Math.pow((px[i] * .3 + px[i + 1] * .59 + px[i + 2] * .11) / 255, 1.1);
      px[i] = a[0] + (b[0] - a[0]) * l; px[i + 1] = a[1] + (b[1] - a[1]) * l; px[i + 2] = a[2] + (b[2] - a[2]) * l;
    }
    ctx.putImageData(d, x, y);
  } catch (e) { ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = light; ctx.fillRect(x, y, w, h); ctx.restore(); }
}

/* =================================================================== */
function drawPoster(ctx, d, img) {
  const s = d.s, r = mulberry(d.seed), sc = ctx.getTransform().a || 1;
  ctx.save();
  ctx.textBaseline = 'alphabetic'; ctx.lineCap = 'butt'; ctx.lineJoin = 'miter'; ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = s.bg; ctx.fillRect(0, 0, CW, CH);
  const LS = 'letterSpacing' in ctx;
  const font = (sz, wt = 700) => { ctx.font = `${wt} ${sz}px Inter, sans-serif`; if (LS) ctx.letterSpacing = sz >= 34 ? (-sz * .045).toFixed(2) + 'px' : '0px'; };
  const small = (t, x, y, col = s.ink, al = 'left') => { ctx.font = '600 13px Inter, sans-serif'; if (LS) ctx.letterSpacing = '0.8px'; ctx.fillStyle = col; ctx.textAlign = al; ctx.fillText(t, x, y); };
  const title = (x, y, w, max, col, o = {}) => {
    const ls = o.one ? [d.name] : d.title.split('\n'), wt = o.weight || 700, lh = o.lh || .9, n = ls.length;
    font(100, wt); let mw = 1; ls.forEach(l => mw = Math.max(mw, ctx.measureText(l).width));
    let sz = Math.min(max, w / mw * 100);
    if (o.maxH) sz = Math.min(sz, o.maxH / ((n - 1) * lh + .76));
    font(sz, wt); ctx.fillStyle = col; ctx.textAlign = o.align || 'left';
    const b0 = o.valign === 'bottom' ? y - (n - 1) * sz * lh : y + sz * .74;
    const ax = o.align === 'right' ? x + w : o.align === 'center' ? x + w / 2 : x;
    ls.forEach((l, i) => ctx.fillText(l, ax, b0 + i * sz * lh));
    return { size: sz, top: b0 - sz * .74, bottom: b0 + (n - 1) * sz * lh };
  };
  const foot = col => { ctx.fillStyle = col; ctx.fillRect(36, CH - 40, CW - 72, 1.5); small('BLAUWERK 27', 36, CH - 16, col); small('№ ' + d.num, CW - 36, CH - 16, col, 'right'); };
  const photoCanvas = (w, hh, duo) => {
    duo = duo || d.duo || s.duo;
    const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(w * sc)); c.height = Math.max(1, Math.round(hh * sc));
    const x = c.getContext('2d', { willReadFrequently: true });
    if (!img) { const g = x.createLinearGradient(0, 0, c.width * .3, c.height); g.addColorStop(0, duo[1]); g.addColorStop(1, duo[0]); x.fillStyle = g; x.fillRect(0, 0, c.width, c.height); return c; }
    const k = Math.max(c.width / img.width, c.height / img.height), iw = img.width * k, ih = img.height * k;
    x.drawImage(img, (c.width - iw) / 2, (c.height - ih) / 2, iw, ih);
    duotone(x, 0, 0, c.width, c.height, duo[0], duo[1]);
    return c;
  };
  const photo = (x, y, w, hh, duo) => ctx.drawImage(photoCanvas(w, hh, duo), x, y, w, hh);
  let L = null; const pr = mulberry(d.seed + 99), p1 = pr() * 6, p2 = pr() * 6, p3 = pr() * 6;
  const lum = (u, v) => {
    if (!L) {
      L = 'proc';
      if (img) try {
        const W = 72, H = 100, c = document.createElement('canvas'); c.width = W; c.height = H;
        const x = c.getContext('2d', { willReadFrequently: true }), k = Math.max(W / img.width, H / img.height);
        x.drawImage(img, (W - img.width * k) / 2, (H - img.height * k) / 2, img.width * k, img.height * k);
        const px = x.getImageData(0, 0, W, H).data, a = new Float32Array(W * H); let mn = 1, mx = 0;
        for (let i = 0; i < W * H; i++) { a[i] = (px[i * 4] * .3 + px[i * 4 + 1] * .59 + px[i * 4 + 2] * .11) / 255; mn = Math.min(mn, a[i]); mx = Math.max(mx, a[i]); }
        for (let i = 0; i < a.length; i++) a[i] = (a[i] - mn) / Math.max(.05, mx - mn);
        L = { W, H, a };
      } catch (e) { L = 'proc'; }
    }
    if (L === 'proc') return clamp(.5 + .3 * Math.sin(u * 7 + p1) * Math.cos(v * 6 + p2) + .22 * Math.sin((u - v) * 5 + p3));
    const fx = clamp(u) * (L.W - 1), fy = clamp(v) * (L.H - 1), x0 = fx | 0, y0 = fy | 0, x1 = Math.min(L.W - 1, x0 + 1), y1 = Math.min(L.H - 1, y0 + 1), tx = fx - x0, ty = fy - y0, A = L.a;
    return (A[y0 * L.W + x0] * (1 - tx) + A[y0 * L.W + x1] * tx) * (1 - ty) + (A[y1 * L.W + x0] * (1 - tx) + A[y1 * L.W + x1] * tx) * ty;
  };
  const clipTop = (y) => { ctx.beginPath(); ctx.rect(0, 0, CW, y); ctx.clip(); };
  const notBg = arr => arr.filter(c => c !== s.bg);
  const h = { font, small, title, foot, photo, photoCanvas, lum, clipTop, notBg };
  try { (STYLES[d.style] || STYLES.orb)(ctx, d, h, r, s); } catch (e) { console.warn('poster', d.style, e); }
  ctx.restore();
}

/* =================================================================== */
const STYLES = {
  /* ---------- the original layouts, now seeded so each copy differs ---------- */
  orb(ctx, d, h, r) {
    const cx = CW * (.25 + r() * .5), cy = CH * (.25 + r() * .22), R = CW * (.5 + r() * .3);
    const g = ctx.createRadialGradient(cx, cy, 4, cx, cy, R);
    g.addColorStop(0, '#d6f3ff'); g.addColorStop(.12, CYAN); g.addColorStop(.4, COBALT); g.addColorStop(.78, '#0b1a66'); g.addColorStop(1, DEEP);
    ctx.fillStyle = g; ctx.fillRect(0, 0, CW, CH);
    ctx.strokeStyle = 'rgba(180,220,255,.3)'; ctx.lineWidth = 1; const st = 20 + r() * 22;
    for (let k = st * 2; k < 760; k += st) { ctx.beginPath(); ctx.arc(cx, cy, k, 0, TAU); ctx.stroke(); }
    h.title(36, CH - 66, CW - 72, 84, '#fff', { valign: 'bottom', weight: 600, maxH: 220 });
    h.small(d.kicker, 36, 50, '#cfe0ff'); h.foot('#cfe0ff');
  },
  duo(ctx, d, h, r) {
    h.photo(0, 0, CW, CH);
    const g = ctx.createLinearGradient(0, CH * .45, 0, CH); g.addColorStop(0, 'rgba(6,16,46,0)'); g.addColorStop(1, 'rgba(6,16,46,.6)'); ctx.fillStyle = g; ctx.fillRect(0, 0, CW, CH);
    h.title(30, CH - 40, CW - 60, 140, '#fff', { valign: 'bottom', maxH: 330 });
    h.small(d.kicker, 32, 48, '#fff'); h.small('№ ' + d.num, CW - 32, 48, '#fff', 'right');
  },
  photoTop(ctx, d, h, r, s) {
    const y0 = 170 + (r() * 120 | 0);
    h.photo(0, y0, CW, CH - y0);
    h.title(30, 28, CW - 60, 120, s.ink, { weight: 600, maxH: y0 - 60 });
    h.small(d.kicker, CW - 30, y0 - 14, s.ink, 'right');
    h.small('№ ' + d.num, 30, CH - 22, '#fff');
  },
  circles(ctx, d, h, r, s) {
    const n = 3 + (r() * 2 | 0), m = 36, cell = (CW - m * 2) / n, rows = Math.max(2, Math.floor((CH - 250) / cell)), cols = h.notBg([s.a, s.b, s.c, s.ink]);
    for (let y = 0; y < rows; y++) for (let x = 0; x < n; x++) {
      const cx = m + x * cell, cy = m + y * cell, t = r() * 4 | 0; ctx.fillStyle = cols[r() * cols.length | 0]; ctx.beginPath();
      if (t === 0) ctx.arc(cx + cell / 2, cy + cell / 2, cell * .46, 0, TAU);
      else if (t === 1) { const q = r() * 4 | 0, px = cx + (q === 1 || q === 2 ? cell : 0), py = cy + (q >= 2 ? cell : 0); ctx.moveTo(px, py); ctx.arc(px, py, cell * .94, q * Math.PI / 2, (q + 1) * Math.PI / 2); }
      else if (t === 2) { const up = r() < .5; ctx.arc(cx + cell / 2, up ? cy + cell * .96 : cy + cell * .04, cell * .46, up ? Math.PI : 0, up ? TAU : Math.PI); }
      else ctx.rect(cx + cell * .08, cy + cell * .08, cell * .84, cell * .84);
      ctx.fill();
    }
    const top = m + rows * cell + 30;
    h.title(36, CH - 64, CW - 72, 96, s.ink, { valign: 'bottom', maxH: CH - 64 - top });
    h.foot(s.ink);
  },
  editorial(ctx, d, h, r, s) {
    const t = h.title(30, 34, CW - 60, 84, s.ink, { maxH: 250 });
    const by = Math.max(t.bottom + 40, 300), bw = 140 + r() * 90;
    ctx.fillStyle = s.a; ctx.fillRect(30, by + 50, bw, bw);
    const px = 30 + bw * (.45 + r() * .2);
    h.photo(px, by, CW - 30 - px, CH - by - 60);
    h.small(d.kicker, 30, CH - 26, s.ink); h.small('№ ' + d.num, CW - 30, CH - 26, s.ink, 'right');
  },
  bigLetter(ctx, d, h, r, s) {
    const left = r() < .5, pw = CW * (.5 + r() * .15);
    h.photo(left ? 0 : CW - pw, 0, pw, CH);
    h.font(640, 800); ctx.fillStyle = s.dark ? '#fff' : s.a; ctx.textAlign = left ? 'right' : 'left';
    ctx.fillText(d.title[0], left ? CW + 30 : -30, CH - 80);
    ctx.save(); ctx.translate(left ? 24 : CW - 24, CH - 30); ctx.rotate(-Math.PI / 2); h.small(d.kicker + ' — ' + d.name.toUpperCase(), 0, left ? 10 : 0, '#fff'); ctx.restore();
  },
  waves(ctx, d, h, r, s) {
    const n = 12 + (r() * 10 | 0), f = 28 + r() * 50, amp = 10 + r() * 24, ph = r() * 6, gap = (CH - 270) / n, lw = Math.max(2, gap * (.25 + r() * .25)), cols = h.notBg([s.a, s.ink, s.c]);
    ctx.lineWidth = lw; ctx.lineCap = 'round';
    for (let k = 0; k < n; k++) {
      ctx.strokeStyle = cols[k % cols.length]; ctx.beginPath();
      for (let x = -10; x <= CW + 10; x += 6) { const y = 60 + k * gap + Math.sin(x / f + k * .45 + ph) * amp * (.35 + .65 * Math.sin(k / n * Math.PI)); x < 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
      ctx.stroke();
    }
    h.title(34, CH - 66, CW - 68, 92, s.ink, { valign: 'bottom', maxH: 150 }); h.foot(s.ink);
  },
  photoFull(ctx, d, h, r) {
    h.photo(0, 0, CW, CH);
    ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = 1; ctx.strokeRect(22, 22, CW - 44, CH - 44);
    h.small(d.kicker, 38, 54, '#fff'); h.small(d.name.toUpperCase(), 38, CH - 40, '#fff'); h.small('№ ' + d.num, CW - 38, CH - 40, '#fff', 'right');
    if (r() < .6) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(CW - 54, 50, 8, 0, TAU); ctx.fill(); }
  },
  swiss(ctx, d, h, r, s) {
    const cols = h.notBg([s.a, s.ink, s.b, s.c]), nc = 3 + (r() * 3 | 0), nr = nc + 1 + (r() * 2 | 0), m = 36, gw = CW - 2 * m, cw = gw / nc, top = 40, rh = (CH - 270) / nr;
    for (let y = 0; y < nr; y++) for (let x = 0; x < nc; x++) {
      if (r() < .4) continue;
      const span = r() < .2 ? 2 : 1; ctx.fillStyle = cols[r() * cols.length | 0];
      ctx.fillRect(m + x * cw, top + y * rh, Math.min(cw * span, gw - x * cw) - 8, rh - 8);
    }
    h.title(36, CH - 66, CW - 72, 90, s.ink, { valign: 'bottom', maxH: 150 }); h.foot(s.ink);
  },
  halftone(ctx, d, h, r, s) {
    const cx = CW * (.15 + r() * .7), cy = CH * (.15 + r() * .35), R = 260 + r() * 220, st = 13 + (r() * 9 | 0), mx = st * .5;
    ctx.fillStyle = s.dark ? '#fff' : s.a;
    for (let y = 16; y < CH - 170; y += st) for (let x = 12; x < CW; x += st) {
      const rr = mx * (1 - Math.hypot(x - cx, y - cy) / R); if (rr < .4) continue;
      ctx.beginPath(); ctx.arc(x, y, rr, 0, TAU); ctx.fill();
    }
    h.title(34, CH - 64, CW - 68, 90, s.dark ? '#fff' : s.ink, { valign: 'bottom', maxH: 140 });
    h.small(d.kicker, 34, CH - 20, s.dark ? ICE : s.ink);
  },
  arch(ctx, d, h, r, s) {
    const cols = h.notBg([s.a, s.b, s.c, s.ink, WHITE, ICE]), k0 = 4 + (r() * 3 | 0), base = CH - 190;
    for (let k = 0; k < k0; k++) {
      const w = 430 - k * (380 / k0), x = (CW - w) / 2 + (r() - .5) * 20, top = 90 + k * (250 / k0);
      ctx.fillStyle = cols[k % cols.length]; ctx.beginPath(); ctx.moveTo(x, base); ctx.lineTo(x, top + w / 2); ctx.arc(x + w / 2, top + w / 2, w / 2, Math.PI, 0); ctx.lineTo(x + w, base); ctx.closePath(); ctx.fill();
    }
    h.title(36, CH - 56, CW - 72, 80, s.ink, { valign: 'bottom', maxH: 110 });
    h.small('№ ' + d.num, CW - 36, CH - 26, s.ink, 'right');
  },
  bigword(ctx, d, h, r, s) {
    const w = d.name.toUpperCase(); h.font(100, 800); const m = ctx.measureText(w).width, sz = Math.min(250, (CH - 80) / m * 100);
    ctx.save(); ctx.textBaseline = 'top'; ctx.translate(CW - 34, 40); ctx.rotate(Math.PI / 2); h.font(sz, 800); ctx.fillStyle = s.a; ctx.textAlign = 'left'; ctx.fillText(w, 0, 0); ctx.restore();
    ctx.save(); ctx.textBaseline = 'top'; ctx.translate(CW - 34 - sz * .86, 40); ctx.rotate(Math.PI / 2); h.font(sz, 800); ctx.strokeStyle = s.ink; ctx.lineWidth = 1.5; ctx.strokeText(w, 0, 0); ctx.restore();
    h.small(d.kicker, 34, 50, s.ink);
    ctx.font = '400 15px Inter, sans-serif'; ctx.fillStyle = s.ink; ctx.textAlign = 'left';
    ['A sound piece in print.', 'Read it out loud,', 'then pass it on.'].forEach((l, i) => ctx.fillText(l, 34, CH - 92 + i * 21));
    h.small('№ ' + d.num, 34, CH - 20, s.ink);
  },
  stripes(ctx, d, h, r, s) {
    const ang = (r() < .5 ? -1 : 1) * (.25 + r() * .7), w = 12 + r() * 30;
    ctx.save(); h.clipTop(CH - 190); ctx.translate(CW / 2, (CH - 190) / 2); ctx.rotate(ang); ctx.fillStyle = s.dark ? s.c : s.a;
    for (let x = -900; x < 900; x += w * 2) ctx.fillRect(x, -900, w, 1800);
    ctx.restore();
    if (r() < .6) { ctx.fillStyle = s.bg; ctx.beginPath(); ctx.arc(CW * (.3 + r() * .4), CH * (.2 + r() * .3), 60 + r() * 60, 0, TAU); ctx.fill(); }
    h.title(34, CH - 66, CW - 68, 92, s.ink, { valign: 'bottom', maxH: 110 }); h.foot(s.ink);
  },
  typeTop(ctx, d, h, r, s) {
    const ph = CH * (.48 + r() * .14);
    h.photo(0, 0, CW, ph);
    h.title(30, ph + 26, CW - 60, 96, s.ink, { maxH: CH - ph - 90 });
    h.small(d.kicker, CW - 30, CH - 24, s.ink, 'right');
  },
  horizon(ctx, d, h, r) {
    const hy = .52 + r() * .16, g = ctx.createLinearGradient(0, 0, 0, CH); g.addColorStop(0, DEEP); g.addColorStop(hy - .01, COBALT); g.addColorStop(hy, NAVY); g.addColorStop(1, DEEP);
    ctx.fillStyle = g; ctx.fillRect(0, 0, CW, CH);
    const sx = CW * (.3 + r() * .4), sy = CH * hy, R = 80 + r() * 60;
    ctx.fillStyle = '#d6f3ff'; ctx.beginPath(); ctx.arc(sx, sy, R, Math.PI, 0); ctx.fill();
    ctx.fillStyle = 'rgba(214,243,255,.35)'; for (let k = 0; k < 9; k++) ctx.fillRect(sx - R + k * 6, sy + 10 + k * 14, 2 * R - k * 12, 4);
    h.title(34, 50, CW - 68, 84, '#fff', { weight: 600, maxH: sy - R - 120 });
    h.small(d.kicker, 34, CH - 24, ICE); h.small('№ ' + d.num, CW - 34, CH - 24, ICE, 'right');
  },
  window(ctx, d, h, r, s) {
    const m = 50 + r() * 20, top = 70, wh = CH - 300;
    h.photo(m, top, CW - 2 * m, wh);
    ctx.strokeStyle = s.dark ? ICE : s.ink; ctx.lineWidth = 12 + r() * 6; ctx.strokeRect(m, top, CW - 2 * m, wh);
    const nx = 2 + (r() * 2 | 0), ny = 2 + (r() * 2 | 0); ctx.beginPath();
    for (let i = 1; i < nx; i++) { const x = m + (CW - 2 * m) * i / nx; ctx.moveTo(x, top); ctx.lineTo(x, top + wh); }
    for (let i = 1; i < ny; i++) { const y = top + wh * i / ny; ctx.moveTo(m, y); ctx.lineTo(CW - m, y); }
    ctx.lineWidth *= .5; ctx.stroke();
    h.title(m, CH - 70, CW - 2 * m, 72, s.ink, { valign: 'bottom', maxH: 140 });
  },
  alphabet(ctx, d, h, r, s) {
    const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', set = new Set(d.name.toUpperCase().replace(/[^A-Z]/g, '')), cols = 5, cw = (CW - 60) / cols, rh = (CH - 230) / 6;
    h.font(Math.min(cw, rh) * .78, 700); ctx.textAlign = 'center';
    for (let k = 0; k < 26; k++) { ctx.fillStyle = set.has(A[k]) ? s.a : rgba(s.ink, .14); ctx.fillText(A[k], 30 + cw * (k % cols + .5), 40 + rh * ((k / cols | 0) + .8)); }
    h.title(36, CH - 54, CW - 72, 80, s.a === WHITE ? s.ink : s.a, { valign: 'bottom', maxH: 100, weight: 800 });
  },
  rings(ctx, d, h, r, s) {
    const n = 7 + (r() * 5 | 0), cx = CW * (.3 + r() * .4), cy = CH * (.28 + r() * .14), st = 22 + r() * 14;
    for (let k = n; k > 0; k--) { ctx.fillStyle = k % 2 ? s.a : (s.dark ? s.c : s.b === WHITE ? ICE : s.b); ctx.beginPath(); ctx.arc(cx + k * 5, cy, k * st, 0, TAU); ctx.fill(); }
    h.title(34, CH - 66, CW - 68, 90, s.ink, { valign: 'bottom', maxH: 140 }); h.foot(s.ink);
  },
  queue(ctx, d, h, r, s) {
    const n = 8 + (r() * 3 | 0), base = CH * (.5 + r() * .08), hi = r() * n | 0, gap = (CW - 80) / n;
    for (let k = 0; k < n; k++) {
      const x = 40 + k * gap, hh = 130 + ((k * 37 + d.i * 13) % 80);
      ctx.fillStyle = k === hi ? (s.dark ? s.c : s.a) : (s.dark ? s.b : s.ink);
      ctx.beginPath(); ctx.arc(x + gap * .32, base - hh - 20, gap * .3, 0, TAU); ctx.fill();
      ctx.fillRect(x, base - hh, gap * .64, hh);
    }
    ctx.fillStyle = rgba(s.ink, .25); ctx.fillRect(30, base, CW - 60, 2);
    h.title(34, CH - 70, CW - 68, 80, s.ink, { valign: 'bottom', maxH: CH - base - 130 });
    h.small(d.kicker, 34, CH - 26, s.ink);
  },
  kite(ctx, d, h, r, s) {
    const cx = CW * (.4 + r() * .3), ty = 50 + r() * 40, w = 120 + r() * 60, hh = 330;
    ctx.save(); ctx.translate(cx, ty + hh * .5); ctx.rotate((r() - .5) * .5); ctx.translate(-cx, -(ty + hh * .5));
    ctx.fillStyle = s.a; ctx.beginPath(); ctx.moveTo(cx, ty); ctx.lineTo(cx + w, ty + hh * .45); ctx.lineTo(cx, ty + hh * .82); ctx.lineTo(cx - w * .8, ty + hh * .45); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba(s.ink, .4); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(cx, ty); ctx.lineTo(cx, ty + hh * .82); ctx.moveTo(cx - w * .8, ty + hh * .45); ctx.lineTo(cx + w, ty + hh * .45); ctx.stroke();
    ctx.restore();
    ctx.strokeStyle = s.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(cx, ty + hh * .82);
    for (let k = 1; k < 9; k++) ctx.lineTo(cx + Math.sin(k * 1.1) * 30, ty + hh * .82 + k * 22); ctx.stroke();
    h.title(34, CH - 66, CW - 68, 90, s.ink, { valign: 'bottom', maxH: 110 }); h.foot(s.ink);
  },
  split(ctx, d, h, r, s) {
    const left = r() < .5; h.photo(left ? 0 : CW / 2, 0, CW / 2, CH);
    ctx.save(); ctx.translate(left ? CW * .78 : CW * .28, CH - 40); ctx.rotate(-Math.PI / 2);
    h.title(0, 0, CH - 90, 100, s.ink, { valign: 'bottom', weight: 800, maxH: CW * .4 }); ctx.restore();
    h.small('DIPTYCH', left ? CW / 2 + 24 : 24, 46, s.ink);
  },
  grain(ctx, d, h, r, s) {
    const a = r() * TAU, g = ctx.createLinearGradient(CW / 2 - Math.cos(a) * 400, CH / 2 - Math.sin(a) * 400, CW / 2 + Math.cos(a) * 400, CH / 2 + Math.sin(a) * 400);
    g.addColorStop(0, CYAN); g.addColorStop(.5, COBALT); g.addColorStop(1, DEEP); ctx.fillStyle = g; ctx.fillRect(0, 0, CW, CH);
    for (let k = 0; k < 5000; k++) { ctx.fillStyle = `rgba(255,255,255,${r() * .18})`; ctx.fillRect(r() * CW, r() * CH, 1.5, 1.5); }
    h.title(34, CH - 66, CW - 68, 96, '#fff', { valign: 'bottom', maxH: 220 });
    h.small(d.kicker, 34, 46, ICE);
  },

  /* ---------- v13: new layouts ---------- */
  contour(ctx, d, h, r, s) {
    const cx = CW * (.3 + r() * .4), cy = CH * (.28 + r() * .14), n = 20 + (r() * 10 | 0), q = [r() * 6, r() * 6, r() * 6], st = 15 + r() * 6;
    ctx.save(); h.clipTop(CH - 200);
    for (let k = 1; k <= n; k++) {
      const R = k * st; ctx.strokeStyle = k % 5 === 0 ? (s.dark ? s.c : s.a) : rgba(s.ink, .5); ctx.lineWidth = k % 5 === 0 ? 2.6 : 1.2; ctx.beginPath();
      for (let a = 0; a <= TAU + .01; a += .03) { const rr = R * (1 + .2 * Math.sin(3 * a + q[0] + k * .09) + .1 * Math.sin(5 * a + q[1] - k * .06) + .06 * Math.sin(2 * a + q[2])); const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr * 1.12; a ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.closePath(); ctx.stroke();
    }
    ctx.restore();
    ctx.fillStyle = s.dark ? s.c : s.a; ctx.beginPath(); ctx.arc(cx, cy, 5, 0, TAU); ctx.fill();
    h.small('ELEV. ' + (200 + d.i * 13) + ' M', cx + 12, cy + 4, s.ink);
    h.title(34, CH - 66, CW - 68, 90, s.ink, { valign: 'bottom', maxH: 120 }); h.foot(s.ink);
  },
  moire(ctx, d, h, r, s) {
    const c1 = [CW * (.35 + r() * .1), CH * .32], c2 = [c1[0] + 30 + r() * 40, c1[1] + (r() - .5) * 50], st = 8 + r() * 4;
    ctx.save(); h.clipTop(CH - 200); ctx.lineWidth = st * .42;
    ctx.strokeStyle = s.ink; for (let k = st; k < 640; k += st) { ctx.beginPath(); ctx.arc(c1[0], c1[1], k, 0, TAU); ctx.stroke(); }
    ctx.strokeStyle = s.dark ? s.c : s.a; for (let k = st; k < 640; k += st) { ctx.beginPath(); ctx.arc(c2[0], c2[1], k, 0, TAU); ctx.stroke(); }
    ctx.restore();
    h.title(34, CH - 66, CW - 68, 90, s.ink, { valign: 'bottom', maxH: 120 }); h.foot(s.ink);
  },
  blocks(ctx, d, h, r, s) {
    const parts = d.name.toUpperCase().split(' ');
    if (parts.length === 1 && parts[0].length >= 6) { const p = parts[0], c = Math.ceil(p.length / 2); parts.splice(0, 1, p.slice(0, c) + '-', p.slice(c)); }
    const m = 26, n = parts.length, slot = (CH - 110) / n, pairs = h.notBg([s.ink, s.a, s.c, s.b]);
    ctx.fillStyle = s.dark ? rgba(s.c, .22) : rgba(s.a === WHITE ? s.ink : s.a, .12); ctx.beginPath(); ctx.arc(CW * (.2 + r() * .6), CH * (.25 + r() * .4), 150 + r() * 110, 0, TAU); ctx.fill();
    parts.forEach((w, i) => {
      const bg = pairs[i % pairs.length]; h.font(100, 800); const mw = ctx.measureText(w).width, sz = Math.min(slot * .8, (CW - 2 * m - 30) / mw * 100);
      h.font(sz, 800); const tw = ctx.measureText(w).width, bw = tw + 30, x = m + r() * (CW - 2 * m - bw), y = 34 + i * slot + r() * Math.max(0, slot - sz - 10);
      ctx.fillStyle = bg; ctx.fillRect(x, y, bw, sz * .98); ctx.fillStyle = on(bg); ctx.textAlign = 'left'; ctx.fillText(w, x + 15, y + sz * .84);
    });
    h.small(d.kicker, m, CH - 26, s.ink); h.small('№ ' + d.num, CW - m, CH - 26, s.ink, 'right');
  },
  reach(ctx, d, h, r, s) {
    const cy = CH * (.32 + r() * .1), R = 150 + r() * 40, gap = 8 + r() * 12;
    ctx.fillStyle = s.dark ? s.c : s.a; ctx.beginPath(); ctx.arc(CW / 2 - gap / 2 - R, cy, R, 0, TAU); ctx.fill();
    ctx.fillStyle = s.dark ? s.b : s.ink; ctx.beginPath(); ctx.arc(CW / 2 + gap / 2 + R, cy + (r() - .5) * 30, R, 0, TAU); ctx.fill();
    ctx.fillStyle = s.dark ? '#fff' : s.c; ctx.beginPath(); ctx.arc(CW / 2, cy - R - 40, 10, 0, TAU); ctx.fill();
    h.title(34, CH - 66, CW - 68, 92, s.ink, { valign: 'bottom', maxH: CH - cy - R - 150 }); h.foot(s.ink);
  },
  ticket(ctx, d, h, r, s) {
    const m = 40, opts = h.notBg(s.dark ? [ICE, WHITE, s.c, SKY] : [s.ink, s.a === WHITE ? COBALT : s.a, NAVY, DEEP]), tb = opts[r() * opts.length | 0], tc = on(tb), py = CH * (.64 + r() * .06);
    ctx.fillStyle = tb; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(m, 56, CW - 2 * m, CH - 112, 14) : ctx.rect(m, 56, CW - 2 * m, CH - 112); ctx.fill();
    ctx.fillStyle = s.bg; [m, CW - m].forEach(x => { ctx.beginPath(); ctx.arc(x, py, 20, 0, TAU); ctx.fill(); });
    ctx.strokeStyle = rgba(tc === WHITE ? '#ffffff' : INK, .4); ctx.setLineDash([6, 7]); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(m + 28, py); ctx.lineTo(CW - m - 28, py); ctx.stroke(); ctx.setLineDash([]);
    h.small('ADMIT ONE · ' + d.kicker, m + 26, 96, tc);
    h.font(150, 800); ctx.fillStyle = tc; ctx.textAlign = 'left'; ctx.fillText(d.num, m + 20, 250);
    h.title(m + 26, 290, CW - 2 * m - 52, 64, tc, { maxH: py - 330 });
    let x = m + 26; while (x < CW - m - 30) { const w = 1 + (r() * 4 | 0); ctx.fillStyle = tc; ctx.fillRect(x, py + 40, w, CH - 112 + 56 - py - 90); x += w + 2 + (r() * 4 | 0); }
    h.small('BLAUWERK 27', m + 26, CH - 72, tc); h.small('ROW ' + (1 + d.i % 9) + ' · SEAT ' + (10 + d.i % 30), CW - m - 26, CH - 72, tc, 'right');
  },
  route(ctx, d, h, r, s) {
    ctx.strokeStyle = rgba(s.ink, .12); ctx.lineWidth = 1;
    for (let x = 0; x < CW; x += 32) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CH - 200); ctx.stroke(); }
    for (let y = 0; y < CH - 200; y += 32) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CW, y); ctx.stroke(); }
    const pts = Array.from({ length: 5 }, (_, i) => [50 + r() * (CW - 100), 60 + i * ((CH - 300) / 4) + (r() - .5) * 30]);
    ctx.strokeStyle = s.dark ? s.c : s.a; ctx.lineWidth = 3; ctx.setLineDash([2, 8]); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(...pts[0]);
    for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; ctx.bezierCurveTo(x0, (y0 + y1) / 2, x1, (y0 + y1) / 2, x1, y1); }
    ctx.stroke(); ctx.setLineDash([]);
    pts.forEach(([x, y], i) => { ctx.fillStyle = s.bg; ctx.beginPath(); ctx.arc(x, y, 9, 0, TAU); ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = s.ink; ctx.stroke(); h.small(CODES[(d.i * 3 + i) % CODES.length], x + 16, y + 5, s.ink); });
    h.title(34, CH - 66, CW - 68, 90, s.ink, { valign: 'bottom', maxH: 120 }); h.foot(s.ink);
  },
  flow(ctx, d, h, r, s) {
    const f1 = .005 + r() * .01, f2 = .005 + r() * .01, ph = r() * 6;
    ctx.save(); h.clipTop(CH - 200); ctx.lineCap = 'round';
    for (let i = 0; i < 460; i++) {
      let x = r() * CW, y = r() * (CH - 200); ctx.beginPath(); ctx.moveTo(x, y);
      for (let j = 0; j < 20; j++) { const a = Math.sin(x * f1 + ph) * 2 + Math.cos(y * f2) * 2; x += Math.cos(a) * 5; y += Math.sin(a) * 5; ctx.lineTo(x, y); }
      ctx.strokeStyle = i % 9 ? rgba(s.ink, .42) : (s.dark ? s.c : s.a); ctx.lineWidth = i % 9 ? 1.2 : 3; ctx.stroke();
    }
    ctx.restore();
    h.title(34, CH - 66, CW - 68, 90, s.ink, { valign: 'bottom', maxH: 120 }); h.foot(s.ink);
  },
  stack(ctx, d, h, r, s) {
    const cols = h.notBg([s.a, s.c, s.b, WHITE, ICE, s.ink]);
    for (let k = 0; k < 6; k++) {
      ctx.save(); ctx.translate(CW / 2 + (r() - .5) * 70, 290 + (r() - .5) * 50); ctx.rotate((r() - .5) * .55);
      ctx.shadowColor = 'rgba(6,16,46,.28)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 10;
      ctx.fillStyle = cols[k % cols.length]; ctx.fillRect(-140, -180, 280, 360);
      if (k === 5) { ctx.shadowColor = 'transparent'; ctx.fillStyle = on(cols[k % cols.length]); ctx.font = '600 13px Inter, sans-serif'; ctx.textAlign = 'left'; ctx.fillText(d.kicker, -116, -146); for (let l = 0; l < 7; l++) ctx.fillRect(-116, -110 + l * 18, 120 + ((l * 53 + d.i * 7) % 110), 4); }
      ctx.restore();
    }
    h.title(34, CH - 66, CW - 68, 90, s.ink, { valign: 'bottom', maxH: 110 }); h.foot(s.ink);
  },
  strips(ctx, d, h, r, s) {
    const n = 5 + (r() * 4 | 0), y0 = 50, hh = CH - 290, pc = h.photoCanvas(CW - 60, hh), sw = (CW - 60) / n, k = pc.width / (CW - 60);
    for (let i = 0; i < n; i++) { const off = (r() - .5) * 90; ctx.drawImage(pc, i * sw * k, 0, sw * k, pc.height, 30 + i * sw, y0 + 45 + off, sw - 3, hh); }
    h.title(34, CH - 60, CW - 68, 84, s.ink, { valign: 'bottom', maxH: 100 });
    h.small(d.kicker, 34, 34, s.ink); h.small('№ ' + d.num, CW - 34, 34, s.ink, 'right');
  },
  circleCrop(ctx, d, h, r, s) {
    const cx = CW / 2 + (r() - .5) * 40, cy = CH * (.36 + r() * .06), R = 160 + r() * 30;
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.clip(); h.photo(cx - R, cy - R, 2 * R, 2 * R); ctx.restore();
    const txt = (d.name + ' · ' + d.kicker + ' · ').toUpperCase(), rr = R + 24; ctx.font = '600 15px Inter, sans-serif'; if ('letterSpacing' in ctx) ctx.letterSpacing = '2px'; ctx.fillStyle = s.ink; ctx.textAlign = 'center';
    let a = -Math.PI / 2 + r(), i = 0; const a1 = a + TAU - .05;
    while (a < a1) { const ch = txt[i++ % txt.length], w = ctx.measureText(ch).width + 2; ctx.save(); ctx.translate(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); ctx.rotate(a + Math.PI / 2); ctx.fillText(ch, 0, 0); ctx.restore(); a += w / rr; }
    h.title(34, CH - 66, CW - 68, 90, s.ink, { valign: 'bottom', maxH: CH - cy - R - 130 }); h.foot(s.ink);
  },
  repeat(ctx, d, h, r, s) {
    const w = d.name.toUpperCase(); h.font(100, 800); const sz = Math.min(130, (CW - 48) / ctx.measureText(w).width * 100), lh = sz * .9, rows = Math.floor((CH - 70) / lh), hi = r() * rows | 0;
    h.font(sz, 800); ctx.textAlign = 'left'; ctx.lineWidth = 1.4; ctx.strokeStyle = s.ink;
    for (let i = 0; i < rows; i++) { const y = 34 + sz * .76 + i * lh; if (i === hi) { ctx.fillStyle = s.dark ? s.c : s.a; ctx.fillText(w, 24, y); } else ctx.strokeText(w, 24, y); }
    h.small(d.kicker, 24, CH - 20, s.ink); h.small('№ ' + d.num, CW - 24, CH - 20, s.ink, 'right');
  },
  blobs(ctx, d, h, r, s) {
    const cols = [s.a, s.c, s.b, CYAN, COBALT].filter(c => c !== s.bg);
    for (let k = 0; k < 6; k++) {
      const x = r() * CW, y = r() * (CH - 160), R = 160 + r() * 200, c = cols[k % cols.length], g = ctx.createRadialGradient(x, y, 0, x, y, R);
      g.addColorStop(0, rgba(c, .95)); g.addColorStop(1, rgba(c, 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, CW, CH);
    }
    for (let k = 0; k < 3000; k++) { ctx.fillStyle = `rgba(255,255,255,${r() * .14})`; ctx.fillRect(r() * CW, r() * CH, 1.4, 1.4); }
    h.title(30, CH - 72, CW - 60, 120, s.ink, { valign: 'bottom', maxH: 260 });
    h.small(d.kicker, 30, 46, s.ink); ctx.font = '400 13px Inter, sans-serif'; ctx.textAlign = 'right'; ctx.fillStyle = s.ink;
    ['Rotterdam', 'and online', '12.06 — 17.07'].forEach((l, i) => ctx.fillText(l, CW - 30, 46 + i * 18));
    h.small('№ ' + d.num, 30, CH - 24, s.ink);
  },
  checker(ctx, d, h, r, s) {
    const hy = CH * (.36 + r() * .1), K = CH - hy, cw = 54 + r() * 30, c1 = s.dark ? s.a : s.ink, c2 = s.dark ? ICE : s.a === WHITE ? WHITE : s.a;
    const depth = i => 1 + i * .55 + i * i * .06;
    for (let i = 0; i < 26; i++) {
      const d0 = depth(i), d1 = depth(i + 1), y0 = hy + K / d0, y1 = hy + K / d1;
      for (let u = -14; u < 14; u++) {
        ctx.fillStyle = (u + i) & 1 ? c1 : c2; ctx.beginPath();
        ctx.moveTo(CW / 2 + u * cw / d0, y0); ctx.lineTo(CW / 2 + (u + 1) * cw / d0, y0); ctx.lineTo(CW / 2 + (u + 1) * cw / d1, y1); ctx.lineTo(CW / 2 + u * cw / d1, y1); ctx.fill();
      }
    }
    h.title(34, 40, CW - 68, 100, s.ink, { maxH: hy - 90 });
    h.small(d.kicker, 34, hy - 18, s.ink); h.small('№ ' + d.num, CW - 34, hy - 18, s.ink, 'right');
  },
  sunburst(ctx, d, h, r, s) {
    const cx = r() < .5 ? 0 : CW, cy = CH * (.1 + r() * .35), n = 30 + (r() * 20 | 0);
    ctx.fillStyle = s.dark ? s.a : s.a === WHITE ? s.b : s.a;
    for (let i = 0; i < n; i += 2) { const a0 = i / n * TAU, a1 = (i + 1) / n * TAU; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, 1500, a0, a1); ctx.closePath(); ctx.fill(); }
    ctx.fillStyle = s.dark ? s.c : s.ink; ctx.beginPath(); ctx.arc(cx, cy, 60 + r() * 70, 0, TAU); ctx.fill();
    ctx.fillStyle = s.bg; ctx.fillRect(0, CH - 200, CW, 200);
    h.title(34, CH - 66, CW - 68, 90, s.ink, { valign: 'bottom', maxH: 110 }); h.foot(s.ink);
  },
  mosaic(ctx, d, h, r, s) {
    const n = 9 + (r() * 7 | 0), cell = CW / n, rows = Math.ceil((CH - 190) / cell), dots = r() < .45;
    const lv = s.dark ? [DEEP, NAVY, COBALT, SKY, ICE] : [NAVY, COBALT, SKY, ICE, WHITE];
    for (let y = 0; y < rows; y++) for (let x = 0; x < n; x++) {
      const l = h.lum((x + .5) / n, (y + .5) / rows), c = lv[Math.min(4, l * 5 | 0)];
      ctx.fillStyle = c; if (dots) { ctx.beginPath(); ctx.arc((x + .5) * cell, (y + .5) * cell, cell * .48, 0, TAU); ctx.fill(); } else ctx.fillRect(x * cell, y * cell, cell + .5, cell + .5);
    }
    ctx.fillStyle = s.bg; ctx.fillRect(0, rows * cell, CW, CH);
    h.title(34, CH - 66, CW - 68, 90, s.ink, { valign: 'bottom', maxH: CH - rows * cell - 100 }); h.foot(s.ink);
  },
  letters(ctx, d, h, r, s) {
    const ch = d.name.replace(/[^A-Za-zØ]/g, '').toUpperCase().slice(0, 7), cols = h.notBg([s.a, s.c, s.ink, s.b]);
    ctx.save(); h.clipTop(CH - 170); ctx.globalCompositeOperation = s.dark ? 'screen' : 'multiply';
    for (let i = 0; i < ch.length; i++) {
      ctx.save(); ctx.translate(40 + r() * (CW - 80), 140 + r() * (CH - 360)); ctx.rotate((r() - .5) * 1.2); h.font(200 + r() * 160, 800); ctx.fillStyle = cols[i % cols.length]; ctx.textAlign = 'center'; ctx.fillText(ch[i], 0, 80); ctx.restore();
    }
    ctx.restore();
    h.title(34, CH - 66, CW - 68, 56, s.ink, { valign: 'bottom', one: true }); h.foot(s.ink);
  },
  bars(ctx, d, h, r, s) {
    const n = 9 + (r() * 8 | 0), x0 = 36, x1 = CW - 36, top = 190, base = CH - 230, bw = (x1 - x0) / n, hi = r() * n | 0;
    h.font(110, 800); ctx.fillStyle = s.dark ? s.c : s.a === WHITE ? s.ink : s.a; ctx.textAlign = 'left'; ctx.fillText(String(20 + (d.i * 7) % 70), x0 - 6, 140);
    h.small(d.kicker, x1, 60, s.ink, 'right'); h.small('POSTERS PER CITY', x1, 80, s.ink, 'right');
    for (let i = 0; i < n; i++) {
      const v = .15 + r() * .85, y = base - v * (base - top);
      ctx.fillStyle = i === hi ? (s.dark ? s.c : s.a === WHITE ? s.ink : s.a) : rgba(s.ink, .8); ctx.fillRect(x0 + i * bw + 2, y, bw - 6, base - y);
    }
    ctx.fillStyle = s.ink; ctx.fillRect(x0, base, x1 - x0, 1.5);
    h.title(34, CH - 66, CW - 68, 80, s.ink, { valign: 'bottom', maxH: 100 }); h.foot(s.ink);
  },
  spiral(ctx, d, h, r, s) {
    const cx = CW * (.4 + r() * .2), cy = CH * (.34 + r() * .06), gap = 14 + r() * 8, turns = 9;
    ctx.save(); h.clipTop(CH - 200); ctx.lineCap = 'round';
    [[0, s.dark ? s.c : s.a], [Math.PI, s.ink]].forEach(([o, c]) => {
      ctx.strokeStyle = c; ctx.lineWidth = gap * .38; ctx.beginPath();
      for (let t = 0; t < turns * TAU; t += .05) { const rr = gap * t / Math.PI, x = cx + Math.cos(t + o) * rr, y = cy + Math.sin(t + o) * rr; t ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.stroke();
    });
    ctx.restore();
    h.title(34, CH - 66, CW - 68, 90, s.ink, { valign: 'bottom', maxH: 120 }); h.foot(s.ink);
  },
  truchet(ctx, d, h, r, s) {
    const n = 5 + (r() * 4 | 0), cell = CW / n, rows = Math.ceil((CH - 200) / cell);
    ctx.save(); h.clipTop(CH - 200); ctx.lineWidth = cell * (.14 + r() * .12); ctx.lineCap = 'butt';
    for (let y = 0; y < rows; y++) for (let x = 0; x < n; x++) {
      const px = x * cell, py = y * cell; ctx.strokeStyle = r() < .2 ? (s.dark ? s.c : s.a === WHITE ? s.b : s.a) : s.ink; ctx.beginPath();
      if (r() < .5) { ctx.arc(px, py, cell / 2, 0, Math.PI / 2); ctx.moveTo(px + cell, py + cell / 2); ctx.arc(px + cell, py + cell, cell / 2, -Math.PI / 2, Math.PI, true); }
      else { ctx.arc(px + cell, py, cell / 2, Math.PI / 2, Math.PI); ctx.moveTo(px + cell / 2, py + cell); ctx.arc(px, py + cell, cell / 2, 0, -Math.PI / 2, true); }
      ctx.stroke();
    }
    ctx.restore();
    h.title(34, CH - 66, CW - 68, 90, s.ink, { valign: 'bottom', maxH: 120 }); h.foot(s.ink);
  },
  outline(ctx, d, h, r, s) {
    const t = d.num; h.font(100, 800); const sz = (CW - 40) / ctx.measureText(t).width * 100, y = CH - 190, st = 26 + r() * 22, n = Math.min(9, Math.floor((y - sz * .74 - 30) / st));
    h.font(sz, 800); ctx.textAlign = 'left'; ctx.lineWidth = 2;
    for (let k = n; k > 0; k--) { ctx.strokeStyle = k % 2 ? (s.dark ? s.c : s.a === WHITE ? s.b : s.a) : s.ink; ctx.strokeText(t, 20, y - k * st); }
    ctx.fillStyle = s.dark ? s.c : s.a === WHITE ? s.ink : s.a; ctx.fillText(t, 20, y);
    h.title(34, CH - 66, CW - 68, 80, s.ink, { valign: 'bottom', maxH: 90 });
    h.foot(s.ink);
  },
  mirror(ctx, d, h, r, s) {
    const hh = CH - 190, pc = h.photoCanvas(CW / 2, hh);
    ctx.drawImage(pc, 0, 0, CW / 2, hh); ctx.save(); ctx.translate(CW, 0); ctx.scale(-1, 1); ctx.drawImage(pc, 0, 0, CW / 2, hh); ctx.restore();
    ctx.fillStyle = s.bg; ctx.fillRect(CW / 2 - 1, 0, 2, hh);
    h.title(34, CH - 66, CW - 68, 90, s.ink, { valign: 'bottom', maxH: 110 }); h.foot(s.ink);
  },
  lineScan(ctx, d, h, r, s) {
    const rows = 56 + (r() * 30 | 0), top = 30, hh = CH - 240, st = hh / rows, wav = r() * 6;
    ctx.fillStyle = s.dark ? s.c : s.ink;
    for (let i = 0; i < rows; i++) {
      const yc = top + (i + .5) * st, v = (i + .5) / rows, up = [], dn = [];
      for (let x = 0; x <= CW; x += 4) { const l = h.lum(x / CW, v), t = (s.dark ? l : 1 - l) * st * .92 + .3, yo = Math.sin(x * .02 + i * .1) * wav; up.push([x, yc - t / 2 + yo]); dn.push([x, yc + t / 2 + yo]); }
      ctx.beginPath(); up.forEach(([x, y], k) => k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); for (let k = dn.length - 1; k >= 0; k--) ctx.lineTo(...dn[k]); ctx.fill();
    }
    h.title(34, CH - 66, CW - 68, 90, s.ink, { valign: 'bottom', maxH: 120 }); h.foot(s.ink);
  },
  dotPhoto(ctx, d, h, r, s) {
    const st = 10 + (r() * 6 | 0), hh = CH - 200;
    ctx.fillStyle = s.dark ? s.c : s.a === WHITE ? s.ink : s.a;
    for (let y = st / 2, row = 0; y < hh; y += st, row++) for (let x = (row % 2) * st / 2; x < CW + st; x += st) {
      const l = h.lum(x / CW, y / hh), rr = (s.dark ? l : 1 - l) * st * .62; if (rr < .5) continue; ctx.beginPath(); ctx.arc(x, y, rr, 0, TAU); ctx.fill();
    }
    h.title(34, CH - 66, CW - 68, 90, s.ink, { valign: 'bottom', maxH: 120 }); h.foot(s.ink);
  },
  triangles(ctx, d, h, r, s) {
    const n = 5 + (r() * 3 | 0), cell = CW / n, rows = Math.ceil((CH - 200) / cell), cols = h.notBg([s.a, s.c, s.ink, s.b]);
    ctx.save(); h.clipTop(CH - 200);
    for (let y = 0; y < rows; y++) for (let x = 0; x < n; x++) {
      const px = x * cell, py = y * cell, f = r() < .5;
      [[0, 1], [1, 0]].forEach(([a]) => {
        if (r() < .42) return; ctx.fillStyle = cols[r() * cols.length | 0]; ctx.beginPath();
        if (f) { a ? (ctx.moveTo(px, py), ctx.lineTo(px + cell, py), ctx.lineTo(px, py + cell)) : (ctx.moveTo(px + cell, py), ctx.lineTo(px + cell, py + cell), ctx.lineTo(px, py + cell)); }
        else { a ? (ctx.moveTo(px, py), ctx.lineTo(px + cell, py), ctx.lineTo(px + cell, py + cell)) : (ctx.moveTo(px, py), ctx.lineTo(px + cell, py + cell), ctx.lineTo(px, py + cell)); }
        ctx.fill();
      });
    }
    ctx.restore();
    h.title(34, CH - 66, CW - 68, 90, s.ink, { valign: 'bottom', maxH: 120 }); h.foot(s.ink);
  },
  tear(ctx, d, h, r, s) {
    const y0 = CH * (.5 + r() * .12); h.photo(0, 0, CW, y0 + 30);
    const edge = []; for (let x = 0; x <= CW; x += 7) edge.push([x, y0 + (r() - .5) * 14 + Math.sin(x * .04 + r()) * 6]);
    const tearPath = dy => { ctx.beginPath(); ctx.moveTo(0, CH); edge.forEach(([x, y]) => ctx.lineTo(x, y + dy)); ctx.lineTo(CW, CH); ctx.closePath(); };
    ctx.fillStyle = s.dark ? ICE : WHITE; tearPath(-5); ctx.fill(); ctx.fillStyle = s.bg; tearPath(0); ctx.fill();
    h.title(30, y0 + 40, CW - 60, 96, s.ink, { maxH: CH - y0 - 100 });
    h.small(d.kicker, 30, 40, '#fff'); h.small('№ ' + d.num, CW - 30, CH - 24, s.ink, 'right');
  },
  columns(ctx, d, h, r, s) {
    const t = h.title(30, 36, CW - 60, 92, s.ink, { maxH: 230, weight: 800 });
    const y0 = t.bottom + 30; ctx.fillStyle = s.ink; ctx.fillRect(30, y0, CW - 60, 2);
    const cw = (CW - 60 - 30) / 3, qx = r() < .5 ? 0 : 1, qy = y0 + 70 + r() * 120, qh = 150;
    for (let c = 0; c < 3; c++) for (let y = y0 + 26; y < CH - 60; y += 14) {
      const inQ = (c === qx || c === qx + 1) && y > qy - 10 && y < qy + qh + 10; if (inQ) continue;
      ctx.fillStyle = rgba(s.ink, .3); ctx.fillRect(30 + c * (cw + 15), y, cw - (r() < .1 ? r() * 60 : 0), 4);
    }
    const qb = s.dark ? s.c : s.a === WHITE ? s.ink : s.a; ctx.fillStyle = qb; ctx.fillRect(30 + qx * (cw + 15), qy, cw * 2 + 15, qh);
    ctx.fillStyle = on(qb); ctx.font = '600 22px Inter, sans-serif'; if ('letterSpacing' in ctx) ctx.letterSpacing = '-0.5px'; ctx.textAlign = 'left';
    const q = QUOTES[d.i % QUOTES.length].split(' '); let line = '', ly = qy + 38, lx = 30 + qx * (cw + 15) + 18, mw = cw * 2 - 22;
    q.forEach(w => { const tt = line ? line + ' ' + w : w; if (ctx.measureText(tt).width > mw) { ctx.fillText(line, lx, ly); ly += 27; line = w; } else line = tt; }); ctx.fillText(line, lx, ly);
    h.small(d.kicker, 30, CH - 24, s.ink); h.small('№ ' + d.num, CW - 30, CH - 24, s.ink, 'right');
  },
  gridType(ctx, d, h, r, s) {
    const ch = d.name.replace(/\s/g, '').toUpperCase().slice(0, 12), nc = ch.length <= 4 ? 2 : 3, m = 30, cell = (CW - 2 * m) / nc, rows = Math.ceil(ch.length / nc), top = Math.max(40, (CH - 80 - rows * cell) / 2);
    h.font(cell * .78, 800); ctx.textAlign = 'center';
    for (let i = 0; i < ch.length; i++) {
      const x = m + (i % nc) * cell, y = top + (i / nc | 0) * cell, fill = r() < .3;
      if (fill) { ctx.fillStyle = s.dark ? s.c : s.a === WHITE ? s.ink : s.a; ctx.fillRect(x, y, cell, cell); }
      ctx.strokeStyle = rgba(s.ink, .35); ctx.lineWidth = 1; ctx.strokeRect(x, y, cell, cell);
      ctx.fillStyle = fill ? on(s.dark ? s.c : s.a === WHITE ? s.ink : s.a) : s.ink; ctx.fillText(ch[i], x + cell / 2, y + cell * .78);
    }
    h.foot(s.ink);
  },
};

/* ---- photos load on demand, once ---- */
const imgs = [], waiting = designs.map(() => []), started = [];
function need(i, fn) {
  const d = designs[i]; if (!d || !d.photo) return;
  if (imgs[i]) return;
  if (fn) waiting[i].push(fn);
  if (started[i]) return; started[i] = true;
  const im = new Image(); im.crossOrigin = 'anonymous';
  im.onload = () => { imgs[i] = im; waiting[i].splice(0).forEach(f => f(im)); };
  im.src = d.src;
}
/* draw design i into ctx (already scaled); re-draws by itself once the photo and fonts arrive */
function render(ctx, i, after) {
  i = ((i % designs.length) + designs.length) % designs.length;
  const draw = () => { drawPoster(ctx, designs[i], imgs[i] || null); after && after(); };
  draw();
  need(i, draw);
  document.fonts && document.fonts.ready.then(draw);
}
function paint(cv, i, scale = 1) {
  cv.width = Math.round(CW * scale); cv.height = Math.round(CH * scale);
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  render(ctx, i);
}

window.BW = { CW, CH, designs, drawPoster, render, paint, need, imgs, colors: { NAVY, COBALT, ICE, SKY, PAPER, CYAN, DEEP, INK } };
})();
