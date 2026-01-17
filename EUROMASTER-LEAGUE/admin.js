// ===== CONFIGURACIÓN DEL PANEL ADMIN =====
const ADMIN_CONFIG = {
    API_URL: 'http://localhost:3000/admin',
    REQUIRED_ROLES: ['admin', 'superadmin', 'organizer'],
    DISCORD_WEBHOOK_URL: 'https://discord.com/api/webhooks/your-webhook-url'
};

// ===== ESTADO DEL PANEL =====
let adminState = {
    loggedIn: false,
    userRole: null,
    authToken: null,
    teams: [],
    matches: [],
    players: [],
    pendingChanges: [],
    isOnline: false
};

// ===== ELEMENTOS DOM DEL PANEL =====
const ADMIN_DOM = {
    // Login
    loginSection: document.getElementById('loginSection'),
    adminSection: document.getElementById('adminSection'),
    loginForm: document.getElementById('loginForm'),
    usernameInput: document.getElementById('username'),
    passwordInput: document.getElementById('password'),
    loginError: document.getElementById('loginError'),
    
    // Dashboard
    adminDashboard: document.getElementById('adminDashboard'),
    statsCards: document.getElementById('statsCards'),
    recentActivity: document.getElementById('recentActivity'),
    
    // Tabs
    tabs: document.querySelectorAll('.admin-tab'),
    tabContents: document.querySelectorAll('.tab-content'),
    
    // Gestión de Partidos
    matchesList: document.getElementById('matchesList'),
    addMatchForm: document.getElementById('addMatchForm'),
    editMatchForm: document.getElementById('editMatchForm'),
    
    // Gestión de Equipos
    teamsList: document.getElementById('teamsList'),
    addTeamForm: document.getElementById('addTeamForm'),
    
    // Gestión de Jugadores
    playersList: document.getElementById('playersList'),
    addPlayerForm: document.getElementById('addPlayerForm'),
    
    // Resultados en Vivo
    liveMatches: document.getElementById('liveMatches'),
    updateScoreForm: document.getElementById('updateScoreForm'),
    
    // Discord Integration
    discordWebhookStatus: document.getElementById('discordWebhookStatus'),
    testDiscordBtn: document.getElementById('testDiscordBtn'),
    
    // Notifications
    notificationArea: document.getElementById('notificationArea')
};

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('Panel de Admin - Inicializando...');
    
    // Verificar si ya está logueado
    checkAuth();
    
    // Inicializar event listeners
    initAdminListeners();
    
    // Cargar datos iniciales si está logueado
    if (adminState.loggedIn) {
        loadAdminData();
    }
});

// ===== AUTENTICACIÓN =====
function checkAuth() {
    const token = localStorage.getItem('eml_admin_token');
    const role = localStorage.getItem('eml_admin_role');
    
    if (token && role) {
        adminState.authToken = token;
        adminState.userRole = role;
        adminState.loggedIn = true;
        
        showAdminPanel();
    } else {
        showLoginPanel();
    }
}

function showLoginPanel() {
    if (ADMIN_DOM.loginSection) ADMIN_DOM.loginSection.style.display = 'block';
    if (ADMIN_DOM.adminSection) ADMIN_DOM.adminSection.style.display = 'none';
}

function showAdminPanel() {
    if (ADMIN_DOM.loginSection) ADMIN_DOM.loginSection.style.display = 'none';
    if (ADMIN_DOM.adminSection) ADMIN_DOM.adminSection.style.display = 'block';
    
    // Actualizar UI con rol de usuario
    document.querySelectorAll('.user-role').forEach(el => {
        el.textContent = adminState.userRole;
    });
}

// ===== EVENT LISTENERS =====
function initAdminListeners() {
    // Login Form
    if (ADMIN_DOM.loginForm) {
        ADMIN_DOM.loginForm.addEventListener('submit', handleLogin);
    }
    
    // Tabs Navigation
    ADMIN_DOM.tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
    
    // Add Match Form
    if (ADMIN_DOM.addMatchForm) {
        ADMIN_DOM.addMatchForm.addEventListener('submit', handleAddMatch);
    }
    
    // Add Team Form
    if (ADMIN_DOM.addTeamForm) {
        ADMIN_DOM.addTeamForm.addEventListener('submit', handleAddTeam);
    }
    
    // Add Player Form
    if (ADMIN_DOM.addPlayerForm) {
        ADMIN_DOM.addPlayerForm.addEventListener('submit', handleAddPlayer);
    }
    
    // Update Score Form
    if (ADMIN_DOM.updateScoreForm) {
        ADMIN_DOM.updateScoreForm.addEventListener('submit', handleUpdateScore);
    }
    
    // Discord Test
    if (ADMIN_DOM.testDiscordBtn) {
        ADMIN_DOM.testDiscordBtn.addEventListener('click', testDiscordWebhook);
    }
    
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Refresh Data
    const refreshBtn = document.getElementById('refreshDataBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadAdminData);
    }
}

// ===== MANEJADORES DE FORMULARIOS =====
async function handleLogin(e) {
    e.preventDefault();
    
    const username = ADMIN_DOM.usernameInput?.value;
    const password = ADMIN_DOM.passwordInput?.value;
    
    if (!username || !password) {
        showAdminError('Por favor completa todos los campos');
        return;
    }
    
    // SIMULACIÓN DE LOGIN (reemplazar con API real)
    if (username === 'admin' && password === 'eml2024') {
        // Login exitoso
        adminState.loggedIn = true;
        adminState.userRole = 'admin';
        adminState.authToken = 'demo_token_' + Date.now();
        
        // Guardar en localStorage
        localStorage.setItem('eml_admin_token', adminState.authToken);
        localStorage.setItem('eml_admin_role', adminState.userRole);
        
        showAdminPanel();
        loadAdminData();
        showAdminNotification('Login exitoso', 'success');
    } else {
        showAdminError('Credenciales incorrectas');
    }
}

function handleLogout() {
    adminState.loggedIn = false;
    adminState.authToken = null;
    adminState.userRole = null;
    
    localStorage.removeItem('eml_admin_token');
    localStorage.removeItem('eml_admin_role');
    
    showLoginPanel();
    showAdminNotification('Sesión cerrada', 'info');
}

async function handleAddMatch(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const matchData = {
        tournament: formData.get('tournament'),
        date: formData.get('date'),
        time: formData.get('time'),
        teamHome: formData.get('teamHome'),
        teamAway: formData.get('teamAway'),
        round: formData.get('round')
    };
    
    // Validación
    if (!matchData.teamHome || !matchData.teamAway) {
        showAdminError('Selecciona ambos equipos');
        return;
    }
    
    try {
        // Simular envío a API
        console.log('Creando partido:', matchData);
        
        // Actualizar UI
        addMatchToUI(matchData);
        
        // Notificar a Discord
        await notifyDiscord(`🎮 **Nuevo Partido Programado**\n${matchData.teamHome} vs ${matchData.teamAway}\n📅 ${matchData.date} ${matchData.time}\n🏆 ${matchData.tournament}`);
        
        showAdminNotification('Partido creado exitosamente', 'success');
        e.target.reset();
    } catch (error) {
        showAdminError('Error al crear partido: ' + error.message);
    }
}

async function handleUpdateScore(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const scoreData = {
        matchId: formData.get('matchId'),
        scoreHome: parseInt(formData.get('scoreHome')),
        scoreAway: parseInt(formData.get('scoreAway')),
        mvpPlayers: formData.get('mvpPlayers')?.split(',').map(p => p.trim()) || [],
        highlights: formData.get('highlights')
    };
    
    // Validación
    if (isNaN(scoreData.scoreHome) || isNaN(scoreData.scoreAway)) {
        showAdminError('Puntuación inválida');
        return;
    }
    
    try {
        console.log('Actualizando resultado:', scoreData);
        
        // Actualizar UI
        updateMatchScoreUI(scoreData);
        
        // Notificar a Discord
        await notifyDiscord(`⚽ **RESULTADO ACTUALIZADO**\nPartido #${scoreData.matchId}\n🏆 **${scoreData.scoreHome} - ${scoreData.scoreAway}**\n⭐ MVP: ${scoreData.mvpPlayers.join(', ')}`);
        
        showAdminNotification('Resultado actualizado', 'success');
        
        // Si hay highlights, mostrar botón
        if (scoreData.highlights) {
            showHighlightsButton(scoreData.matchId, scoreData.highlights);
        }
    } catch (error) {
        showAdminError('Error al actualizar resultado: ' + error.message);
    }
}

// ===== CARGA DE DATOS =====
async function loadAdminData() {
    if (!adminState.loggedIn) return;
    
    try {
        showAdminLoading(true);
        
        // Simular carga de datos
        const mockData = {
            stats: {
                totalMatches: 42,
                liveMatches: 2,
                totalTeams: 8,
                totalPlayers: 64,
                pendingActions: 3
            },
            recentActivity: [
                { action: 'match_created', user: 'admin', time: '10 min ago', details: 'Dragons vs Vikings' },
                { action: 'score_updated', user: 'mod1', time: '25 min ago', details: 'Phoenix 3-1 Titans' },
                { action: 'team_updated', user: 'admin', time: '1 hour ago', details: 'Team Eagles logo updated' }
            ],
            teams: [
                { id: 1, name: 'Dragons', tag: 'DRG', players: 8, status: 'active' },
                { id: 2, name: 'Vikings', tag: 'VIK', players: 8, status: 'active' },
                { id: 3, name: 'Phoenix', tag: 'PHX', players: 7, status: 'active' },
                { id: 4, name: 'Titans', tag: 'TIT', players: 8, status: 'active' }
            ],
            matches: [
                { id: 1, home: 'Dragons', away: 'Vikings', date: '2024-03-11', time: '20:00', status: 'scheduled' },
                { id: 2, home: 'Phoenix', away: 'Titans', date: '2024-03-12', time: '21:00', status: 'scheduled' }
            ]
        };
        
        // Actualizar estado
        adminState.teams = mockData.teams;
        adminState.matches = mockData.matches;
        
        // Renderizar datos
        renderAdminStats(mockData.stats);
        renderRecentActivity(mockData.recentActivity);
        renderTeamsList(mockData.teams);
        renderMatchesList(mockData.matches);
        
        // Verificar Discord Webhook
        checkDiscordWebhook();
        
        showAdminLoading(false);
    } catch (error) {
        showAdminError('Error cargando datos: ' + error.message);
        showAdminLoading(false);
    }
}

// ===== RENDERIZADO =====
function renderAdminStats(stats) {
    if (!ADMIN_DOM.statsCards) return;
    
    ADMIN_DOM.statsCards.innerHTML = `
        <div class="stat-card">
            <div class="stat-icon" style="background: rgba(0, 102, 255, 0.1);">
                <i class="fas fa-tv" style="color: #0066ff;"></i>
            </div>
            <div class="stat-info">
                <h3>${stats.totalMatches}</h3>
                <p>Partidos Totales</p>
            </div>
        </div>
        
        <div class="stat-card">
            <div class="stat-icon" style="background: rgba(255, 85, 0, 0.1);">
                <i class="fas fa-broadcast-tower" style="color: #ff5500;"></i>
            </div>
            <div class="stat-info">
                <h3>${stats.liveMatches}</h3>
                <p>En Vivo</p>
            </div>
        </div>
        
        <div class="stat-card">
            <div class="stat-icon" style="background: rgba(0, 255, 136, 0.1);">
                <i class="fas fa-users" style="color: #00ff88;"></i>
            </div>
            <div class="stat-info">
                <h3>${stats.totalTeams}</h3>
                <p>Equipos</p>
            </div>
        </div>
        
        <div class="stat-card">
            <div class="stat-icon" style="background: rgba(255, 170, 0, 0.1);">
                <i class="fas fa-user" style="color: #ffaa00;"></i>
            </div>
            <div class="stat-info">
                <h3>${stats.totalPlayers}</h3>
                <p>Jugadores</p>
            </div>
        </div>
    `;
}

function renderRecentActivity(activities) {
    if (!ADMIN_DOM.recentActivity) return;
    
    ADMIN_DOM.recentActivity.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="fas fa-${getActivityIcon(activity.action)}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title">${getActivityTitle(activity.action)}</div>
                <div class="activity-details">${activity.details}</div>
                <div class="activity-meta">
                    <span class="activity-user">${activity.user}</span>
                    <span class="activity-time">${activity.time}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function renderTeamsList(teams) {
    if (!ADMIN_DOM.teamsList) return;
    
    ADMIN_DOM.teamsList.innerHTML = teams.map(team => `
        <div class="team-admin-card">
            <div class="team-admin-header">
                <div class="team-admin-info">
                    <div class="team-admin-logo">
                        <img src="https://via.placeholder.com/40/0066FF/FFFFFF?text=${team.tag}" alt="${team.name}">
                    </div>
                    <div>
                        <h4>${team.name}</h4>
                        <p class="team-tag">${team.tag}</p>
                    </div>
                </div>
                <div class="team-admin-actions">
                    <button class="btn-icon" onclick="editTeam(${team.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="manageTeamPlayers(${team.id})" title="Jugadores">
                        <i class="fas fa-user-plus"></i>
                    </button>
                    <button class="btn-icon btn-danger" onclick="deleteTeam(${team.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="team-admin-stats">
                <span class="stat-badge"><i class="fas fa-users"></i> ${team.players} jugadores</span>
                <span class="stat-badge status-${team.status}"><i class="fas fa-circle"></i> ${team.status}</span>
            </div>
        </div>
    `).join('');
}

function renderMatchesList(matches) {
    if (!ADMIN_DOM.matchesList) return;
    
    ADMIN_DOM.matchesList.innerHTML = matches.map(match => `
        <div class="match-admin-card">
            <div class="match-admin-header">
                <div class="match-admin-teams">
                    <div class="match-admin-team">
                        <img src="https://via.placeholder.com/30/0066FF/FFFFFF?text=${match.home.substring(0,3).toUpperCase()}" alt="${match.home}">
                        <span>${match.home}</span>
                    </div>
                    <div class="match-admin-vs">vs</div>
                    <div class="match-admin-team">
                        <img src="https://via.placeholder.com/30/FF5500/FFFFFF?text=${match.away.substring(0,3).toUpperCase()}" alt="${match.away}">
                        <span>${match.away}</span>
                    </div>
                </div>
                <div class="match-admin-date">
                    <i class="fas fa-calendar"></i> ${match.date} ${match.time}
                </div>
            </div>
            <div class="match-admin-actions">
                <button class="btn-sm" onclick="startMatchLive(${match.id})">
                    <i class="fas fa-play"></i> Iniciar
                </button>
                <button class="btn-sm btn-secondary" onclick="editMatch(${match.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-sm btn-danger" onclick="cancelMatch(${match.id})">
                    <i class="fas fa-times"></i> Cancelar
                </button>
            </div>
        </div>
    `).join('');
}

// ===== DISCORD INTEGRATION =====
async function checkDiscordWebhook() {
    if (!ADMIN_DOM.discordWebhookStatus) return;
    
    try {
        // Verificar si el webhook está configurado
        const webhookConfigured = ADMIN_CONFIG.DISCORD_WEBHOOK_URL.includes('your-webhook-url') ? false : true;
        
        if (webhookConfigured) {
            ADMIN_DOM.discordWebhookStatus.innerHTML = `
                <span class="status-indicator status-online"></span>
                <span>Webhook configurado</span>
            `;
            adminState.isOnline = true;
        } else {
            ADMIN_DOM.discordWebhookStatus.innerHTML = `
                <span class="status-indicator status-offline"></span>
                <span>Webhook no configurado</span>
            `;
            adminState.isOnline = false;
        }
    } catch (error) {
        console.error('Error checking Discord webhook:', error);
        ADMIN_DOM.discordWebhookStatus.innerHTML = `
            <span class="status-indicator status-error"></span>
            <span>Error verificando webhook</span>
        `;
    }
}

async function testDiscordWebhook() {
    if (!adminState.isOnline) {
        showAdminError('Primero configura tu webhook de Discord en ADMIN_CONFIG.DISCORD_WEBHOOK_URL');
        return;
    }
    
    try {
        const response = await fetch(ADMIN_CONFIG.DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: '✅ **Prueba de Webhook Exitosa**\nEl panel de admin está conectado correctamente a Discord.',
                embeds: [{
                    title: 'EuroMaster League Admin',
                    description: 'Esta es una prueba de integración con Discord',
                    color: 0x0066ff,
                    timestamp: new Date().toISOString()
                }]
            })
        });
        
        if (response.ok) {
            showAdminNotification('Prueba enviada a Discord', 'success');
        } else {
            showAdminError('Error enviando prueba a Discord');
        }
    } catch (error) {
        showAdminError('Error de conexión: ' + error.message);
    }
}

async function notifyDiscord(message) {
    if (!adminState.isOnline) return;
    
    try {
        await fetch(ADMIN_CONFIG.DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: message,
                username: 'EuroMaster League Admin',
                avatar_url: 'https://euromaster-league.com/assets/logo.png'
            })
        });
    } catch (error) {
        console.error('Error notificando a Discord:', error);
    }
}

// ===== UTILIDADES =====
function switchTab(tabId) {
    // Actualizar tabs activos
    ADMIN_DOM.tabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-tab') === tabId) {
            tab.classList.add('active');
        }
    });
    
    // Mostrar contenido correspondiente
    ADMIN_DOM.tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === tabId + 'Tab') {
            content.classList.add('active');
        }
    });
}

function showAdminLoading(show) {
    const loader = document.getElementById('adminLoader');
    if (loader) {
        loader.style.display = show ? 'flex' : 'none';
    }
}

function showAdminNotification(message, type = 'info') {
    if (!ADMIN_DOM.notificationArea) return;
    
    const notification = document.createElement('div');
    notification.className = `admin-notification admin-notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    ADMIN_DOM.notificationArea.appendChild(notification);
    
    // Auto-remove después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

function showAdminError(message) {
    showAdminNotification(message, 'error');
}

function getActivityIcon(action) {
    const icons = {
        'match_created': 'calendar-plus',
        'score_updated': 'futbol',
        'team_updated': 'users-cog',
        'player_added': 'user-plus',
        'default': 'bell'
    };
    return icons[action] || icons.default;
}

function getActivityTitle(action) {
    const titles = {
        'match_created': 'Partido Creado',
        'score_updated': 'Resultado Actualizado',
        'team_updated': 'Equipo Modificado',
        'player_added': 'Jugador Añadido'
    };
    return titles[action] || 'Actividad';
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// ===== FUNCIONES GLOBALES PARA BOTONES =====
window.editTeam = function(teamId) {
    showAdminNotification(`Editando equipo ${teamId}...`, 'info');
    // Implementar lógica de edición
};

window.manageTeamPlayers = function(teamId) {
    showAdminNotification(`Gestionando jugadores del equipo ${teamId}...`, 'info');
    // Implementar gestión de jugadores
};

window.deleteTeam = function(teamId) {
    if (confirm('¿Estás seguro de eliminar este equipo?')) {
        showAdminNotification(`Equipo ${teamId} eliminado`, 'success');
        // Implementar eliminación
    }
};

window.startMatchLive = function(matchId) {
    showAdminNotification(`Iniciando transmisión del partido ${matchId}...`, 'info');
    // Implementar inicio de partido en vivo
};

window.editMatch = function(matchId) {
    showAdminNotification(`Editando partido ${matchId}...`, 'info');
    // Implementar edición de partido
};

window.cancelMatch = function(matchId) {
    if (confirm('¿Estás seguro de cancelar este partido?')) {
        showAdminNotification(`Partido ${matchId} cancelado`, 'warning');
        // Implementar cancelación
    }
};

// ===== ESTILOS DINÁMICOS =====
const adminStyles = `
    .admin-notification {
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        box-shadow: var(--shadow);
        max-width: 400px;
    }
    
    .admin-notification-success {
        background: #00ff88;
        color: #000;
    }
    
    .admin-notification-error {
        background: #ff4444;
        color: white;
    }
    
    .admin-notification-warning {
        background: #ffaa00;
        color: #000;
    }
    
    .admin-notification-info {
        background: #0066ff;
        color: white;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: inherit;
        font-size: 1.5rem;
        cursor: pointer;
        margin-left: auto;
        padding: 0;
        line-height: 1;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .admin-loader {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9998;
    }
    
    .status-indicator {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right: 0.5rem;
    }
    
    .status-online { background: #00ff88; }
    .status-offline { background: #ff4444; }
    .status-error { background: #ffaa00; }
    
    .btn-icon {
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 4px;
        transition: all 0.3s ease;
    }
    
    .btn-icon:hover {
        background: rgba(255, 255, 255, 0.1);
        color: var(--text-primary);
    }
    
    .btn-danger {
        color: #ff4444;
    }
    
    .btn-danger:hover {
        background: rgba(255, 68, 68, 0.2);
    }
`;

// Añadir estilos al documento
const styleSheet = document.createElement('style');
styleSheet.textContent = adminStyles;
document.head.appendChild(styleSheet);

console.log('Panel de Admin cargado correctamente.');