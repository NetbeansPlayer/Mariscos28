document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reservaForm");
  const confirmacion = document.getElementById("confirmacion");
  const nuevaReserva = document.getElementById("nuevaReserva");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Validación simple
    const nombre = document.getElementById("nombre").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const personas = document.getElementById("personas").value;
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;

    if (!nombre || !telefono || !personas || !fecha || !hora) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    // Mostrar confirmación simulada
    form.classList.add("oculto");
    confirmacion.classList.remove("oculto");
  });

  nuevaReserva.addEventListener("click", () => {
    confirmacion.classList.add("oculto");
    form.reset();
    form.classList.remove("oculto");
  });
});
