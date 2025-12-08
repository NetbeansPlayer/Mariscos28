/* ============================================================
   ESTADO GLOBAL
============================================================ */
let appState = {
  monederoSaldo: 350.00
};

/* ============================================================
   UTILIDADES
============================================================ */
function fmtMoney(n){
  return "$" + Number(n).toLocaleString("es-MX", {
    minimumFractionDigits:2,
    maximumFractionDigits:2
  });
}

function randRef(prefix="REF"){
  return prefix + "-" + Math.floor(Math.random()*900000 + 100000);
}

/* ============================================================
   ELEMENTOS COMUNES DEL MODAL
============================================================ */
const overlay = document.getElementById("overlay");
const modalTitle = document.getElementById("modal-title");
const modalSub = document.getElementById("modal-sub");
const leftSaldo = document.getElementById("left-saldo");
const leftMethodLabel = document.getElementById("left-method-label");
const stepsList = document.getElementById("steps-list");
const formArea = document.getElementById("form-area");

/* ============================================================
   ABRIR / CERRAR MODAL
============================================================ */
function openModal(method){
  overlay.classList.add("show");
  overlay.setAttribute("aria-hidden", "false");

  const config = {
    tarjeta: ["Tarjeta de Crédito / Débito", "Paga ahora con tu tarjeta"],
    oxxo:    ["OXXO / Spin By OXXO", "Generamos una referencia"],
    efectivo:["Pago en Efectivo", "Código para tienda participante"],
    transferencia:["Transferencia Bancaria", "Envía desde tu banco"],
    deposito:["Depósito Bancario", "Acude al banco o cajero"],
    pagoEnLinea:["Pago en Línea", "Pasarela de pago"],
    monedero:["Monedero Electrónico", "Paga con tu saldo"],
    cajero:["Pago en Cajero Automático", "Deposita en cajero"]
  };

  modalTitle.innerText = config[method][0];
  modalSub.innerText   = config[method][1];
  leftMethodLabel.innerText = modalTitle.innerText;
  leftSaldo.innerText = (method === "monedero") ? fmtMoney(appState.monederoSaldo) : "";

  const steps = {
    tarjeta: ["Ingresa datos", "Confirma", "Pago exitoso"],
    oxxo: ["Generamos referencia", "Paga en OXXO", "Confirmación automática"],
    efectivo: ["Genera código", "Paga en tienda", "Confirmación"],
    transferencia: ["Realiza transferencia", "Sube comprobante", "Validación"],
    deposito: ["Deposita", "Sube ticket opcional", "Confirmación"],
    pagoEnLinea: ["Redirección", "Confirmación", "Regreso seguro"],
    monedero: ["Ingresa monto", "Confirma PIN", "Descuento automático"],
    cajero: ["Generamos referencia", "Deposita", "Confirma el pago"]
  };

  renderSteps(steps[method]);

  const forms = {
    tarjeta: renderTarjetaForm,
    oxxo: renderOxxoForm,
    efectivo: renderEfectivoForm,
    transferencia: renderTransferForm,
    deposito: renderDepositoForm,
    pagoEnLinea: renderPagoEnLineaForm,
    monedero: renderMonederoForm,
    cajero: renderCajeroForm,
  };

  forms[method]();
}

function closeModal(){
  overlay.classList.remove("show");
  overlay.setAttribute("aria-hidden","true");
  formArea.innerHTML = "";
  stepsList.innerHTML = "<li>Selecciona una opción</li>";
  leftSaldo.innerText = "";
}

function renderSteps(list){
  stepsList.innerHTML = "";
  list.forEach(t=>{
    const li = document.createElement("li");
    li.innerText = t;
    stepsList.appendChild(li);
  });
}

/* ============================================================
   FORMULARIOS DE PAGO
============================================================ */
function renderTarjetaForm(){
  formArea.innerHTML = `
    <h3>Datos de tarjeta</h3>
    <label>Número</label>
    <input id="tarjeta-num" maxlength="19">
    <div style="display:flex; gap:10px;">
      <input id="tarjeta-exp" type="month">
      <input id="tarjeta-cvv" maxlength="4" placeholder="CVV">
    </div>
    <div style="display:flex; gap:8px; margin-top:12px;">
      <button class="btn-ghost" onclick="closeModal()">Cancelar</button>
      <button class="confirm-btn" onclick="confirmTarjeta()">Pagar</button>
    </div>
  `;
}

function renderOxxoForm(){
  const ref = randRef("OXX");
  formArea.innerHTML = `
    <h3>Referencia OXXO</h3>
    <div class="ref-box">${ref}</div>
    <button class="confirm-btn" onclick="confirmOxxo('${ref}')">Marcar como pagado</button>
  `;
}

function renderEfectivoForm(){
  const code = randRef("EF");
  formArea.innerHTML = `
    <h3>Código de pago</h3>
    <div class="ref-box">${code}</div>
    <button class="confirm-btn" onclick="confirmEfectivo('${code}')">Confirmar</button>
  `;
}

function renderTransferForm(){
  const ref = randRef("TRF");
  formArea.innerHTML = `
    <h3>Transferencia</h3>
    <div class="ref-box"><b>CLABE:</b> 123456789012345678<br><b>Ref:</b> ${ref}</div>
    <input type="file" id="file-trf">
    <button class="confirm-btn" onclick="confirmTransfer('${ref}')">He transferido</button>
  `;
}

function renderDepositoForm(){
  const ref = randRef("DEP");
  formArea.innerHTML = `
    <h3>Depósito Bancario</h3>
    <div class="ref-box"><b>Cuenta:</b> 9876543210<br><b>Ref:</b> ${ref}</div>
    <input type="file" id="file-dep">
    <button class="confirm-btn" onclick="confirmDeposito('${ref}')">Confirmar depósito</button>
  `;
}

function renderPagoEnLineaForm(){
  const ref = randRef("PL");
  formArea.innerHTML = `
    <h3>Pasarela de Pago</h3>
    <div class="ref-box">Referencia: ${ref}</div>
    <button class="confirm-btn" onclick="confirmPagoEnLinea('${ref}')">Pagar en línea</button>
  `;
}

function renderMonederoForm(){
  formArea.innerHTML = `
    <h3>Monedero Electrónico</h3>
    <label>Monto</label>
    <input id="monto-monedero-prem" type="number">
    <label>PIN</label>
    <input id="pin-monedero" type="password">
    <button class="confirm-btn" onclick="confirmMonedero()">Pagar con monedero</button>
  `;
}

function renderCajeroForm(){
  const ref = randRef("CAJ");
  formArea.innerHTML = `
    <h3>Pago en Cajero</h3>
    <div class="ref-box"><b>Cuenta:</b> 4455667788<br><b>Ref:</b> ${ref}</div>
    <button class="confirm-btn" onclick="confirmCajero('${ref}')">Confirmar</button>
  `;
}

/* ============================================================
   CONFIRMACIONES Y REDIRECCIÓN
============================================================ */
function showSuccess(msg, metodo){
  formArea.innerHTML = `
    <h3 class="success">✔ ${msg}</h3>
    <p>Se generó comprobante.</p>
    <button class="confirm-btn" onclick="generarComprobante()">Descargar comprobante</button>
    <button class="btn-ghost" onclick="closeModal()">Cerrar</button>
  `;

  setTimeout(()=>irAConfirmacion(metodo), 1200);
}

/* Funciones de confirmación */
function confirmTarjeta(){ const cvv = document.getElementById("tarjeta-cvv").value; if(cvv.length<3) return alert("CVV inválido"); showSuccess("Pago con tarjeta exitoso","Tarjeta"); }
function confirmOxxo(r){ showSuccess("Referencia OXXO pagada: "+r,"OXXO"); }
function confirmEfectivo(c){ showSuccess("Pago en efectivo confirmado: "+c,"Efectivo"); }
function confirmTransfer(r){ showSuccess("Transferencia registrada: "+r,"Transferencia"); }
function confirmDeposito(r){ showSuccess("Depósito confirmado: "+r,"Depósito"); }
function confirmPagoEnLinea(r){ showSuccess("Pago en línea exitoso: "+r,"PagoEnLinea"); }
function confirmMonedero(){
  const monto = parseFloat(document.getElementById("monto-monedero-prem").value || 0);
  if(monto>appState.monederoSaldo) return alert("Saldo insuficiente");
  appState.monederoSaldo-=monto;
  showSuccess("Pago con monedero realizado","Monedero");
}
function confirmCajero(r){ showSuccess("Pago en cajero confirmado: "+r,"Cajero"); }

/* ============================================================
   GENERAR COMPROBANTE Y REDIRECCION
============================================================ */
function generarComprobante(){
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const total = cart.reduce((sum,i)=>sum+i.price*i.qty,0);

  // Guardar orden para confirmación/factura
  const orden = cart.map(i=>({nombre:i.name,cantidad:i.qty,total:i.price*i.qty}));
  localStorage.setItem("orden_actual", JSON.stringify(orden));

  const id = "PED-" + Date.now();
  localStorage.setItem("pedido_id", id);

  const ticketContent = document.createElement("div");
  ticketContent.innerHTML = `
    <h3>Comprobante de pago</h3>
    <p>Orden: ${id}</p>
    <p>Fecha: ${new Date().toLocaleString()}</p>
    <p>Total: $${total.toFixed(2)}</p>
    <ul>${cart.map(i=>`<li>${i.name} x${i.qty} — $${(i.price*i.qty).toFixed(2)}</li>`).join("")}</ul>
  `;

  const blob = new Blob([ticketContent.innerHTML],{type:"text/html"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `comprobante_${id}.html`;
  a.click();
}

/* ============================================================
   REDIRECCIÓN A CONFIRMACION.HTML
============================================================ */
function irAConfirmacion(metodo){
  window.location.href = `../views/confirmacion.html?metodo=${metodo}`;
}

/* ============================================================
   INICIALIZACIÓN
============================================================ */
document.addEventListener("DOMContentLoaded",()=>{
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const total = cart.reduce((sum,i)=>sum+i.price*i.qty,0);

  document.getElementById("tarjeta-monto").innerText = fmtMoney(total);
  document.getElementById("Oxxo-monto").innerText    = fmtMoney(total);
  document.getElementById("monto-efectivo").innerText = fmtMoney(total);
  document.getElementById("transfer-monto").innerText = fmtMoney(total);
  document.getElementById("deposito-monto").innerText = fmtMoney(total);
  document.getElementById("linea-monto").innerText    = fmtMoney(total);
  document.getElementById("monedero-monto").innerText = fmtMoney(total);
  document.getElementById("cajero-monto").innerText   = fmtMoney(total);

  document.addEventListener("DOMContentLoaded", () => {
  const total = parseFloat(localStorage.getItem('cart_total')) || 0;

  const ids = ["tarjeta-monto","Oxxo-monto","monto-efectivo","transfer-monto",
               "deposito-monto","linea-monto","monedero-monto","cajero-monto"];

  ids.forEach(id => {
    const el = document.getElementById(id);
    if(el) el.innerText = `$${total.toFixed(2)}`;
  });
});

});
