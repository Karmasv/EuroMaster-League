console.log('EuroMaster League cargado');

// Menú móvil
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }
    
    // Cerrar menú al hacer click en un enlace
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        });
    });
    
    // Navegación activa
    const currentPath = window.location.pathname;
    const currentFile = currentPath.split('/').pop() || 'index.html';
    
    // Remover la clase nav-active de todos los enlaces
    navLinks.forEach(link => {
        link.classList.remove('nav-active');
    });
    
    // Añadir la clase nav-active al enlace correspondiente
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        const linkFile = linkPath.split('/').pop();
        
        // Comparar el archivo actual con el archivo del enlace
        if (linkFile === currentFile || 
            (currentFile === '' && linkFile === 'index.html') ||
            (currentFile === 'index.html' && linkFile === 'index.html')) {
            link.classList.add('nav-active');
        }
    });
    
    // Cargar datos si hay API
    loadData();
});

async function loadData() {
    try {
        const response = await fetch('/api/data?file=teams');
        if (response.ok) {
            const teams = await response.json();
            console.log('Equipos cargados:', teams.length);
        }
    } catch (error) {
        console.log('Modo demostración - API disponible pronto');
    }
}
