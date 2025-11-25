const cookieBanner = document.getElementById('cookieBanner');
        const cookieModal = document.getElementById('cookieModal');
        const acceptCookies = document.getElementById('acceptCookies');
        const rejectCookies = document.getElementById('rejectCookies');
        const cookieSettings = document.getElementById('cookieSettings');
        const closeModal = document.getElementById('closeModal');
        const rejectAllModal = document.getElementById('rejectAllModal');
        const savePreferences = document.getElementById('savePreferences');
        const privacyPolicy = document.getElementById('privacyPolicy');
        const analyticsCookies = document.getElementById('analyticsCookies');
        const marketingCookies = document.getElementById('marketingCookies');
        const preferencesCookies = document.getElementById('preferencesCookies');

        // MODIFICACIÓN: Mostrar siempre el banner al cargar la página
        function showCookieBanner() {
            // Siempre mostramos el banner sin verificar preferencias previas
            setTimeout(() => {
                cookieBanner.classList.add('active');
            }, 1000);
        }

        // Aceptar todas las cookies
        acceptCookies.addEventListener('click', () => {
            localStorage.setItem('cookiePreference', 'accepted');
            localStorage.setItem('preferencesCookies', 'true');
            localStorage.setItem('analyticsCookies', 'true');
            localStorage.setItem('marketingCookies', 'true');
            cookieBanner.classList.remove('active');
            // Aquí podrías cargar scripts de analytics y marketing
            console.log('Todas las cookies aceptadas');
        });

        // Rechazar todas las cookies
        rejectCookies.addEventListener('click', () => {
            localStorage.setItem('cookiePreference', 'rejected');
            localStorage.setItem('preferencesCookies', 'false');
            localStorage.setItem('analyticsCookies', 'false');
            localStorage.setItem('marketingCookies', 'false');
            cookieBanner.classList.remove('active');
            console.log('Todas las cookies rechazadas');
        });

        // Abrir modal de configuración
        cookieSettings.addEventListener('click', () => {
            // Cargar estado actual de las cookies
            preferencesCookies.checked = localStorage.getItem('preferencesCookies') === 'true';
            analyticsCookies.checked = localStorage.getItem('analyticsCookies') === 'true';
            marketingCookies.checked = localStorage.getItem('marketingCookies') === 'true';
            
            cookieModal.classList.add('active');
        });

        // Cerrar modal de configuración
        closeModal.addEventListener('click', () => {
            cookieModal.classList.remove('active');
        });

        // Rechazar todas desde el modal
        rejectAllModal.addEventListener('click', () => {
            localStorage.setItem('cookiePreference', 'rejected');
            localStorage.setItem('preferencesCookies', 'false');
            localStorage.setItem('analyticsCookies', 'false');
            localStorage.setItem('marketingCookies', 'false');
            cookieModal.classList.remove('active');
            cookieBanner.classList.remove('active');
            console.log('Todas las cookies rechazadas desde el modal');
        });

        // Guardar preferencias personalizadas
        savePreferences.addEventListener('click', () => {
            localStorage.setItem('cookiePreference', 'custom');
            localStorage.setItem('preferencesCookies', preferencesCookies.checked);
            localStorage.setItem('analyticsCookies', analyticsCookies.checked);
            localStorage.setItem('marketingCookies', marketingCookies.checked);
            cookieModal.classList.remove('active');
            cookieBanner.classList.remove('active');
            
            // Cargar scripts según las preferencias
            if (preferencesCookies.checked) {
                console.log('Cookies de preferencias activadas');
                // Cargar funcionalidades de personalización
            }
            
            if (analyticsCookies.checked) {
                console.log('Cookies de análisis activadas');
                // Cargar script de analytics
            }
            
            if (marketingCookies.checked) {
                console.log('Cookies de marketing activadas');
                // Cargar script de marketing
            }
            
            console.log('Preferencias de cookies guardadas');
        });

        // Enlace a política de privacidad
        privacyPolicy.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Aquí iría el enlace a la política de privacidad completa de Marisquería "Mariscos el 28".');
        });

        // Cerrar modal haciendo clic fuera del contenido
        window.addEventListener('click', (e) => {
            if (e.target === cookieModal) {
                cookieModal.classList.remove('active');
            }
        });

        // MODIFICACIÓN: Inicializar mostrando siempre el banner
        document.addEventListener('DOMContentLoaded', showCookieBanner);