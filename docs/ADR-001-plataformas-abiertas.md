# ADR-001: ¿Por qué (y cómo) abierto?

## Contexto
El proyecto del restaurante de mariscos busca una solución simple y accesible para mostrar el menú, la historia del negocio y futuras promociones en una página web.  
Las opciones eran:  
1. Usar una plataforma cerrada o propietaria (ej. Wix, Squarespace).  
2. Usar una plataforma abierta con tecnologías estándar de la web (HTML, CSS, JavaScript).  

El objetivo principal es **tener control total del código, evitar costos de licencias** y poder escalar en el futuro hacia nuevas funcionalidades.

## Decisión
Se decidió utilizar **HTML, CSS y JavaScript** como base del proyecto, en un enfoque **100% abierto**.  
El sitio se construirá desde cero, sin depender de plataformas cerradas.

## Beneficios
- **Simplicidad y control:** el equipo entiende y modifica directamente el código.  
- **Compatibilidad universal:** cualquier navegador soporta estas tecnologías.  
- **Costo cero en licencias:** no hay pagos por plataforma.  
- **Escalabilidad:** en el futuro se pueden agregar frameworks o integraciones sin estar atados a un proveedor.  

## Riesgos
- **Tiempo de desarrollo inicial más alto** que usar una plantilla cerrada.  
- **Responsabilidad de diseño responsivo y usabilidad** recae totalmente en el equipo.  
- **Sin funciones preconstruidas:** todo se debe programar.  

## Mitigaciones
- Reutilizar componentes y buenas prácticas de diseño web.  
- Usar librerías de código abierto (ej. Bootstrap, Tailwind, o librerías JS) si se necesita.  
- Planear una estructura clara de carpetas (assets, css, js, imágenes) para facilitar mantenimiento.  