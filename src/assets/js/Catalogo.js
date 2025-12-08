document.addEventListener('DOMContentLoaded', function () {
    cargarMenu();
});

// Carrito (solo se usa en este archivo si quieres logs, pero el carrito real está en carrito.js)
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// TODOS LOS PRODUCTOS EMBEBIDOS
const productos = [
    { "id": 1, "name": "Filete al ajillo (con gratin)", "price": 180.00, "category": "platos-fuertes", "image": "../assets/img/p1.jpg", "description": "Fielte de pescado al ajillo, acompañado con ensalada y arroz, con queso derretido encima" },
    { "id": 2, "name": "Shot de Camaron", "price": 220.00, "category": "entradas", "image": "../assets/img/Shot_C.jpg", "description": "Caballito escarchado con chamoy, camaron cocido, jugo de limon y salsa casera especial" },
    { "id": 3, "name": "Cóctel de Camarón", "price": 120.00, "category": "entradas", "image": "../assets/img/cock.jpg", "description": "Cóctel refrescante de camarón con salsa cátsup, limón, cebolla, cilantro y aguacate." },
    { "id": 4, "name": "Filete de Pescado Empapelado", "price": 190.00, "category": "platos-fuertes", "image": "../assets/img/p4.jpg", "description": "Filete de robalo cocido al papillote con verduras, hierbas finas y vino blanco." },
    { "id": 5, "name": "Mariscada para 2 Personas", "price": 450.00, "category": "especialidades", "image": "../assets/img/Imagen de WhatsApp 2025-09-18 a las 15.58.36_8cc979a3.jpg", "description": "Surtido de mariscos incluyendo langosta, camarones, pulpo, almejas y callo de hacha." },
    { "id": 6, "name": "Camarones Momia", "price": 85.00, "category": "entradas", "image": "../assets/img/CM.jpg", "description": "Camarones envueltos en tocino y rellenos de queso con pimiento." },
    { "id": 7, "name": "Arroz a la Tumbada", "price": 160.00, "category": "platos-fuertes", "image": "../assets/img/Tumbada.webp", "description": "Arroz caldoso con mezcla de mariscos estilo veracruzano." },
    { "id": 8, "name": "Postre de Mango con Maracuyá", "price": 75.00, "category": "postres", "image": "../assets/img/mm.webp", "description": "Postre de mango con coulis de maracuyá." },
    { "id": 9, "name": "Aguachile de Camarón", "price": 150.00, "category": "entradas", "image": "../assets/img/p1.jpg", "description": "Aguachile estilo Sinaloa con camarones y chile serrano." },
    { "id": 10, "name": "Ostiones Rockefeller", "price": 140.00, "category": "entradas", "image": "../assets/img/Rock.webp", "description": "Ostiones gratinados con espinacas y parmesano." },
    { "id": 11, "name": "Camarones empanizados", "price": 280.00, "category": "platos-fuertes", "image": "../assets/img/p3.jpg", "description": "Camarones empanizados con panco, ensalada fresca y arroz." },
    { "id": 12, "name": "Filete al ajillo (sin gratin)", "price": 520.00, "category": "platos-fuertes", "image": "../assets/img/p4.jpg", "description": "Fielte de pescado al ajillo, acompañado con ensalada y arroz." },
    { "id": 13, "name": "Mojarra Grande", "price": 380.00, "category": "especialidades", "image": "../assets/img/p5.jpg", "description": "Mojarra grande preparada al gusto." },
    { "id": 14, "name": "Camarones al coco", "price": 650.00, "category": "especialidades", "image": "../assets/img/Coca.jpg", "description": "Camarones empanizados con coco y salsa mango-habanero." },
    { "id": 15, "name": "Flan de Coco", "price": 65.00, "category": "postres", "image": "../assets/img/coco.jpg", "description": "Flan tradicional de coco." },
    { "id": 16, "name": "Mousse de Chocolate con Maracuyá", "price": 70.00, "category": "postres", "image": "../assets/img/hk.jpg", "description": "Mousse de chocolate con maracuyá." }
];

// IMPORTANTE: ahora sí lo exponemos correctamente
window.productosGlobal = productos;

function cargarMenu() {
    const contenedor = document.getElementById('contenedor-productos');
    const filtros = document.querySelectorAll('.filtro-btn');

    mostrarProductos(productos);

    filtros.forEach(f => {
        f.addEventListener('click', function () {
            filtros.forEach(btn => btn.classList.remove('activo'));
            this.classList.add('activo');

            const cat = this.dataset.categoria;
            if (cat === "todas") {
                mostrarProductos(productos);
            } else {
                mostrarProductos(productos.filter(p => p.category === cat));
            }
        });
    });
}

function mostrarProductos(lista) {
    const contenedor = document.getElementById('contenedor-productos');

    if (!lista.length) {
        contenedor.innerHTML = '<div class="sin-productos">No hay productos en esta categoría</div>';
        return;
    }

    contenedor.innerHTML = lista.map(p => `
        <div class="producto">
            <img src="${p.image}" alt="${p.name}" class="producto-imagen">
            <div class="producto-contenido">
                <span class="producto-categoria">${formatearCategoria(p.category)}</span>
                <h3 class="producto-nombre">${p.name}</h3>
                <p class="producto-descripcion">${p.description}</p>
                <div class="producto-precio">$${p.price.toFixed(2)}</div>
                <button class="agregar-carrito" data-id="${p.id}">
                    <i class="fas fa-cart-plus"></i> Añadir
                </button>
            </div>
        </div>
    `).join('');
}

function formatearCategoria(cat) {
    return cat.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
}