document.addEventListener("DOMContentLoaded", () => {
  const { jsPDF } = window.jspdf;

  const orden = JSON.parse(localStorage.getItem("orden_actual")) || [];
  const pedidoId = localStorage.getItem("pedido_id") || "PED-" + Date.now();
  const total = parseFloat(localStorage.getItem('cart_total')) || orden.reduce((s,i)=>s+i.total,0);
  const metodo = new URLSearchParams(window.location.search).get("metodo") || "No especificado";

  const ul = document.getElementById("ticket-items");
  const totalEl = document.getElementById("total-ticket");
  document.getElementById("pedido-id").innerText = pedidoId;

  if(orden.length===0) ul.innerHTML="<li>No hay productos en la orden</li>";
  else orden.forEach(i => {
    const li = document.createElement("li");
    li.textContent = `${i.nombre} x${i.cantidad} — $${i.total.toFixed(2)}`;
    ul.appendChild(li);
  });

  totalEl.innerText = `$${total.toFixed(2)}`;

  document.getElementById("btn-factura").onclick = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Factura Pedido ${pedidoId}`, 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Método de pago: ${metodo}`, 14, 30);
    doc.text(`Fecha: ${new Date().toLocaleString()}`, 14, 37);
    let y=50;
    doc.text("Producto", 14, y);
    doc.text("Cantidad", 100, y);
    doc.text("Total", 160, y);
    y+=5;
    doc.setLineWidth(0.5); doc.line(14,y,200,y); y+=5;
    orden.forEach(i=>{
      doc.text(i.nombre,14,y);
      doc.text(i.cantidad.toString(),100,y,{align:"center"});
      doc.text("$"+i.total.toFixed(2),160,y,{align:"right"});
      y+=8;
    });
    doc.line(14,y,200,y); y+=8;
    doc.setFontSize(14);
    doc.text("TOTAL: $"+total.toFixed(2),160,y,{align:"right"});
    doc.save(`Factura_${pedidoId}.pdf`);
  };
});
