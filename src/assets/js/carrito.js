// /src/assets/js/carrito.js
document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'cart';
  const TAX_RATE = 0.16;
  const WHATSAPP_NUMBER = '524495049925';

  // DOM
  const openCartBtn = document.getElementById('open-cart-btn');
  const cartModal = document.getElementById('cart-modal');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const cartTaxEl = document.getElementById('cart-tax');
  const cartTotalEl = document.getElementById('cart-total');
  const emptyBtn = document.getElementById('cart-empty-btn');
  const checkoutBtn = document.getElementById('cart-checkout-btn');

  // estado
  let cart = loadCart();
  let tipAmount = parseFloat(localStorage.getItem('cart_tip') || '0');

  // abrir/cerrar carrito (usa la clase 'open' — coincide con menu.css)
  if (openCartBtn && cartModal) {
    openCartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      renderCart();
      cartModal.classList.add('open');
    });
  }
  if (cartCloseBtn && cartModal) {
    cartCloseBtn.addEventListener('click', () => cartModal.classList.remove('open'));
  }
  if (cartModal) {
    cartModal.addEventListener('click', (e) => {
      if (e.target === cartModal) cartModal.classList.remove('open');
    });
  }

  // Delegación para botones "Agregar" (Catalogo.js pone botones con class .agregar-carrito)
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('.agregar-carrito');
    if (!btn) return;
    const id = parseInt(btn.dataset.id, 10);
    if (!isNaN(id)) addToCart(id);
  });

  // Vaciar carrito
  if (emptyBtn) {
    emptyBtn.addEventListener('click', () => {
      if (!confirm('¿Vaciar carrito?')) return;
      cart = [];
      tipAmount = 0;
      saveCart();
      localStorage.removeItem('cart_tip');
      renderCart();
    });
  }

  // Checkout WhatsApp
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) return alert('El carrito está vacío.');
      const totals = calcularTotals();
      let msg = `Pedido:%0A`;
      cart.forEach(i => msg += `• ${i.name} x${i.qty} - $${(i.price * i.qty).toFixed(2)}%0A`);
      if (tipAmount) msg += `%0APropina: $${tipAmount.toFixed(2)}%0A`;
      msg += `%0ATotal: $${totals.total.toFixed(2)}`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    });
  }

  // Botón proceder a pago (crearlo si no existe)
  ensureProceedButton();

  // inicio render
  renderCart();

  // -------- funciones --------
  function loadCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveCart() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }

  function addToCart(id) {
    const prod = (window.productosGlobal || []).find(p => p.id === id);
    if (!prod) {
      console.warn('Producto no encontrado:', id);
      return;
    }
    const item = cart.find(i => i.id === id);
    if (item) item.qty++;
    else cart.push({ id: prod.id, name: prod.name, price: prod.price, image: prod.image || '', qty: 1, note: '' });

    saveCart();
    renderCart();
    if (cartModal) cartModal.classList.add('open');
  }

  function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    renderCart();
  }

  function updateQty(id, qty) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty = Math.max(1, parseInt(qty, 10) || 1);
    saveCart();
    renderCart();
  }

  function updateNote(id, note) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.note = note;
    saveCart();
  }

  function calcularTotals() {
    const subtotal = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax + (tipAmount || 0);
    return { subtotal, tax, total };
  }

  function renderCart() {
    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = '';

    if (!cart.length) {
      cartItemsContainer.innerHTML = '<div class="sin-productos">Tu carrito está vacío</div>';
    } else {
      cart.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
          <img src="${item.image || '../assets/img/placeholder.png'}" class="cart-item-image" alt="${item.name}">
          <div class="cart-item-info">
            <div class="cart-item-top">
              <strong class="cart-item-name">${item.name}</strong>
              <button class="cart-item-remove" data-id="${item.id}" title="Eliminar">&times;</button>
            </div>
            <div class="cart-item-body">
              <div class="cart-item-price">$${item.price.toFixed(2)}</div>
              <div class="cart-item-controls">
                <label>Cant.
                  <input type="number" min="1" value="${item.qty}" class="cart-item-qty" data-id="${item.id}">
                </label>
                <textarea class="cart-item-note" data-id="${item.id}" placeholder="Nota (opcional)">${escapeHtml(item.note)}</textarea>
              </div>
            </div>
          </div>
        `;
        cartItemsContainer.appendChild(div);

        div.querySelector('.cart-item-remove').addEventListener('click', () => removeFromCart(item.id));
        div.querySelector('.cart-item-qty').addEventListener('change', e => updateQty(item.id, e.target.value));
        div.querySelector('.cart-item-note').addEventListener('input', e => updateNote(item.id, e.target.value));
      });
    }

    const totals = calcularTotals();
    if (cartSubtotalEl) cartSubtotalEl.textContent = `$${totals.subtotal.toFixed(2)}`;
    if (cartTaxEl) cartTaxEl.textContent = `$${totals.tax.toFixed(2)}`;
    if (cartTotalEl) cartTotalEl.textContent = `$${totals.total.toFixed(2)}`;

    // persistir tip/local totals
    localStorage.setItem('cart_total', totals.total.toFixed(2));
  }

  function ensureProceedButton() {
    if (!cartModal) return;
    // evitar duplicados
    if (document.getElementById('cart-pay-btn')) return;
    const actions = cartModal.querySelector('.cart-actions');
    if (!actions) return;
    const payBtn = document.createElement('button');
    payBtn.id = 'cart-pay-btn';
    payBtn.className = 'btn';
    payBtn.type = 'button';
    payBtn.textContent = 'Proceder al pago';
    actions.insertBefore(payBtn, actions.firstChild);
    payBtn.addEventListener('click', () => {
      const totals = calcularTotals();
      window.location.href = `../pagos/pagos.html?total=${encodeURIComponent(totals.total.toFixed(2))}`;
    });
  }

  function escapeHtml(text) {
    if (!text) return '';
    return String(text).replace(/[&<>"']/g, function (m) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];
    });
  }

});
