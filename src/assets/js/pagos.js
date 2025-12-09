// ../assets/js/pagos.js
// Controla el modal de métodos y el flujo de pago + factura (simulado)

(function () {
  // utilidades
  function fmtMoney(n) {
    return "$" + Number(n).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function randRef(prefix = "REF") {
    return prefix + "-" + Math.floor(Math.random() * 900000 + 100000);
  }

  // elementos
  const overlay = document.getElementById("overlay");
  const modalTitle = document.getElementById("modal-title");
  const modalSub = document.getElementById("modal-sub");
  const leftSaldo = document.getElementById("left-saldo");
  const leftMethodLabel = document.getElementById("left-method-label");
  const stepsList = document.getElementById("steps-list");
  const formArea = document.getElementById("form-area");

  // estado
  let appState = { monederoSaldo: 350.00 };
  // total: preferimos usar cart_total almacenado por carrito.js
  function readTotal() {
    const fromLS = parseFloat(localStorage.getItem("cart_total"));
    if (!isNaN(fromLS) && fromLS > 0) return fromLS;
    // fallback compute from cart
    try {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      return cart.reduce((s, i) => s + (i.price * (i.qty || 1)), 0) * 1.16; // assume IVA
    } catch {
      return 0;
    }
  }

  // inicializa montos en tarjetas
  function populateAmounts() {
    const total = readTotal();
    const ids = ["tarjeta-monto","Oxxo-monto","monto-efectivo","transfer-monto","deposito-monto","linea-monto","monedero-monto","cajero-monto"];
    ids.forEach(id => { const el = document.getElementById(id); if (el) el.innerText = fmtMoney(total); });
  }

  // abrir / cerrar modal
  window.openModal = function (method) {
    // safety if overlay missing
    if (!overlay) return;

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
    modalSub.innerText = config[method][1];
    leftMethodLabel.innerText = modalTitle.innerText;
    leftSaldo.innerText = (method === "monedero") ? fmtMoney(appState.monederoSaldo) : "";

    const steps = {
      tarjeta: ["Ingresa datos", "Revisa factura (opcional)", "Pago exitoso"],
      oxxo: ["Generamos referencia", "Paga en OXXO", "Confirmación automática"],
      efectivo: ["Genera código", "Paga en tienda", "Confirmación"],
      transferencia: ["Realiza transferencia", "Sube comprobante", "Validación"],
      deposito: ["Deposita", "Sube ticket opcional", "Confirmación"],
      pagoEnLinea: ["Redirección", "Confirmación", "Regreso seguro"],
      monedero: ["Ingresa monto", "Confirma PIN", "Descuento automático"],
      cajero: ["Generamos referencia", "Deposita", "Confirma el pago"]
    };
    renderSteps(steps[method]);

    // render form
    const forms = {
      tarjeta: renderTarjetaForm,
      oxxo: renderOxxoForm,
      efectivo: renderEfectivoForm,
      transferencia: renderTransferForm,
      deposito: renderDepositoForm,
      pagoEnLinea: renderPagoEnLineaForm,
      monedero: renderMonederoForm,
      cajero: renderCajeroForm
    };
    forms[method]();
  };

  window.closeModal = function () {
    if (!overlay) return;
    overlay.classList.remove("show");
    overlay.setAttribute("aria-hidden", "true");
    formArea.innerHTML = "";
    stepsList.innerHTML = "<li>Selecciona una opción</li>";
    leftSaldo.innerText = "";
  };

  function renderSteps(list) {
    stepsList.innerHTML = "";
    list.forEach(t => {
      const li = document.createElement("li");
      li.innerText = t;
      stepsList.appendChild(li);
    });
  }

  /* ========= FORMULARIOS ========= */

  function renderTarjetaForm() {
    const total = readTotal();
    formArea.innerHTML = `
      <h3>Datos de tarjeta</h3>
      <label>Número</label>
      <input id="tarjeta-num" maxlength="19" placeholder="1234 5678 9012 3456">
      <div style="display:flex; gap:10px; margin-top:8px;">
        <input id="tarjeta-exp" type="month">
        <input id="tarjeta-cvv" maxlength="4" placeholder="CVV">
      </div>

      <div style="margin-top:10px;">
        <label><input type="checkbox" id="chk-factura"> Deseo factura</label>
      </div>

      <div id="factura-fields" style="display:none; margin-top:10px; border-left:3px solid #eee; padding-left:10px;">
        <label>RFC</label>
        <input type="text" id="input-rfc" placeholder="XAXX010101000">
        <label>Nombre / Razón Social</label>
        <input type="text" id="input-nombre" placeholder="Nombre o empresa">
        <label>Código Postal</label>
        <input type="text" id="input-cp" maxlength="5" placeholder="12345">
        <label>Régimen Fiscal</label>
        <select id="input-regimen">
          <option value="">Seleccione...</option>
          <option value="601">601 – General de Ley Personas Morales</option>
          <option value="605">605 – Sueldos y Salarios</option>
          <option value="612">612 – Personas Físicas con Actividades Empresariales</option>
          <option value="626">626 – Régimen Simplificado de Confianza</option>
        </select>
        <label>Uso de CFDI</label>
        <select id="input-uso">
          <option value="">Seleccione...</option>
          <option value="G01">G01 – Adquisición de mercancías</option>
          <option value="G03">G03 – Gastos en general</option>
          <option value="P01">P01 – Por definir</option>
        </select>
        <p id="rfc-error" style="color:red;display:none;margin-top:6px;">Verifica los datos fiscales.</p>
      </div>

      <div style="display:flex; gap:8px; margin-top:12px;">
        <button class="btn-ghost" onclick="closeModal()">Cancelar</button>
        <button class="confirm-btn" id="btn-pagar-tarjeta">Pagar ${fmtMoney(total)}</button>
      </div>
    `;

    // toggles
    const chk = document.getElementById("chk-factura");
    chk.addEventListener("change", (e) => {
      document.getElementById("factura-fields").style.display = e.target.checked ? "block" : "none";
    });

    document.getElementById("btn-pagar-tarjeta").addEventListener("click", () => {
      handleConfirmTarjeta();
    });
  }

  function renderOxxoForm() {
    const ref = randRef("OXX");
    formArea.innerHTML = `
      <h3>Referencia OXXO</h3>
      <div class="ref-box">${ref}</div>
      <p class="small-muted">Lleva esta referencia a tu OXXO o usa Spin para pagar.</p>
      <div style="margin-top:12px;">
        <button class="btn-ghost" onclick="closeModal()">Cerrar</button>
        <button class="confirm-btn" id="btn-oxxo">He pagado (simulado)</button>
      </div>
    `;
    document.getElementById("btn-oxxo").addEventListener("click", () => {
      generarComprobanteLocal("OXXO", ref);
      showSuccessThenRedirect("Pago con OXXO registrado", "OXXO");
    });
  }

  function renderEfectivoForm() {
    const code = randRef("EF");
    formArea.innerHTML = `
      <h3>Código de pago (Efectivo)</h3>
      <div class="ref-box">${code}</div>
      <div style="margin-top:12px;">
        <button class="btn-ghost" onclick="closeModal()">Cerrar</button>
        <button class="confirm-btn" id="btn-efectivo">Confirmar (simulado)</button>
      </div>
    `;
    document.getElementById("btn-efectivo").addEventListener("click", () => {
      generarComprobanteLocal("Efectivo", code);
      showSuccessThenRedirect("Pago en efectivo registrado", "Efectivo");
    });
  }

  function renderTransferForm() {
    const ref = randRef("TRF");
    formArea.innerHTML = `
      <h3>Transferencia</h3>
      <div class="ref-box"><b>CLABE:</b> 123456789012345678<br><b>Ref:</b> ${ref}</div>
      <label style="margin-top:8px">Subir comprobante (simulado)</label>
      <input type="file" id="file-trf">
      <div style="margin-top:12px;">
        <button class="btn-ghost" onclick="closeModal()">Cerrar</button>
        <button class="confirm-btn" id="btn-trf">He transferido (simulado)</button>
      </div>
    `;
    document.getElementById("btn-trf").addEventListener("click", () => {
      generarComprobanteLocal("Transferencia", ref);
      showSuccessThenRedirect("Transferencia registrada", "Transferencia");
    });
  }

  function renderDepositoForm() {
    const ref = randRef("DEP");
    formArea.innerHTML = `
      <h3>Depósito Bancario</h3>
      <div class="ref-box"><b>Cuenta:</b> 9876543210<br><b>Ref:</b> ${ref}</div>
      <div style="margin-top:12px;">
        <button class="btn-ghost" onclick="closeModal()">Cerrar</button>
        <button class="confirm-btn" id="btn-dep">Confirmar depósito (simulado)</button>
      </div>
    `;
    document.getElementById("btn-dep").addEventListener("click", () => {
      generarComprobanteLocal("Deposito", ref);
      showSuccessThenRedirect("Depósito registrado", "Deposito");
    });
  }

  function renderPagoEnLineaForm() {
    const ref = randRef("PL");
    formArea.innerHTML = `
      <h3>Pago en línea</h3>
      <div class="ref-box">Referencia: ${ref}</div>
      <div style="margin-top:12px;">
        <button class="btn-ghost" onclick="closeModal()">Cerrar</button>
        <button class="confirm-btn" id="btn-pl">Pagar en línea (simulado)</button>
      </div>
    `;
    document.getElementById("btn-pl").addEventListener("click", () => {
      generarComprobanteLocal("PagoEnLinea", ref);
      showSuccessThenRedirect("Pago en línea exitoso", "PagoEnLinea");
    });
  }

  function renderMonederoForm() {
    formArea.innerHTML = `
      <h3>Monedero Electrónico</h3>
      <label>Monto</label>
      <input id="monto-monedero" type="number" placeholder="0.00">
      <label>PIN</label>
      <input id="pin-monedero" type="password">
      <div style="margin-top:12px;">
        <button class="btn-ghost" onclick="closeModal()">Cerrar</button>
        <button class="confirm-btn" id="btn-mon">Pagar con monedero</button>
      </div>
    `;
    document.getElementById("btn-mon").addEventListener("click", () => {
      // simple check
      const monto = parseFloat(document.getElementById("monto-monedero").value || 0);
      if (monto <= 0 || monto > appState.monederoSaldo) return alert("Monto inválido o saldo insuficiente");
      appState.monederoSaldo -= monto;
      generarComprobanteLocal("Monedero", "MON-" + Date.now());
      showSuccessThenRedirect("Pago con monedero realizado", "Monedero");
    });
  }

  function renderCajeroForm() {
    const ref = randRef("CAJ");
    formArea.innerHTML = `
      <h3>Pago en Cajero</h3>
      <div class="ref-box"><b>Cuenta:</b> 4455667788<br><b>Ref:</b> ${ref}</div>
      <div style="margin-top:12px;">
        <button class="btn-ghost" onclick="closeModal()">Cerrar</button>
        <button class="confirm-btn" id="btn-caj">Confirmar</button>
      </div>
    `;
    document.getElementById("btn-caj").addEventListener("click", () => {
      generarComprobanteLocal("Cajero", ref);
      showSuccessThenRedirect("Pago en cajero confirmado", "Cajero");
    });
  }

  /* ========= FLUJO TARJETA (con RFC opcional) ========= */

  function validarRFC(rfc) {
    const regex = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;
    return regex.test(String(rfc).toUpperCase());
  }

  function handleConfirmTarjeta() {
    // si se pidió factura, validar campos y guardar datos
    const wantsFactura = document.getElementById("chk-factura")?.checked;
    const tarjetaCvv = document.getElementById("tarjeta-cvv") ? document.getElementById("tarjeta-cvv").value : null;
    // Basic card cvv check omitted if not present
    if (wantsFactura) {
      const rfc = (document.getElementById("input-rfc")?.value || "").trim();
      const nombre = (document.getElementById("input-nombre")?.value || "").trim();
      const cp = (document.getElementById("input-cp")?.value || "").trim();
      const regimen = (document.getElementById("input-regimen")?.value || "");
      const uso = (document.getElementById("input-uso")?.value || "");

      if (!validarRFC(rfc) || !nombre || cp.length !== 5 || !regimen || !uso) {
        document.getElementById("rfc-error").style.display = "block";
        return;
      }

      const datosFiscales = { rfc, nombre, cp, regimen, uso };
      generarComprobanteLocal("Tarjeta", "TAR-" + Date.now(), datosFiscales);
      showSuccessThenRedirect("Pago con tarjeta exitoso", "Tarjeta", datosFiscales);
    } else {
      generarComprobanteLocal("Tarjeta", "TAR-" + Date.now(), null);
      showSuccessThenRedirect("Pago con tarjeta exitoso", "Tarjeta", null);
    }
  }

  /* ========= GENERAR COMPROBANTE LOCAL Y REDIRECT ========= */
  function generarComprobanteLocal(metodo, referencia, datosFiscales = null) {
    // crea orden desde cart guardado en localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const orden = cart.map(i => ({ nombre: i.name, cantidad: i.qty || 1, total: (i.price * (i.qty || 1)) }));
    localStorage.setItem("orden_actual", JSON.stringify(orden));
    const id = "PED-" + Date.now();
    localStorage.setItem("pedido_id", id);

    // guardar cart_total si no existe
    const total = localStorage.getItem("cart_total") || (readTotal().toFixed ? readTotal().toFixed(2) : "0.00");
    localStorage.setItem("cart_total", total);
    // guardar referencia y método
    localStorage.setItem("pedido_metodo", metodo);
    localStorage.setItem("pedido_ref", referencia);

    // si vienen datos fiscales los guardamos también en localStorage para confirmacion
    if (datosFiscales) {
      localStorage.setItem("datos_fiscales", JSON.stringify(datosFiscales));
    } else {
      localStorage.removeItem("datos_fiscales");
    }
  }

  function showSuccessThenRedirect(msg, metodo, datosFiscales) {
    formArea.innerHTML = `
      <h3 class="success">✔ ${msg}</h3>
      <p>Se generó el comprobante localmente.</p>
      <div style="margin-top:10px;">
        <button class="confirm-btn" id="btn-descargar-comprobante">Descargar comprobante</button>
        <button class="btn-ghost" onclick="closeModal()">Cerrar</button>
      </div>
    `;

    document.getElementById("btn-descargar-comprobante").addEventListener("click", () => {
      // descargar comprobante html simple
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const id = localStorage.getItem("pedido_id");
      const total = localStorage.getItem("cart_total") || readTotal().toFixed(2);
      const html = `
        <h3>Comprobante de pago</h3>
        <p>Orden: ${id}</p>
        <p>Método: ${metodo}</p>
        <p>Referencia: ${localStorage.getItem("pedido_ref") || ""}</p>
        <p>Fecha: ${new Date().toLocaleString()}</p>
        <p>Total: $${parseFloat(total).toFixed(2)}</p>
        <ul>${cart.map(i=>`<li>${i.name} x${i.qty} — $${(i.price*i.qty).toFixed(2)}</li>`).join("")}</ul>
      `;
      const blob = new Blob([html], { type: "text/html" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `comprobante_${localStorage.getItem("pedido_id")}.html`;
      a.click();
    });

    // redirigir en 1.2s a confirmacion.html (pasa metodo por query)
    setTimeout(() => {
      const pedido = localStorage.getItem("pedido_id");
      const params = new URLSearchParams({ pedido, metodo });
      // si hay datos fiscales también los adjuntamos (encoded)
      if (datosFiscales) params.set("datos", encodeURIComponent(JSON.stringify(datosFiscales)));
      window.location.href = `confirmacion.html?${params.toString()}`;
    }, 1200);
  }

  // inicialización
  document.addEventListener("DOMContentLoaded", () => {
    populateAmounts();
    // si existe un botón para "Ver métodos" lo abre
    const btn = document.getElementById("btn-abrir");
    if (btn) btn.addEventListener("click", () => {
      // abrir modal con opciones generales
      if (overlay) openModal("tarjeta"); // abrir tarjeta por defecto o puedes abrir lista
    });
  });

})();
