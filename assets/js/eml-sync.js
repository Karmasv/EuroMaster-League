/**
 * EuroMaster League - API Client
 * Sincronización automática entre Bot y Web
 */

const API_URL = window.location.origin + '/api';

class EMLClient {
    constructor() {
        this.data = {
            teams: [],
            players: [],
            matches: [],
            standings: [],
            transfers: []
        };
    }

    async loadStandings() {
        try {
            const response = await fetch(`${API_URL}/standings`);
            if (response.ok) {
                this.data.standings = await response.json();
                this.updateStandingsTable();
            }
        } catch (error) {
            console.log('Modo demo - Standings no disponible');
        }
    }

    async loadTeams() {
        try {
            const response = await fetch(`${API_URL}/teams`);
            if (response.ok) {
                this.data.teams = await response.json();
            }
        } catch (error) {
            console.log('Modo demo - Teams no disponible');
        }
    }

    async loadPlayers() {
        try {
            const response = await fetch(`${API_URL}/players`);
            if (response.ok) {
                this.data.players = await response.json();
                this.updatePlayersDisplay();
            }
        } catch (error) {
            console.log('Modo demo - Players no disponible');
        }
    }

    async loadMatches() {
        try {
            const response = await fetch(`${API_URL}/matches`);
            if (response.ok) {
                this.data.matches = await response.json();
            }
        } catch (error) {
            console.log('Modo demo - Matches no disponible');
        }
    }

    async loadTransfers() {
        try {
            const response = await fetch(`${API_URL}/transfers`);
            if (response.ok) {
                this.data.transfers = await response.json();
                this.updateTransfersDisplay();
            }
        } catch (error) {
            console.log('Modo demo - Transfers no disponible');
        }
    }

    updateStandingsTable() {
        const tbody = document.querySelector('.stats-table tbody');
        if (!tbody || this.data.standings.length === 0) return;

        tbody.innerHTML = '';

        this.data.standings.forEach((team, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="font-weight: 900; color: #d4af37;">${index + 1}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 30px; height: 30px; background: rgba(212,175,55,0.2); 
                             border-radius: 50%; display: grid; place-items: center; font-weight: 900;">
                            ${team.team.charAt(0)}
                        </div>
                        <div>
                            <div style="font-weight: 700;">${team.team}</div>
                        </div>
                    </div>
                </td>
                <td>${team.played || 0}</td>
                <td>${team.wins || 0}</td>
                <td>${team.draws || 0}</td>
                <td>${team.losses || 0}</td>
                <td>${team.goalsFor || 0}</td>
                <td>${team.goalsAgainst || 0}</td>
                <td>${(team.goalsFor || 0) - (team.goalsAgainst || 0)}</td>
                <td style="font-weight: 900;">${team.points || 0}</td>
            `;
            tbody.appendChild(row);
        });
    }

    updatePlayersDisplay() {
        const grid = document.querySelector('.players-grid');
        if (!grid || this.data.players.length === 0) return;

        const topPlayers = this.data.players
            .sort((a, b) => (b.goals || 0) - (a.goals || 0))
            .slice(0, 4);

        grid.innerHTML = '';

        topPlayers.forEach(player => {
            const card = document.createElement('div');
            card.className = 'player-card';
            card.innerHTML = `
                <div class="player-avatar">
                    <i class="fas fa-user-circle"></i>
                </div>
                <div class="player-info">
                    <h3 class="player-name">${player.name}</h3>
                    <p class="player-team">${player.team || 'Sin equipo'}</p>
                    <div class="player-stats">
                        <div class="stat"><span class="stat-value">${player.goals || 0}</span><span class="stat-label">GOLES</span></div>
                        <div class="stat"><span class="stat-value">${player.assists || 0}</span><span class="stat-label">ASISTENCIAS</span></div>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    updateTransfersDisplay() {
        const container = document.getElementById('transfersContainer');
        if (!container || this.data.transfers.length === 0) return;

        container.innerHTML = '';

        this.data.transfers.slice(0, 10).forEach(transfer => {
            const traspaso = document.createElement('div');
            traspaso.className = 'transfer-item';
            
            const timeAgo = this.getTimeAgo(new Date(transfer.date));
            const statusClass = transfer.type === 'entrada' ? 'in' : 'out';
            const statusText = transfer.type === 'entrada' ? 'ENTRADA' : 'SALIDA';
            
            let description = '';
            if (transfer.type === 'entrada') {
                description = `<strong>${transfer.playerName}</strong> fichado por <strong style="color: #d4af37;">${transfer.toTeam}</strong>`;
            } else {
                description = `<strong>${transfer.playerName}</strong> se marcha de <strong style="color: #e63946;">${transfer.fromTeam}</strong>`;
            }
            
            traspaso.innerHTML = `
                <div class="transfer-status ${statusClass}">${statusText}</div>
                <div class="transfer-content">
                    <p class="transfer-player">${description}</p>
                    <p class="transfer-time">Hace ${timeAgo}</p>
                </div>
            `;
            container.appendChild(traspaso);
        });
    }

    getTimeAgo(date) {
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        const intervals = {
            'año': 31536000,
            'mes': 2592000,
            'semana': 604800,
            'día': 86400,
            'hora': 3600,
            'minuto': 60
        };

        for (const [name, secondsInInterval] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInInterval);
            if (interval >= 1) {
                return interval + ' ' + name + (interval > 1 ? 's' : '');
            }
        }

        return 'ahora mismo';
    }

    async syncAll() {
        await Promise.all([
            this.loadStandings(),
            this.loadTeams(),
            this.loadPlayers(),
            this.loadMatches(),
            this.loadTransfers()
        ]);
    }

    startAutoSync(interval = 30000) {
        console.log('🔄 Iniciando sincronización automática cada 30 segundos');
        this.syncAll();
        setInterval(() => this.syncAll(), interval);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const eml = new EMLClient();
    eml.startAutoSync();
    window.EMLClient = eml;
});
