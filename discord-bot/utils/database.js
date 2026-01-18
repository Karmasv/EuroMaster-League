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

    // MÉTODOS DE UTILIDAD
    static findTeamByName(name) {
        const teams = this.loadTeams();
        return teams.find(t => t.name.toLowerCase() === name.toLowerCase());
    }

    static findPlayerByName(name) {
        const players = this.loadPlayers();
        return players.find(p => p.name.toLowerCase() === name.toLowerCase());
    }

    static findTeamPlayers(teamName) {
        const players = this.loadPlayers();
        return players.filter(p => p.team.toLowerCase() === teamName.toLowerCase());
    }

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
        const DATA_PATH = require('path').join(__dirname, '../../data');
        const fs = require('fs');
        const path = require('path');
        
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
        const DATA_PATH = require('path').join(__dirname, '../../data');
        const fs = require('fs');
        const path = require('path');
        
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
}

module.exports = Database;
