document.addEventListener('DOMContentLoaded', function() {
  const carrusel = document.querySelector('.carousel');
  const imagenes = carrusel.querySelectorAll('img');
  const prevBtn = carrusel.querySelector('.prev');
  const nextBtn = carrusel.querySelector('.next');
  let indiceActual = 0;
  
  // Función para mostrar imagen actual
  function mostrarImagen(indice) {
    // Ocultar todas las imágenes
    imagenes.forEach(img => img.classList.remove('active'));
    
    // Mostrar imagen actual
    imagenes[indice].classList.add('active');
  }
  
  // Siguiente imagen
  function siguienteImagen() {
    indiceActual = (indiceActual + 1) % imagenes.length;
    mostrarImagen(indiceActual);
  }
  
  // Imagen anterior
  function imagenAnterior() {
    indiceActual = (indiceActual - 1 + imagenes.length) % imagenes.length;
    mostrarImagen(indiceActual);
  }
  
  // Event listeners
  nextBtn.addEventListener('click', siguienteImagen);
  prevBtn.addEventListener('click', imagenAnterior);
  
  // Cambio automático cada 5 segundos
  setInterval(siguienteImagen, 5000);
  
  // Mostrar primera imagen
  mostrarImagen(0);
});