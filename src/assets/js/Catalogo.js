// catalogo.js - CON TODOS LOS PRODUCTOS EMBEBIDOS
document.addEventListener('DOMContentLoaded', function() {
    cargarMenu();
});

function cargarMenu() {
    const contenedorProductos = document.getElementById('contenedor-productos');
    const filtros = document.querySelectorAll('.filtro-btn');
    
    if (!contenedorProductos) return;

    console.log('Cargando menú con datos embebidos...');

    // TODOS LOS PRODUCTOS EMBEBIDOS
    const productos = [
        {
            "id": 1,
            "name": "Filete al ajillo (con gratin)",
            "price": 180.00,
            "category": "platos-fuertes",
            "image": "../assets/img/p1.jpg",
            "description": "Fielte de pescado al ajillo, acompañado con ensalada ya arroz, con queso derretido encima"
        },
        {
            "id": 2,
            "name": "Shot de Camaron",
            "price": 220.00,
            "category": "entradas",
            "image": "../assets/img/Shot_C.jpg",
            "description": "Caballito escarchado con chamoy, camaron cocido, jugo de limon y salsa casera especial"
        },
        {
            "id": 3,
            "name": "Cóctel de Camarón",
            "price": 120.00,
            "category": "entradas",
            "image": "../assets/img/cock.jpg",
            "description": "Cóctel refrescante de camarón con salsa cátsup, limón, cebolla, cilantro y aguacate."
        },
        {
            "id": 4,
            "name": "Filete de Pescado Empapelado",
            "price": 190.00,
            "category": "platos-fuertes",
            "image": "../assets/img/p4.jpg",
            "description": "Filete de robalo cocido al papillote con verduras, hierbas finas y vino blanco."
        },
        {
            "id": 5,
            "name": "Mariscada para 2 Personas",
            "price": 450.00,
            "category": "especialidades",
            "image": "../assets/img/Imagen de WhatsApp 2025-09-18 a las 15.58.36_8cc979a3.jpg",
            "description": "Surrido de mariscos incluyendo langosta, camarones, pulpo, almejas y callo de hacha en salsa de su elección."
        },
        {
            "id": 6,
            "name": "Camarones Momia",
            "price": 85.00,
            "category": "entradas",
            "image": "../assets/img/CM.jpg",
            "description": "Ricos camarones envueltos en tocino y rellenos de queso con pimiento."
        },
        {
            "id": 7,
            "name": "Arroz a la Tumbada",
            "price": 160.00,
            "category": "platos-fuertes",
            "image": "../assets/img/Tumbada.webp",
            "description": "Arroz caldoso con mezcla de mariscos, camarones, almejas y pulpo, estilo veracruzano."
        },
        {
            "id": 8,
            "name": "Postre de Mango con Maracuyá",
            "price": 75.00,
            "category": "postres",
            "image": "../assets/img/mm.webp",
            "description": "Postre refrescante de mango con coulis de maracuyá y crujiente de galleta."
        },
        {
            "id": 9,
            "name": "Aguachile de Camarón",
            "price": 150.00,
            "category": "entradas",
            "image": "../assets/img/p1.jpg",
            "description": "Aguachile estilo Sinaloa con camarones, pepino, cebolla morada y chile serrano."
        },
        {
            "id": 10,
            "name": "Ostiones Rockefeller",
            "price": 140.00,
            "category": "entradas",
            "image": "../assets/img/Rock.webp",
            "description": "Ostiones gratinados con espinacas, tocino y salsa de queso parmesano."
        },
        {
            "id": 11,
            "name": "Camarones empanizados",
            "price": 280.00,
            "category": "platos-fuertes",
            "image": "../assets/img/p3.jpg",
            "description": "Ricos camarones empanizados con panco, acompañados de ensalada fresca y guarnicion de arroz"
        },
        {
            "id": 12,
            "name": "Filete al ajillo (sin gratin)",
            "price": 520.00,
            "category": "platos-fuertes",
            "image": "../assets/img/p4.jpg",
            "description": "Fielte de pescado al ajillo, acompañado con ensalada ya arroz"
        },
        {
            "id": 13,
            "name": "Mojarra Grande",
            "price": 380.00,
            "category": "especialidades",
            "image": "../assets/img/p5.jpg",
            "description": "Auténtica paella española con azafrán, mariscos mixtos, pollo y chorizo."
        },
        {
            "id": 14,
            "name": "Camarones al coco",
            "price": 650.00,
            "category": "especialidades",
            "image": "../assets/img/Coca.jpg",
            "description": "Camarones empanizados con panco y coco rayado, acompañados de salsa mango habanero"
        },
        {
            "id": 15,
            "name": "Flan de Coco",
            "price": 65.00,
            "category": "postres",
            "image": "../assets/img/coco.jpg",
            "description": "Flan tradicional de coco con caramelo y ralladura de coco fresco."
        },
        {
            "id": 16,
            "name": "Mousse de Chocolate con Maracuyá",
            "price": 70.00,
            "category": "postres",
            "image": "../assets/img/hk.jpg",
            "description": "Mousse suave de chocolate amargo con coulis ácido de maracuyá."
        }
    ];

    mostrarProductos(productos);
    configurarFiltros(productos);

    function mostrarProductos(productos) {
        if (productos.length === 0) {
            contenedorProductos.innerHTML = '<div class="sin-productos">No hay productos disponibles en esta categoría</div>';
            return;
        }

        contenedorProductos.innerHTML = productos.map(producto => {
            return `
            <div class="producto" data-categoria="${producto.category}">
                <img src="${producto.image}" alt="${producto.name}" class="producto-imagen">
                <div class="producto-contenido">
                    <span class="producto-categoria">${formatearCategoria(producto.category)}</span>
                    <h3 class="producto-nombre">${producto.name}</h3>
                    <p class="producto-descripcion">${producto.description}</p>
                    <div class="producto-precio">$${producto.price.toFixed(2)}</div>
                </div>
            </div>
            `;
        }).join('');
    }

    function configurarFiltros(productos) {
        filtros.forEach(filtro => {
            filtro.addEventListener('click', function() {
                filtros.forEach(btn => btn.classList.remove('activo'));
                this.classList.add('activo');
                
                const categoria = this.getAttribute('data-categoria');
                if (categoria === 'todas') {
                    mostrarProductos(productos);
                } else {
                    const filtrados = productos.filter(p => p.category === categoria);
                    mostrarProductos(filtrados);
                }
            });
        });
    }
}

function formatearCategoria(categoria) {
    return categoria.split('-')
        .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
        .join(' ');
}
