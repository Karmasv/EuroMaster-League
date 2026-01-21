const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../../data');

class Database {
    static loadTeams() {
        const filePath = path.join(DATA_PATH, 'teams.json');
        try {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (error) {
            console.error('Error cargando teams:', error);
            return [];
        }
    }

    static loadPlayers() {
        const filePath = path.join(DATA_PATH, 'players.json');
        try {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (error) {
            console.error('Error cargando players:', error);
            return [];
        }
    }

    static loadMatches() {
        const filePath = path.join(DATA_PATH, 'matches.json');
        try {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (error) {
            console.error('Error cargando matches:', error);
            return [];
        }
    }

    static loadStandings() {
        const filePath = path.join(DATA_PATH, 'standings.json');
        try {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (error) {
            console.error('Error cargando standings:', error);
            return [];
        }
    }

    static loadTransfers() {
        const filePath = path.join(DATA_PATH, 'transfers.json');
        try {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (error) {
            console.error('Error cargando transfers:', error);
            return [];
        }
    }

    static saveTeams(teams) {
        const filePath = path.join(DATA_PATH, 'teams.json');
        fs.writeFileSync(filePath, JSON.stringify(teams, null, 2), 'utf8');
    }

    static savePlayers(players) {
        const filePath = path.join(DATA_PATH, 'players.json');
        fs.writeFileSync(filePath, JSON.stringify(players, null, 2), 'utf8');
    }

    static saveMatches(matches) {
        const filePath = path.join(DATA_PATH, 'matches.json');
        fs.writeFileSync(filePath, JSON.stringify(matches, null, 2), 'utf8');
    }

    static saveStandings(standings) {
        const filePath = path.join(DATA_PATH, 'standings.json');
        fs.writeFileSync(filePath, JSON.stringify(standings, null, 2), 'utf8');
    }

    static saveTransfers(transfers) {
        const filePath = path.join(DATA_PATH, 'transfers.json');
        fs.writeFileSync(filePath, JSON.stringify(transfers, null, 2), 'utf8');
    }

    // MÉTODOS DE UTILIDAD
    static findTeamByName(name) {
        const teams = this.loadTeams();
        return teams.find(t => t.name.toLowerCase() === name.toLowerCase());
    }

    static findTeamByAbbreviation(abbr) {
        const teams = this.loadTeams();
        return teams.find(t => t.abbreviation.toUpperCase() === abbr.toUpperCase());
    }

    static findPlayerByName(name) {
        const players = this.loadPlayers();
        return players.find(p => p.name.toLowerCase() === name.toLowerCase());
    }

    static findTeamPlayers(teamName) {
        const players = this.loadPlayers();
        return players.filter(p => p.team && p.team.toLowerCase() === teamName.toLowerCase());
    }

    // GESTIÓN DE JUGADORES
    static addPlayer(playerName, teamName) {
        const players = this.loadPlayers();
        if (this.findPlayerByName(playerName)) {
            return { success: false, message: 'El jugador ya existe' };
        }

        players.push({
            id: players.length + 1,
            name: playerName,
            team: teamName,
            goals: 0,
            assists: 0,
            yellowCards: 0,
            redCards: 0,
            joinedAt: new Date().toISOString()
        });

        this.savePlayers(players);
        return { success: true, message: `${playerName} fichado por ${teamName}` };
    }

    static removePlayer(playerName) {
        let players = this.loadPlayers();
        const player = this.findPlayerByName(playerName);
        if (!player) {
            return { success: false, message: 'Jugador no encontrado' };
        }

        players = players.filter(p => p.name.toLowerCase() !== playerName.toLowerCase());
        this.savePlayers(players);
        return { success: true, message: `${playerName} ha sido desfichado`, player };
    }

    // GESTIÓN DE TRANSFERENCIAS
    static createTransfer(transferData) {
        const transfers = this.loadTransfers();
        
        const newTransfer = {
            id: transfers.length + 1,
            playerName: transferData.playerName,
            playerId: transferData.playerId || null,
            fromTeam: transferData.fromTeam || null,
            toTeam: transferData.toTeam,
            status: 'pending', // pending, accepted, rejected, expired
            date: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
            manager: transferData.manager,
            managerId: transferData.managerId,
            reason: transferData.reason || null
        };

        transfers.unshift(newTransfer);
        this.saveTransfers(transfers);
        
        return { success: true, transfer: newTransfer };
    }

    static updateTransferStatus(transferId, newStatus) {
        const transfers = this.loadTransfers();
        const transfer = transfers.find(t => t.id === transferId);
        
        if (!transfer) {
            return { success: false, message: 'Transferencia no encontrada' };
        }

        transfer.status = newStatus;
        
        // Si se acepta, actualizar el equipo del jugador
        if (newStatus === 'accepted') {
            const players = this.loadPlayers();
            const player = players.find(p => p.name.toLowerCase() === transfer.playerName.toLowerCase());
            if (player) {
                player.team = transfer.toTeam;
                player.joinedAt = new Date().toISOString();
                this.savePlayers(players);
            }
        }

        this.saveTransfers(transfers);
        return { success: true, transfer };
    }

    static getPendingTransfers() {
        const transfers = this.loadTransfers();
        return transfers.filter(t => t.status === 'pending');
    }

    static getExpiredTransfers() {
        const transfers = this.loadTransfers();
        const now = new Date();
        return transfers.filter(t => 
            t.status === 'pending' && new Date(t.expiresAt) < now
        );
    }

    static expireOldTransfers() {
        const expired = this.getExpiredTransfers();
        expired.forEach(transfer => {
            this.updateTransferStatus(transfer.id, 'expired');
        });
        return expired.length;
    }

    // GESTIÓN DE EQUIPOS
    static createTeam(teamData) {
        const teams = this.loadTeams();
        
        if (this.findTeamByName(teamData.name)) {
            return { success: false, message: 'El equipo ya existe' };
        }

        const newTeam = {
            id: teams.length + 1,
            name: teamData.name,
            abbreviation: teamData.abbreviation.toUpperCase(),
            city: teamData.city || 'Sin especificar',
            logoUrl: teamData.logoUrl || null,
            roleId: teamData.roleId || null,
            channelId: teamData.channelId || null,
            color: teamData.color || '#0099FF',
            managerId: teamData.managerId,
            manager: teamData.manager,
            points: 0,
            founded: new Date().toISOString()
        };

        teams.push(newTeam);
        this.saveTeams(teams);
        
        return { success: true, team: newTeam };
    }

    static updateTeam(teamId, updates) {
        const teams = this.loadTeams();
        const teamIndex = teams.findIndex(t => t.id === teamId);
        
        if (teamIndex === -1) {
            return { success: false, message: 'Equipo no encontrado' };
        }

        teams[teamIndex] = { ...teams[teamIndex], ...updates };
        this.saveTeams(teams);
        
        return { success: true, team: teams[teamIndex] };
    }

    // ACTUALIZACIÓN DE NICKNAMES
    static updatePlayerNickname(playerName, newNickname) {
        const players = this.loadPlayers();
        const player = players.find(p => p.name.toLowerCase() === playerName.toLowerCase());
        
        if (!player) {
            return { success: false, message: 'Jugador no encontrado' };
        }

        player.nickname = newNickname;
        this.savePlayers(players);
        
        return { success: true, player };
    }

    // TRANSFERENCIAS SIMPLES (versión legacy)
    static transferPlayer(playerName, fromTeam, toTeam) {
        let players = this.loadPlayers();
        const player = this.findPlayerByName(playerName);
        if (!player) {
            return { success: false, message: 'Jugador no encontrado' };
        }

        player.team = toTeam;
        player.status = 'active';
        this.savePlayers(players);

        // Registrar el traspaso
        this.addTransfer({
            playerName,
            playerTeam: toTeam,
            fromTeam: fromTeam || 'Sin equipo',
            toTeam,
            date: new Date().toISOString()
        });

        return { success: true, message: `${playerName} transferido de ${fromTeam} a ${toTeam}`, player };
    }

    static addTransfer(transferData) {
        const filePath = path.join(DATA_PATH, 'transfers.json');
        let transfers = [];
        
        try {
            if (fs.existsSync(filePath)) {
                transfers = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            }
        } catch (error) {
            transfers = [];
        }

        transfers.unshift({
            id: transfers.length + 1,
            ...transferData
        });

        fs.writeFileSync(filePath, JSON.stringify(transfers, null, 2), 'utf8');
    }

    static getTransfers(limit = 10) {
        const filePath = path.join(DATA_PATH, 'transfers.json');
        try {
            if (fs.existsSync(filePath)) {
                const transfers = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                return transfers.slice(0, limit);
            }
        } catch (error) {
            console.error('Error cargando transfers:', error);
        }
        return [];
    }

    // ESTADÍSTICAS
    static getTeamStats(teamName) {
        const players = this.loadPlayers();
        const teamPlayers = players.filter(p => p.team === teamName);
        
        return {
            totalPlayers: teamPlayers.length,
            totalGoals: teamPlayers.reduce((sum, p) => sum + (p.goals || 0), 0),
            totalAssists: teamPlayers.reduce((sum, p) => sum + (p.assists || 0), 0),
            topScorer: teamPlayers.sort((a, b) => (b.goals || 0) - (a.goals || 0))[0] || null
        };
    }
}

module.exports = Database;

