/* ============================================================
   configurateur.js — Logique du configurateur de montre
   ============================================================ */

// ── Couleurs SVG par option ──────────────────────────────────
const DIAL_COLORS = {
  blue:      { main:'#0f2a55', grad1:'#1a3a7a', grad2:'#0a1830', index:'#ffffff', text:'rgba(255,255,255,.7)' },
  sunblue:   { main:'#0f2a55', grad1:'#2a5a9e', grad2:'#0f2a55', index:'#ffffff', text:'rgba(255,255,255,.7)' },
  black:     { main:'#0d0d0d', grad1:'#1a1a1a', grad2:'#050505', index:'#c9a84c', text:'rgba(201,168,76,.7)' },
  green:     { main:'#0f2515', grad1:'#1e4a2a', grad2:'#0a1a0f', index:'#ffffff', text:'rgba(255,255,255,.7)' },
  white:     { main:'#f0ede5', grad1:'#faf8f2', grad2:'#e0ddd5', index:'#2a2a2a', text:'rgba(50,50,50,.7)' },
  champagne: { main:'#c9a84c', grad1:'#f5e8c0', grad2:'#c9a84c', index:'#5a3d00', text:'rgba(90,61,0,.7)' },
  burgundy:  { main:'#6a1020', grad1:'#8a2030', grad2:'#4a0815', index:'#ffffff', text:'rgba(255,255,255,.7)' },
  salmon:    { main:'#d4846a', grad1:'#e89a80', grad2:'#c07060', index:'#ffffff', text:'rgba(255,255,255,.7)' },
};

const STRAP_COLORS = {
  silver:  { body:'#888', inner:'#aaa' },
  gold:    { body:'#b08a30', inner:'#c9a84c' },
  black:   { body:'#1a1a1a', inner:'#2a2a2a' },
  brown:   { body:'#5a3a1a', inner:'#7a4a2a' },
  blue:    { body:'#1a2a5a', inner:'#2a3a7a' },
  green:   { body:'#3a4a2a', inner:'#556644' },
};

const HANDS_COLORS = {
  gold:     '#c9a84c',
  silver:   '#d0d0d0',
  black:    '#222222',
  'rose-gold': '#c08070',
};

// ── État de la configuration ─────────────────────────────────
const state = {
  braceletType:  'oyster',
  braceletTypeName: 'Acier Oyster',
  braceletColor: 'silver',
  braceletColorName: 'Argent',
  dialStyle:     'sunburst',
  dialStyleName: 'Sunburst',
  dialColor:     'sunblue',
  dialColorName: 'Sunburst Bleu',
  handsStyle:    'mercedes',
  handsStyleName: 'Mercedes',
  handsColor:    'gold',
  handsColorName: 'Dorées',
  basePrice: 149,
  extras: 0,
};

// ── Met à jour le SVG ────────────────────────────────────────
function updatePreview() {
  const dial   = DIAL_COLORS[state.dialColor]  || DIAL_COLORS.sunblue;
  const strap  = STRAP_COLORS[state.braceletColor] || STRAP_COLORS.silver;
  const hColor = HANDS_COLORS[state.handsColor] || HANDS_COLORS.gold;

  // Cadran
  const dialEl = document.getElementById('dial');
  if (dialEl) dialEl.setAttribute('fill', dial.main);

  // Dégradé cadran : remplacer le gradient
  const svg = document.getElementById('watchPreview');
  if (svg) {
    let grad = svg.querySelector('#dialRadGrad');
    if (!grad) {
      grad = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
      grad.setAttribute('id', 'dialRadGrad');
      grad.setAttribute('cx', '30%'); grad.setAttribute('cy', '25%'); grad.setAttribute('r', '75%');
      svg.querySelector('defs').appendChild(grad);
    }
    grad.innerHTML = `
      <stop offset="0%"   stop-color="${dial.grad1}"/>
      <stop offset="100%" stop-color="${dial.grad2}"/>
    `;
    if (dialEl) dialEl.setAttribute('fill', `url(#dialRadGrad)`);
  }

  // Index
  const indexes = document.querySelectorAll('#indexes rect, #indexes polygon');
  indexes.forEach(el => el.setAttribute('fill', dial.index));

  // Texte
  const texts = document.querySelectorAll('#watchPreview text');
  if (texts[0]) texts[0].setAttribute('fill', dial.text);

  // Bracelet
  const ids = ['strapTopBody','strapBotBody'];
  const idsInner = ['strapTopInner','strapBotInner'];
  ids.forEach(id => { const el = document.getElementById(id); if(el) el.setAttribute('fill', strap.body); });
  idsInner.forEach(id => { const el = document.getElementById(id); if(el) el.setAttribute('fill', strap.inner); });

  // Couronne
  const crown = document.getElementById('crown');
  if (crown) crown.setAttribute('fill', strap.inner);

  // Bezel couleur
  const bezel = document.getElementById('bezel');
  if (bezel) bezel.setAttribute('fill', state.braceletColor === 'gold' ? '#b08a30' : state.braceletColor === 'black' ? '#2a2a2a' : '#b0b0b0');

  // Aiguilles
  const hourBody = document.getElementById('hourBody');
  const hourTip  = document.getElementById('hourTip');
  const minBody  = document.getElementById('minBody');
  const minTip   = document.getElementById('minTip');
  const center   = document.getElementById('centerDot');
  if (hourBody) hourBody.setAttribute('fill', hColor);
  if (hourTip)  hourTip.setAttribute('fill',  hColor);
  if (minBody)  minBody.setAttribute('fill',  hColor);
  if (minTip)   minTip.setAttribute('fill',   hColor);
  if (center)   center.setAttribute('fill',   hColor);

  // Style aiguilles (formes différentes)
  applyHandStyle(state.handsStyle, hColor);

  updateSummary();
}

// ── Style aiguilles ──────────────────────────────────────────
function applyHandStyle(style, color) {
  const hourG = document.getElementById('handHour');
  const minG  = document.getElementById('handMin');
  if (!hourG || !minG) return;

  const hourSVGMap = {
    mercedes: `<rect x="107" y="105" width="6" height="48" rx="3" id="hourBody" fill="${color}"/><circle cx="110" cy="110" r="8" fill="${color}" id="hourTip"/><circle cx="110" cy="110" r="4" fill="rgba(0,0,0,.3)" id="hourTipInner"/>`,
    baton:    `<rect x="108" y="105" width="4" height="50" rx="2" id="hourBody" fill="${color}"/><rect x="108" y="102" width="4" height="6" rx="1" id="hourTip" fill="${color}"/>`,
    dauphine: `<polygon points="110,100 106,148 110,152 114,148" id="hourBody" fill="${color}"/><polygon points="110,100 109,120 111,120" id="hourTip" fill="${color}" opacity=".5"/>`,
    snowflake:`<rect x="108.5" y="100" width="3" height="52" rx="1.5" id="hourBody" fill="${color}"/><rect x="103" y="116" width="14" height="3" rx="1.5" id="hourTip" fill="${color}"/>`,
  };
  const minSVGMap = {
    mercedes: `<rect x="108.5" y="88" width="3" height="65" rx="1.5" id="minBody" fill="${color}"/><polygon points="110,80 107,95 113,95" id="minTip" fill="${color}"/>`,
    baton:    `<rect x="109" y="85" width="2" height="68" rx="1" id="minBody" fill="${color}"/><rect x="109" y="82" width="2" height="6" rx="1" id="minTip" fill="${color}"/>`,
    dauphine: `<polygon points="110,82 107,148 110,153 113,148" id="minBody" fill="${color}"/><polygon points="110,82 109,108 111,108" id="minTip" fill="${color}" opacity=".5"/>`,
    snowflake:`<rect x="109" y="82" width="2" height="70" rx="1" id="minBody" fill="${color}"/><rect x="104" y="100" width="12" height="2" rx="1" id="minTip" fill="${color}"/>`,
  };

  hourG.innerHTML = hourSVGMap[style] || hourSVGMap.mercedes;
  minG.innerHTML  = minSVGMap[style]  || minSVGMap.mercedes;
}

// ── Met à jour le résumé texte ───────────────────────────────
function updateSummary() {
  const braceletFull = `${state.braceletTypeName} ${state.braceletColorName}`;
  const handsFull    = `${state.handsStyleName} ${state.handsColorName}`;
  const total        = state.basePrice + state.extras;

  // Desktop
  const sB = document.getElementById('sumBracelet');
  const sD = document.getElementById('sumDial');
  const sH = document.getElementById('sumHands');
  const sP = document.getElementById('sumPrice');
  if (sB) sB.textContent = braceletFull;
  if (sD) sD.textContent = state.dialColorName;
  if (sH) sH.textContent = handsFull;
  if (sP) sP.textContent = `${total} €`;

  // Mobile
  const sBm = document.getElementById('sumBraceletM');
  const sDm = document.getElementById('sumDialM');
  const sHm = document.getElementById('sumHandsM');
  const sPm = document.getElementById('sumPriceM');
  if (sBm) sBm.textContent = braceletFull;
  if (sDm) sDm.textContent = state.dialColorName;
  if (sHm) sHm.textContent = handsFull;
  if (sPm) sPm.textContent = `${total} €`;
}

// ── Gestion des clics d'options ──────────────────────────────
function handleOptionClick(btn) {
  const type  = btn.dataset.type;
  const val   = btn.dataset.val;
  const name  = btn.dataset.name;
  const price = parseInt(btn.dataset.price || '0');

  // Désactive les autres du même groupe
  document.querySelectorAll(`[data-type="${type}"]`).forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  switch(type) {
    case 'bracelet-type':
      state.braceletType     = val;
      state.braceletTypeName = name;
      // Changer la photo de prévisualisation
      const imgSrc = btn.dataset.img;
      if (imgSrc) updateWatchPhoto(imgSrc);
      break;
    case 'bracelet-color':
      state.braceletColor     = val;
      state.braceletColorName = name;
      break;
    case 'dial-style':
      state.dialStyle     = val;
      state.dialStyleName = name;
      // Le style fumé = opacité du cadran
      adjustDialStyle(val);
      break;
    case 'dial-color':
      state.dialColor     = val;
      state.dialColorName = name;
      // Mettre à jour le label du cadran sur la photo
      const labelEl = document.getElementById('dialOverlayLabel');
      if (labelEl) labelEl.textContent = `Cadran : ${name}`;
      const dot = document.querySelector('.dial-dot');
      if (dot) dot.style.background = DIAL_COLORS[val]?.main || '#0f2a55';
      break;
    case 'hands-style':
      state.handsStyle     = val;
      state.handsStyleName = name;
      break;
    case 'hands-color':
      state.handsColor     = val;
      state.handsColorName = name;
      break;
  }

  // Recalcul des extras
  recalcExtras();
  updatePreview();
}

// ── Changer la photo du boîtier ──────────────────────────────
function updateWatchPhoto(src) {
  const img = document.getElementById('watchPhoto');
  if (!img) return;
  img.classList.add('fade');
  setTimeout(() => {
    img.src = src;
    img.onload = () => img.classList.remove('fade');
    // Fallback si l'image ne charge pas
    img.onerror = () => img.classList.remove('fade');
  }, 200);
}

function updateBraceletColors(type) {
  const colorGrid = document.getElementById('braceletColorGrid');
  if (!colorGrid) return;
  // Pour NATO & caoutchouc → couleurs différentes
  const isSoft = (type === 'nato' || type === 'rubber' || type === 'cuir');
  colorGrid.querySelectorAll('.color-btn').forEach(btn => {
    if (btn.dataset.val === 'gold') {
      btn.style.opacity = isSoft ? '.3' : '1';
      btn.style.pointerEvents = isSoft ? 'none' : 'all';
    }
  });
}

function updateStrapShape(type) {
  // Pour NATO, on montre un bracelet plat visuellement
  const topBody = document.getElementById('strapTopBody');
  const botBody = document.getElementById('strapBotBody');
  if (!topBody) return;
  if (type === 'nato' || type === 'rubber') {
    topBody.setAttribute('rx', '2');
    botBody && botBody.setAttribute('rx', '2');
  } else {
    topBody.setAttribute('rx', '6');
    botBody && botBody.setAttribute('rx', '6');
  }
}

function adjustDialStyle(style) {
  const gloss = document.getElementById('dialGloss');
  if (!gloss) return;
  switch(style) {
    case 'sunburst':   gloss.setAttribute('opacity', '.35'); break;
    case 'mat':        gloss.setAttribute('opacity', '0');   break;
    case 'fumee':      gloss.setAttribute('opacity', '.6');  break;
    case 'guilloche':  gloss.setAttribute('opacity', '.2');  break;
  }
}

function recalcExtras() {
  let extras = 0;
  // Bracelet
  const braceletBtn = document.querySelector('[data-type="bracelet-type"].active');
  if (braceletBtn) extras += parseInt(braceletBtn.dataset.price || '0');
  // Cadran style
  const dialStyleBtn = document.querySelector('[data-type="dial-style"].active');
  if (dialStyleBtn) extras += parseInt(dialStyleBtn.dataset.price || '0');
  // Aiguilles
  const handsStyleBtn = document.querySelector('[data-type="hands-style"].active');
  if (handsStyleBtn) extras += parseInt(handsStyleBtn.dataset.price || '0');

  state.extras = extras;
}

// ── Ajouter au panier depuis le configurateur ────────────────
function addConfigToCart() {
  const total = state.basePrice + state.extras;
  const name  = `SeikoMod Custom — ${state.dialColorName}`;
  const opts  = {
    bracelet: `${state.braceletTypeName} ${state.braceletColorName}`,
    cadran:   `${state.dialStyleName} ${state.dialColorName}`,
    aiguilles:`${state.handsStyleName} ${state.handsColorName}`,
  };
  addToCart(name, total, opts);
}

// ── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Bind option buttons
  document.querySelectorAll('.option-btn, .color-btn').forEach(btn => {
    btn.addEventListener('click', () => handleOptionClick(btn));
  });

  // Bind add-to-cart buttons
  const atcBtn  = document.getElementById('addToCartBtn');
  const atcBtnM = document.getElementById('addToCartBtnM');
  if (atcBtn)  atcBtn.addEventListener('click',  addConfigToCart);
  if (atcBtnM) atcBtnM.addEventListener('click', addConfigToCart);

  // Aiguilles secondes animées
  animateSecondHand();

  // Premier rendu
  recalcExtras();
  updatePreview();
});

// ── Animation aiguille des secondes ─────────────────────────
function animateSecondHand() {
  const secHand = document.getElementById('handSec');
  if (!secHand) return;

  function tick() {
    const now = new Date();
    const sec = now.getSeconds() + now.getMilliseconds() / 1000;
    const deg = sec * 6; // 360 / 60
    secHand.setAttribute('transform', `rotate(${deg}, 110, 148)`);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // Aiguilles fixes (heures & minutes) basées sur l'heure réelle
  const now = new Date();
  const hours   = now.getHours() % 12;
  const minutes = now.getMinutes();
  const secVal  = now.getSeconds();

  const hourDeg = hours * 30 + minutes * 0.5;
  const minDeg  = minutes * 6 + secVal * 0.1;

  const handHour = document.getElementById('handHour');
  const handMin  = document.getElementById('handMin');
  if (handHour) handHour.setAttribute('transform', `rotate(${hourDeg}, 110, 148)`);
  if (handMin)  handMin.setAttribute('transform',  `rotate(${minDeg},  110, 148)`);
}
