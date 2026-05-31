/* ============================================================
   cart.js — Gestion du panier (toutes les pages)
   ============================================================ */

// ── Panier en mémoire ────────────────────────────────────────
let cart = JSON.parse(localStorage.getItem('seikomods_cart') || '[]');

// ── Enregistrer ──────────────────────────────────────────────
function saveCart() {
  localStorage.setItem('seikomods_cart', JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

// ── Ajouter un article ───────────────────────────────────────
function addToCart(name, price, opts = {}, imgs = {}) {
  const item = { id: Date.now(), name, price, opts, imgs };
  cart.push(item);
  saveCart();
  showToast(`✓ "${name}" ajouté au panier`);
  // Mettre à jour le badge nav
  updateCartCount();
}

// ── Supprimer un article ─────────────────────────────────────
function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
}

// ── Calcul du total du panier ────────────────────────────────
function getCartTotal() {
  return cart.reduce((sum, i) => sum + i.price, 0);
}

// ── Render du sidebar ────────────────────────────────────────
function renderCart() {
  const container  = document.getElementById('cartItems');
  const footer     = document.getElementById('cartFooter');
  const totalEl    = document.getElementById('cartTotal');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty" style="text-align:center;padding:3rem 1rem">
        <div style="font-size:3rem;margin-bottom:1rem;opacity:.3">🛍</div>
        <p style="color:var(--muted)">Votre panier est vide</p>
        <a href="configurateur.html" class="btn btn-outline" style="margin-top:1rem;display:inline-flex">
          ✦ Créer ma montre
        </a>
      </div>`;
    if (footer) footer.style.display = 'none';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">
        ${item.imgs && item.imgs.case
          ? `<img src="${item.imgs.case}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;border-radius:8px">`
          : `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
          <rect x="30" y="0"  width="20" height="12" rx="3" fill="#666"/>
          <circle cx="40" cy="45" r="28" fill="#c0c0c0"/>
          <circle cx="40" cy="45" r="24" fill="#0f2a55"/>
          <line x1="40" y1="45" x2="40" y2="25" stroke="#c9a84c" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="40" y1="45" x2="55" y2="35" stroke="#c9a84c" stroke-width="2" stroke-linecap="round"/>
          <circle cx="40" cy="45" r="3" fill="#c9a84c"/>
          <rect x="30" y="68"  width="20" height="12" rx="3" fill="#666"/>
        </svg>`}
      </div>
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <div class="cart-item-opts">
          ${item.opts.finition  ? `Finition: ${item.opts.finition}<br>`  : ''}
          ${item.opts.bracelet  ? `Bracelet: ${item.opts.bracelet}<br>` : ''}
          ${item.opts.cadran    ? `Cadran: ${item.opts.cadran}<br>`    : ''}
          ${item.opts.aiguilles ? `Aiguilles: ${item.opts.aiguilles}`  : ''}
        </div>
        <div class="cart-item-price">${item.price} €</div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})">✕</button>
    </div>
  `).join('');

  if (footer) {
    footer.style.display = 'block';
    if (totalEl) totalEl.textContent = `${getCartTotal()} €`;
  }
}

// ── Ouvrir / fermer le panier ────────────────────────────────
function openCart() {
  document.getElementById('cartSidebar')?.classList.add('open');
  document.getElementById('cartOverlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  document.getElementById('cartSidebar')?.classList.remove('open');
  document.getElementById('cartOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

// ── Compteur de la nav ───────────────────────────────────────
function updateCartCount() {
  const count = cart.length;
  ['cartBadge', 'cartCount'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

// ── Toast notification ───────────────────────────────────────
function showToast(msg) {
  const toast   = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast) return;
  if (toastMsg) toastMsg.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ── Checkout PayPal ──────────────────────────────────────────
function goToCheckout() {
  if (cart.length === 0) { showToast('Votre panier est vide !'); return; }

  const total = getCartTotal();
  const desc  = cart.map(i => i.name).join(' + ');

  // ⚠️  REMPLACE "TON_PAYPAL_EMAIL" par ton email PayPal
  const paypalEmail = 'seikomods.louis@gmail.com';

  // Crée un formulaire PayPal dynamique
  const form = document.createElement('form');
  form.method = 'post';
  form.action = 'https://www.paypal.com/cgi-bin/webscr';
  form.target = '_blank';

  const fields = {
    cmd:           '_xclick',
    business:      paypalEmail,
    item_name:     desc,
    amount:        total.toFixed(2),
    currency_code: 'EUR',
    return:        window.location.origin + '/merci.html',
    cancel_return: window.location.href,
    no_shipping:   '1',
  };

  Object.entries(fields).forEach(([name, value]) => {
    const input = document.createElement('input');
    input.type  = 'hidden';
    input.name  = name;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);

  // Vider le panier après commande
  cart = [];
  saveCart();
  closeCart();
}

// ── Init sur chaque page ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  renderCart();

  // Boutons panier
  document.getElementById('cartBtn')?.addEventListener('click', openCart);
  document.getElementById('cartClose')?.addEventListener('click', closeCart);
  document.getElementById('cartOverlay')?.addEventListener('click', closeCart);
  document.getElementById('checkoutBtn')?.addEventListener('click', goToCheckout);
});
