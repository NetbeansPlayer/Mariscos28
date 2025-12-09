// assets/js/confirmacion.js
document.addEventListener("DOMContentLoaded", () => {
  const pedidoId = localStorage.getItem("pedido_id") || "PED-000";
  const orden = JSON.parse(localStorage.getItem("orden_actual")) || [];
  const total = parseFloat(localStorage.getItem("cart_total") || "0.00");
  const facturaWrapper = JSON.parse(localStorage.getItem("facturaData") || "{}");

  // Mostrar en la UI
  document.getElementById("pedido-id").textContent = pedidoId;
  document.getElementById("metodo-selected").textContent = (facturaWrapper.pago || "No especificado");
  document.getElementById("gracias").textContent = `Hemos recibido tu pago. Total: $${total.toFixed(2)}`;

  const ul = document.getElementById("items-list");
  ul.innerHTML = "";
  if (orden.length === 0) {
    ul.innerHTML = "<li>No hay productos registrados</li>";
  } else {
    orden.forEach(it => {
      const li = document.createElement("li");
      li.textContent = `${it.nombre} x${it.cantidad} — $${it.total.toFixed(2)}`;
      ul.appendChild(li);
    });
  }
  document.getElementById("total-amount").textContent = `$${total.toFixed(2)}`;

  // Descargar factura (PDF)
  document.getElementById("btn-factura").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    let y = 40;
    doc.setFontSize(18);
    doc.text("Factura / Comprobante - Mariscos 28", 40, y);
    y += 30;

    doc.setFontSize(12);
    doc.text(`Folio: ${pedidoId}`, 40, y); y += 18;
    doc.text(`Fecha: ${new Date().toLocaleString()}`, 40, y); y += 18;
    doc.text(`Método de pago: ${facturaWrapper.pago || 'No especificado'}`, 40, y); y += 24;

    // Datos fiscales si existen y si pago fue tarjeta
    if (facturaWrapper.pago === "tarjeta" && facturaWrapper.datos && Object.keys(facturaWrapper.datos).length) {
      const d = facturaWrapper.datos;
      doc.setFontSize(14);
      doc.text("Datos Fiscales:", 40, y); y += 18;
      doc.setFontSize(12);
      doc.text(`RFC: ${d.rfc}`, 40, y); y += 14;
      doc.text(`Razón social: ${d.nombre}`, 40, y); y += 14;
      if (d.direccion) { doc.text(`Dirección: ${d.direccion}`, 40, y); y += 14; }
      doc.text(`CP: ${d.cp}`, 40, y); y += 14;
      doc.text(`Régimen: ${d.regimen}`, 40, y); y += 14;
      doc.text(`Uso CFDI: ${d.uso}`, 40, y); y += 20;
    }

    doc.setFontSize(13);
    doc.text("Productos:", 40, y); y += 18;
    doc.setFontSize(11);

    // encabezado tabla
    doc.text("Producto", 40, y); doc.text("Cant.", 320, y); doc.text("Total", 420, y, { align: "right" }); y += 12;
    doc.setLineWidth(0.5); doc.line(40, y, 560, y); y += 12;

    orden.forEach(it => {
      doc.text(it.nombre, 40, y);
      doc.text(String(it.cantidad), 320, y);
      doc.text(`$${it.total.toFixed(2)}`, 420, y, { align: "right" });
      y += 16;
      // salto de página si se llena
      if (y > 720) { doc.addPage(); y = 40; }
    });

    y += 10;
    doc.setLineWidth(0.5); doc.line(40, y, 560, y); y += 16;
    doc.setFontSize(13); doc.text(`TOTAL: $${total.toFixed(2)}`, 420, y, { align: "right" });

    // guardar
    doc.save(`Factura_${pedidoId}.pdf`);
  });
});
