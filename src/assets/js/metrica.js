const ctx = document.getElementById('salesChart');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      datasets: [{
        label: 'Pedidos',
        data: [60, 75, 80, 90, 120, 150, 130],
        backgroundColor: '#003366'
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });