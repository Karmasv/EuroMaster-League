console.log('EuroMaster League cargado');

// Navegación activa
document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentPath === linkPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
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
