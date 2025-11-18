
    const client = localStorage.getItem("userRole");
    if (client !== "cliente") window.location.href = "index3.html";

    function logout() {
      localStorage.clear();
      window.location.href = "index.html";
    }


//pedido
     function actualizarEstado() {
      const etapas = document.querySelectorAll(".etapa");
      const activo = document.querySelector(".etapa.activo");
      let index = Array.from(etapas).indexOf(activo);

      if (index < etapas.length - 1) {
        activo.classList.remove("activo");
        activo.classList.add("completado");
        etapas[index + 1].classList.add("activo");
      } else {
        alert("El pedido ya fue entregado 🏠");
      }
    }

    function logout() {
      alert("Sesión cerrada correctamente");
      window.location.href = "/index3.html";
    }



  