// EuroMaster League - Main JS
console.log('EuroMaster League cargado');

document.addEventListener('DOMContentLoaded', function() {
    // Navegación activa
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
    
    // Cargar datos si existe API
    if (typeof fetch !== 'undefined') {
        loadInitialData();
    }
});

async function loadInitialData() {
    try {
        const response = await fetch('/api/data?file=teams');
        if (response.ok) {
            const teams = await response.json();
            console.log(`${teams.length} equipos cargados`);
        }
    } catch (error) {
        console.log('Modo demostración - API disponible pronto');
    }
}

// API Helper
window.EML_API = {
    getTeams: () => fetch('/api/data?file=teams').then(r => r.json()),
    getStandings: () => fetch('/api/data?file=standings').then(r => r.json())
};
