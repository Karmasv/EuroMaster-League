// ===== CONFIGURACIÓN =====
const CONFIG = {
    API_BASE_URL: 'http://localhost:3000/api', // Cambiar por tu backend real
    DISCORD_WEBHOOK: 'https://discord.com/api/webhooks/...', // Para notificaciones
    REFRESH_INTERVAL: 30000, // 30 segundos
    CURRENT_SEASON: 'EML Season 1'
};

// ===== ESTADO GLOBAL =====
let appState = {
    matches: [],
    teams: [],
    players: [],
    standings: [],
    liveMatches: []
};

// ===== ELEMENTOS DOM =====
const DOM = {
    recentMatches: document.getElementById('recentMatches'),
    standingsTable: document.getElementById('standingsTable'),
    topPlayers: document.getElementById('topPlayers'),
    upcomingMatches: document.getElementById('upcomingMatches'),
    matchCountdown: document.getElementById('matchCountdown'),
    menuToggle: document.getElementById('menuToggle'),
    navMenu: document.querySelector('.nav-menu')
};

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('EuroMaster League - Inicializando...');
    
    // Inicializar componentes
    initNavigation();
    initCountdown();
    loadSampleData(); // Temporal: datos de ejemplo
    // loadRealData(); // Para cuando tengas backend
    
    // Configurar actualizaciones automáticas
    setInterval(updateLiveData, CONFIG.REFRESH_INTERVAL);
});

// ===== NAVEGACIÓN =====
function initNavigation() {
    if (DOM.menuToggle && DOM.navMenu) {
        DOM.menuToggle.addEventListener('click', () => {
            DOM.navMenu.classList.toggle('active');
        });
        
        // Cerrar menú al hacer clic en enlace
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                DOM.navMenu.classList.remove('active');
            });
        });
    }
    
    // Efecto hover en tarjetas
    document.querySelectorAll('.match-card, .player-card, .schedule-item').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

// ===== COUNTDOWN =====
function initCountdown() {
    if (!DOM.matchCountdown) return;
    
    const targetTime = new Date();
    targetTime.setHours(20, 0, 0, 0); // 20:00 hoy
    
    function updateCountdown() {
        const now = new Date();
        let diff = targetTime - now;
        
        if (diff < 0) {
            // Si ya pasó la hora, mostrar "EN VIVO" o "FINALIZADO"
            DOM.matchCountdown.textContent = "EN VIVO";
            DOM.matchCountdown.style.color = '#00ff88';
            DOM.matchCountdown.style.animation = 'pulse 1s infinite';
            return;
        }
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        DOM.matchCountdown.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ===== DATOS DE EJEMPLO (TEMPORAL) =====
function loadSampleData() {
    // Datos de ejemplo de equipos
    const sampleTeams = [
        {
            id: 1,
            name: 'Dragons',
            tag: 'DRG',
            logo: 'https://via.placeholder.com/80/0066FF/FFFFFF?text=DRG',
            wins: 5,
            draws: 1,
            losses: 2,
            goalsFor: 18,
            goalsAgainst: 10,
            points: 16,
            form: ['W', 'W', 'L', 'W', 'D']
        },
        {
            id: 2,
            name: 'Vikings',
            tag: 'VIK',
            logo: 'https://via.placeholder.com/80/FF5500/FFFFFF?text=VIK',
            wins: 6,
            draws: 0,
            losses: 2,
            goalsFor: 22,
            goalsAgainst: 12,
            points: 18,
            form: ['W', 'W', 'W', 'L', 'W']
        },
        {
            id: 3,
            name: 'Phoenix',
            tag: 'PHX',
            logo: 'https://via.placeholder.com/80/FFAA00/FFFFFF?text=PHX',
            wins: 4,
            draws: 2,
            losses: 2,
            goalsFor: 16,
            goalsAgainst: 11,
            points: 14,
            form: ['W', 'D', 'W', 'D', 'L']
        },
        {
            id: 4,
            name: 'Titans',
            tag: 'TIT',
            logo: 'https://via.placeholder.com/80/00FF88/FFFFFF?text=TIT',
            wins: 3,
            draws: 3,
            losses: 2,
            goalsFor: 14,
            goalsAgainst: 13,
            points: 12,
            form: ['D', 'W', 'D', 'L', 'D']
        }
    ];
    
    // Datos de ejemplo de partidos
    const sampleMatches = [
        {
            id: 1,
            tournament: 'EML Season 1',
            date: '2024-03-10',
            time: '18:00',
            status: 'finished',
            teamHome: { name: 'Dragons', logo: 'https://via.placeholder.com/40/0066FF/FFFFFF?text=DRG' },
            teamAway: { name: 'Phoenix', logo: 'https://via.placeholder.com/40/FFAA00/FFFFFF?text=PHX' },
            score: { home: 3, away: 1 },
            stats: { possession: '58% - 42%', shots: '12-8' }
        },
        {
            id: 2,
            tournament: 'EML Season 1',
            date: '2024-03-10',
            time: '19:30',
            status: 'finished',
            teamHome: { name: 'Vikings', logo: 'https://via.placeholder.com/40/FF5500/FFFFFF?text=VIK' },
            teamAway: { name: 'Titans', logo: 'https://via.placeholder.com/40/00FF88/FFFFFF?text=TIT' },
            score: { home: 2, away: 2 },
            stats: { possession: '52% - 48%', shots: '10-9' }
        },
        {
            id: 3,
            tournament: 'EML Season 1',
            date: '2024-03-11',
            time: '20:00',
            status: 'upcoming',
            teamHome: { name: 'Dragons', logo: 'https://via.placeholder.com/40/0066FF/FFFFFF?text=DRG' },
            teamAway: { name: 'Vikings', logo: 'https://via.placeholder.com/40/FF5500/FFFFFF?text=VIK' },
            score: { home: 0, away: 0 },
            stats: null
        },
        {
            id: 4,
            tournament: 'EML Season 1',
            date: '2024-03-12',
            time: '21:00',
            status: 'upcoming',
            teamHome: { name: 'Phoenix', logo: 'https://via.placeholder.com/40/FFAA00/FFFFFF?text=PHX' },
            teamAway: { name: 'Titans', logo: 'https://via.placeholder.com/40/00FF88/FFFFFF?text=TIT' },
            score: { home: 0, away: 0 },
            stats: null
        }
    ];
    
    // Datos de ejemplo de jugadores
    const samplePlayers = [
        {
            id: 1,
            name: 'HaxMaster',
            nickname: 'haxpro',
            team: 'Dragons',
            avatar: 'https://via.placeholder.com/100/0066FF/FFFFFF?text=HM',
            stats: { goals: 12, assists: 8, mvps: 3, rating: 9.2 }
        },
        {
            id: 2,
            name: 'BallWizard',
            nickname: 'wizard',
            team: 'Vikings',
            avatar: 'https://via.placeholder.com/100/FF5500/FFFFFF?text=BW',
            stats: { goals: 10, assists: 10, mvps: 4, rating: 9.5 }
        },
        {
            id: 3,
            name: 'WallGod',
            nickname: 'wall',
            team: 'Phoenix',
            avatar: 'https://via.placeholder.com/100/FFAA00/FFFFFF?text=WG',
            stats: { goals: 8, assists: 6, mvps: 2, rating: 8.8 }
        },
        {
            id: 4,
            name: 'GoalKeeper',
            nickname: 'keeper',
            team: 'Titans',
            avatar: 'https://via.placeholder.com/100/00FF88/FFFFFF?text=GK',
            stats: { goals: 5, assists: 12, mvps: 1, rating: 8.5 }
        }
    ];
    
    // Actualizar estado
    appState.teams = sampleTeams;
    appState.matches = sampleMatches;
    appState.players = samplePlayers;
    appState.standings = calculateStandings(sampleTeams);
    
    // Renderizar datos
    renderRecentMatches();
    renderStandings();
    renderTopPlayers();
    renderUpcomingMatches();
}

// ===== RENDERIZADO =====
function renderRecentMatches() {
    if (!DOM.recentMatches) return;
    
    const recent = appState.matches
        .filter(match => match.status === 'finished')
        .slice(0, 4);
    
    if (recent.length === 0) {
        DOM.recentMatches.innerHTML = '<div class="loading">No hay partidos recientes</div>';
        return;
    }
    
    DOM.recentMatches.innerHTML = recent.map(match => `
        <div class="match-card">
            <div class="match-header">
                <span class="match-tournament-badge">${match.tournament}</span>
                <span class="match-status status-finished">FINALIZADO</span>
            </div>
            
            <div class="match-teams">
                <div class="match-team">
                    <img src="${match.teamHome.logo}" alt="${match.teamHome.name}" class="team-logo-small">
                    <span class="team-name">${match.teamHome.name}</span>
                </div>
                
                <div class="match-score">${match.score.home} - ${match.score.away}</div>
                
                <div class="match-team" style="justify-content: flex-end;">
                    <span class="team-name">${match.teamAway.name}</span>
                    <img src="${match.teamAway.logo}" alt="${match.teamAway.name}" class="team-logo-small">
                </div>
            </div>
            
            <div class="match-footer">
                <span>${match.date} • ${match.time}</span>
                <a href="pages/match-detail.html?id=${match.id}" class="btn-details" style="padding: 0.25rem 0.75rem; font-size: 0.8rem;">
                    <i class="fas fa-chart-bar"></i> Stats
                </a>
            </div>
        </div>
    `).join('');
}

function renderStandings() {
    if (!DOM.standingsTable) return;
    
    const sortedTeams = [...appState.standings].sort((a, b) => b.points - a.points);
    
    DOM.standingsTable.innerHTML = sortedTeams.map((team, index) => `
        <tr>
            <td>
                <div class="team-position ${index < 3 ? `position-${index + 1}` : ''}">
                    ${index + 1}
                </div>
            </td>
            <td>
                <div class="team-cell">
                    <div class="team-info">
                        <img src="${team.logo}" alt="${team.name}" class="team-logo-micro">
                        <div>
                            <strong>${team.name}</strong>
                            <div style="font-size: 0.8rem; color: var(--text-muted)">${team.tag}</div>
                        </div>
                    </div>
                </div>
            </td>
            <td>${team.wins + team.draws + team.losses}</td>
            <td>${team.wins}</td>
            <td>${team.draws}</td>
            <td>${team.losses}</td>
            <td>${team.goalsFor}</td>
            <td>${team.goalsAgainst}</td>
            <td><strong>${team.points}</strong></td>
            <td>
                <div class="form-indicators">
                    ${team.form.map(result => `
                        <div class="form-indicator form-${result.toLowerCase()}">${result}</div>
                    `).join('')}
                </div>
            </td>
        </tr>
    `).join('');
}

function renderTopPlayers() {
    if (!DOM.topPlayers) return;
    
    const topPlayers = [...appState.players]
        .sort((a, b) => b.stats.rating - a.stats.rating)
        .slice(0, 4);
    
    DOM.topPlayers.innerHTML = topPlayers.map(player => `
        <div class="player-card">
            <img src="${player.avatar}" alt="${player.name}" class="player-avatar">
            <h3 class="player-name">${player.name}</h3>
            <p class="player-team">${player.team}</p>
            <div class="player-stats">
                <div class="stat-item">
                    <span class="stat-value">${player.stats.goals}</span>
                    <span class="stat-label">Goles</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${player.stats.assists}</span>
                    <span class="stat-label">Asist.</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${player.stats.mvps}</span>
                    <span class="stat-label">MVPs</span>
                </div>
            </div>
            <div style="margin-top: 1rem;">
                <span class="stat-value" style="font-size: 1rem;">Rating: ${player.stats.rating}</span>
            </div>
        </div>
    `).join('');
}

function renderUpcomingMatches() {
    if (!DOM.upcomingMatches) return;
    
    const upcoming = appState.matches
        .filter(match => match.status === 'upcoming')
        .slice(0, 5);
    
    if (upcoming.length === 0) {
        DOM.upcomingMatches.innerHTML = '<div class="loading">No hay partidos programados</div>';
        return;
    }
    
    DOM.upcomingMatches.innerHTML = upcoming.map(match => `
        <div class="schedule-item">
            <div class="schedule-date">${match.date}</div>
            <div class="schedule-teams">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <img src="${match.teamHome.logo}" alt="${match.teamHome.name}" style="width: 30px; height: 30px; border-radius: 50%;">
                    <span>${match.teamHome.name}</span>
                </div>
                <span style="color: var(--text-muted);">vs</span>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <img src="${match.teamAway.logo}" alt="${match.teamAway.name}" style="width: 30px; height: 30px; border-radius: 50%;">
                    <span>${match.teamAway.name}</span>
                </div>
            </div>
            <div class="schedule-time">${match.time}</div>
        </div>
    `).join('');
}

// ===== FUNCIONES UTILITARIAS =====
function calculateStandings(teams) {
    return teams.map(team => ({
        ...team,
        points: (team.wins * 3) + (team.draws * 1)
    }));
}

function updateLiveData() {
    console.log('Actualizando datos en vivo...');
    // Aquí iría la llamada real a la API
    // fetch(`${CONFIG.API_BASE_URL}/live`)
    //     .then(response => response.json())
    //     .then(data => {
    //         // Actualizar estado y re-renderizar
    //     });
}

// ===== NOTIFICACIONES =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Estilos para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#00ff88' : type === 'error' ? '#ff4444' : '#0066ff'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        box-shadow: var(--shadow);
    `;
    
    // Animación de entrada
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Botón de cerrar
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ===== EXPORTAR FUNCIONES PARA CONSOLA (debug) =====
window.EML = {
    getState: () => appState,
    refreshData: () => {
        loadSampleData();
        showNotification('Datos actualizados', 'success');
    },
    showNotification,
    simulateMatch: (homeScore, awayScore) => {
        // Función para simular un partido (debug)
        console.log(`Simulando partido: ${homeScore}-${awayScore}`);
    }
};

console.log('EuroMaster League JS cargado correctamente.');
// ============================================
// FUNCIONES PARA GITHUB DB (WEB)
// ============================================

class WebDataManager {
  constructor() {
    this.baseURL = window.location.origin;
  }

  async getData(type) {
    try {
      const response = await fetch(`${this.baseURL}/api/data?file=${type}`);
      if (!response.ok) throw new Error('Error en API');
      return await response.json();
    } catch (error) {
      console.error(`Error obteniendo ${type}:`, error);
      return [];
    }
  }

  async saveData(type, data) {
    try {
      const response = await fetch(`${this.baseURL}/api/data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection: type, data })
      });
      
      if (!response.ok) throw new Error('Error guardando datos');
      return await response.json();
    } catch (error) {
      console.error(`Error guardando ${type}:`, error);
      return { error: true, message: error.message };
    }
  }

  // Métodos específicos para la liga
  async getTeams() {
    return await this.getData('teams');
  }

  async getMatches() {
    return await this.getData('matches');
  }

  async getStandings() {
    return await this.getData('standings');
  }

  async addTeam(teamData) {
    const teams = await this.getTeams();
    teamData.id = teams.length > 0 ? Math.max(...teams.map(t => t.id)) + 1 : 1;
    teams.push(teamData);
    return await this.saveData('teams', teams);
  }

  async updateMatch(matchId, result) {
    const matches = await this.getMatches();
    const matchIndex = matches.findIndex(m => m.id === matchId);
    
    if (matchIndex === -1) return { error: true, message: 'Partido no encontrado' };
    
    matches[matchIndex] = { ...matches[matchIndex], ...result };
    return await this.saveData('matches', matches);
  }
}

// Hacer disponible globalmente
window.dataManager = new WebDataManager();

// Ejemplo de uso automático al cargar
document.addEventListener('DOMContentLoaded', async function() {
  console.log('WebDataManager cargado');
  
  // Cargar datos de ejemplo si la página lo necesita
  if (document.getElementById('teams-list')) {
    const teams = await window.dataManager.getTeams();
    console.log('Equipos cargados:', teams);
  }
});
