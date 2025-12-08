// ../assets/js/carrito.js
document.addEventListener('DOMContentLoaded', () => {

  const WHATSAPP_NUMBER = '524495049925';
  const STORAGE_KEY = 'mariscos28_cart';
  const TAX_RATE = 0.16;

  let tipAmount = 0;

  const cartModal = document.getElementById('cart-modal');
  const tipModal = document.getElementById('tip-modal');

  const cartItemsEl = document.getElementById('cart-items');
  const subtotalEl = document.getElementById('cart-subtotal');
  const taxEl = document.getElementById('cart-tax');
  const totalEl = document.getElementById('cart-total');
  const tipSelectedEl = document.getElementById('tip-selected');

  let cart = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  function calcTotals() {
    const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax + tipAmount;

    subtotalEl.innerText = `$${subtotal.toFixed(2)}`;
    taxEl.innerText = `$${tax.toFixed(2)}`;
    totalEl.innerText = `$${total.toFixed(2)}`;

    localStorage.setItem('cart_total', total.toFixed(2));
    return total;
  }

  function renderCart() {
    if(cart.length === 0) {
      cartItemsEl.innerHTML = '<p>Tu carrito está vacío</p>';
      calcTotals();
      return;
    }

    cartItemsEl.innerHTML = '';
    cart.forEach(item => {
      const div = document.createElement('div');
      div.classList.add('cart-item');
      div.innerHTML = `
        <span>${item.name} x${item.qty}</span>
        <span>$${(item.price*item.qty).toFixed(2)}</span>
      `;
      cartItemsEl.appendChild(div);
    });
    calcTotals();
  }

  // Abrir/cerrar carrito
  document.getElementById('open-cart-btn').addEventListener('click', () => cartModal.classList.add('show'));
  document.getElementById('cart-close-btn').addEventListener('click', () => cartModal.classList.remove('show'));

  // Vaciar carrito
  document.getElementById('cart-empty-btn').addEventListener('click', () => {
    if(confirm('¿Deseas vaciar el carrito?')) {
      cart = [];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      tipAmount = 0;
      tipSelectedEl.innerText = `Propina seleccionada: $0`;
      renderCart();
    }
  });

  // Checkout WhatsApp
  document.getElementById('cart-checkout-btn').addEventListener('click', () => {
    if(cart.length === 0) return alert('El carrito está vacío');
    const total = calcTotals();
    let msg = `Hola, quiero realizar un pedido:\n`;
    cart.forEach(i => msg += `${i.name} x${i.qty} — $${(i.price*i.qty).toFixed(2)}\n`);
    msg += `Propina: $${tipAmount.toFixed(2)}\nTotal: $${total.toFixed(2)}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  });

  // Propina
  document.getElementById('cart-tip-btn').addEventListener('click', () => tipModal.classList.add('show'));
  document.getElementById('tip-close-btn').addEventListener('click', () => tipModal.classList.remove('show'));

  // Tip buttons
  document.querySelectorAll('.tip-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      tipAmount = parseFloat(e.target.dataset.tip);
      tipSelectedEl.innerText = `Propina seleccionada: $${tipAmount.toFixed(2)}`;
    });
  });

  // Tip custom
  document.getElementById('tip-custom').addEventListener('input', e => {
    tipAmount = parseFloat(e.target.value) || 0;
    tipSelectedEl.innerText = `Propina seleccionada: $${tipAmount.toFixed(2)}`;
  });

  // Add tip to total
  document.getElementById('add-tip-btn').addEventListener('click', () => {
    calcTotals();
    tipModal.classList.remove('show');
  });

  renderCart();
});
