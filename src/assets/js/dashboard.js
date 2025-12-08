function showSection(sectionId) {
  const sections = document.querySelectorAll('.section');

  sections.forEach(sec => sec.classList.remove('active'));

  document.getElementById(sectionId).classList.add('active');
}

/* ======================
   GRAFICA
====================== */
const ctx = document.getElementById('salesChart');

if (ctx) {
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      datasets: [{
        label: 'Ventas ($ MXN)',
        data: [2000, 2500, 3000, 2800, 3500, 4000, 3800],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true
    }
  });
}
