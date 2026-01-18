// EuroMaster League - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('EuroMaster League cargado');
    
    // Cargar datos de la API
    loadLeagueData();
    
    // Configurar navegación activa
    setActiveNav();
    
    // Inicializar componentes
    initializeComponents();
});

function setActiveNav() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentPath === linkPath || 
            (currentPath === '/' && linkPath === '/') ||
            (currentPath.includes(linkPath) && linkPath !== '/')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

async function loadLeagueData() {
    try {
        // Intentar cargar datos de la API
        const response = await fetch('/api/data?file=teams');
        if (response.ok) {
            const teams = await response.json();
            updateTeamsDisplay(teams);
        }
    } catch (error) {
        console.log('API no disponible aún - Modo demostración');
        // Modo demostración con datos de ejemplo
        showDemoData();
    }
}

function updateTeamsDisplay(teams) {
    const teamsContainer = document.getElementById('teams-container');
    if (!teamsContainer || teams.length === 0) return;
    
    // Actualizar UI con datos reales
    console.log(`${teams.length} equipos cargados`);
}

function showDemoData() {
    // Datos de demostración para desarrollo
    console.log('Mostrando datos de demostración');
}

function initializeComponents() {
    // Inicializar tooltips
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
    
    // Añadir año actual al footer
    const yearElement = document.querySelector('.current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

function showTooltip(event) {
    const tooltipText = event.target.getAttribute('data-tooltip');
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = tooltipText;
    document.body.appendChild(tooltip);
    
    const rect = event.target.getBoundingClientRect();
    tooltip.style.position = 'absolute';
    tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
    tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// API Helper Functions
window.EML = {
    async getTeams() {
        try {
            const response = await fetch('/api/data?file=teams');
            return await response.json();
        } catch (error) {
            console.error('Error fetching teams:', error);
            return [];
        }
    },
    
    async getStandings() {
        try {
            const response = await fetch('/api/data?file=standings');
            return await response.json();
        } catch (error) {
            console.error('Error fetching standings:', error);
            return [];
        }
    }
};
