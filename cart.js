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
function addToCart(name, price, opts = {}, imgs = {}, triggerBtn = null) {
  const item = { id: Date.now(), name, price, opts, imgs };
  cart.push(item);
  saveCart();
  showToast(`✓ "${name}" ajouté au panier`);
  updateCartCount();
  // Animation de confirmation sur le bouton cliqué
  if (triggerBtn) {
    const original = triggerBtn.innerHTML;
    triggerBtn.innerHTML = '✓ Ajouté';
    triggerBtn.classList.add('btn-added');
    triggerBtn.disabled = true;
    setTimeout(() => {
      triggerBtn.innerHTML = original;
      triggerBtn.classList.remove('btn-added');
      triggerBtn.disabled = false;
    }, 900);
  }
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

function getShipping() {
  return cart.length >= 2 ? 0 : 10;
}

function getTotalWithShipping() {
  return getCartTotal() + getShipping();
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
    const shipping = getShipping();
    const shippingEl = document.getElementById('cartShipping');
    if (shippingEl) {
      if (shipping === 0) {
        shippingEl.innerHTML = '<span style="color:green;font-weight:600">🎉 Livraison offerte !</span>';
      } else {
        shippingEl.textContent = '10 €';
      }
    }
    if (totalEl) totalEl.textContent = `${getTotalWithShipping()} €`;
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
  ['cartBadge', 'cartBadgeMobile', 'cartCount'].forEach(id => {
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

// ── Checkout Stripe ──────────────────────────────────────────
const VERCEL_API_URL = 'https://seikomods-site.vercel.app/api/create-checkout';

async function goToCheckout() {
  if (cart.length === 0) { showToast('Votre panier est vide !'); return; }

  const btn = document.getElementById('checkoutBtn');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Chargement...';
  }

  try {
    const response = await fetch(VERCEL_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.error || 'Erreur serveur');

    // Vider le panier et rediriger vers Stripe
    cart = [];
    saveCart();
    closeCart();
    window.location.href = data.url;

  } catch (err) {
    console.error('Checkout error:', err);
    showToast('Erreur lors du paiement. Réessayez.');
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Commander';
    }
  }
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
