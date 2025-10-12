const promoBtn = document.querySelector(".btn-promo");
const modal = document.getElementById("promoModal");
const closeBtn = document.querySelector(".close");

promoBtn.addEventListener("click", (e) => {
  e.preventDefault(); // evita que redireccione
  modal.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

document.getElementById("promoForm").addEventListener("submit", (e) => {
  e.preventDefault();
  alert("¡Tu cita ha sido agendada con éxito!");
  modal.style.display = "none";
});