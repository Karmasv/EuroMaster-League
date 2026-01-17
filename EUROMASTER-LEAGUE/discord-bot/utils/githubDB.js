const fs = require('fs');
const path = require('path');

class GitHubDB {
    constructor() {
        this.dataPath = path.join(__dirname, '../../data');
        this.ensureDataFiles();
    }
    
    ensureDataFiles() {
        if (!fs.existsSync(this.dataPath)) {
            fs.mkdirSync(this.dataPath, { recursive: true });
        }
        
        const files = {
            'matches.json': { matches: [], lastUpdated: new Date().toISOString() },
            'teams.json': { teams: [], lastUpdated: new Date().toISOString() },
            'players.json': { players: [], lastUpdated: new Date().toISOString() },
            'standings.json': { standings: [], season: "EML Season 1", lastUpdated: new Date().toISOString() },
            'config.json': { 
                season: "EML Season 1",
                currentRound: 1,
                lastUpdated: new Date().toISOString()
            }
        };
        
        Object.entries(files).forEach(([filename, defaultData]) => {
            const filePath = path.join(this.dataPath, filename);
            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
            }
        });
    }
    
    // ===== MÉTODOS BÁSICOS =====
    readData(file) {
        try {
            const filePath = path.join(this.dataPath, file);
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error(`Error leyendo ${file}:`, error);
            return null;
        }
    }
    
    writeData(file, data) {
        try {
            const filePath = path.join(this.dataPath, file);
            const dataWithTimestamp = {
                ...data,
                lastUpdated: new Date().toISOString()
            };
            fs.writeFileSync(filePath, JSON.stringify(dataWithTimestamp, null, 2));
            return true;
        } catch (error) {
            console.error(`Error escribiendo ${file}:`, error);
            return false;
        }
    }
    
    // ===== MÉTODOS PARA PARTIDOS =====
    getMatches() {
        const data = this.readData('matches.json');
        return data?.matches || [];
    }
    
    addMatch(matchData) {
        const data = this.readData('matches.json');
        const newMatch = {
            id: `M${Date.now()}`,
            ...matchData,
            createdAt: new Date().toISOString()
        };
        
        data.matches.push(newMatch);
        this.writeData('matches.json', data);
        return newMatch;
    }
    
    updateMatchResult(matchId, resultData) {
        const data = this.readData('matches.json');
        const matchIndex = data.matches.findIndex(m => m.id === matchId);
        
        if (matchIndex === -1) return null;
        
        data.matches[matchIndex] = {
            ...data.matches[matchIndex],
            ...resultData
        };
        
        this.writeData('matches.json', data);
        return data.matches[matchIndex];
    }
    
    // ===== MÉTODOS PARA EQUIPOS =====
    getTeams() {
        const data = this.readData('teams.json');
        return data?.teams || [];
    }
    
    addTeam(teamData) {
        const data = this.readData('teams.json');
        const newTeam = {
            id: `T${Date.now()}`,
            ...teamData
        };
        
        data.teams.push(newTeam);
        this.writeData('teams.json', data);
        return newTeam;
    }
    
    // ===== MÉTODOS PARA JUGADORES =====
    getPlayers() {
        const data = this.readData('players.json');
        return data?.players || [];
    }
    
    addPlayer(playerData) {
        const data = this.readData('players.json');
        const newPlayer = {
            id: `P${Date.now()}`,
            ...playerData
        };
        
        data.players.push(newPlayer);
        this.writeData('players.json', data);
        return newPlayer;
    }
    
    // ===== MÉTODOS PARA STANDINGS =====
    updateStandings() {
        const teams = this.getTeams();
        const matches = this.getMatches().filter(m => m.status === 'completed');
        
        // Resetear estadísticas
        teams.forEach(team => {
            team.stats = {
                wins: 0,
                losses: 0,
                draws: 0,
                goalsFor: 0,
                goalsAgainst: 0,
                points: 0
            };
        });
        
        // Calcular estadísticas basadas en partidos
        matches.forEach(match => {
            const homeTeam = teams.find(t => 
                t.name === match.homeTeam || t.id === match.homeTeamId
            );
            const awayTeam = teams.find(t => 
                t.name === match.awayTeam || t.id === match.awayTeamId
            );
            
            if (!homeTeam || !awayTeam) return;
            
            // Goles
            const homeScore = match.homeScore || 0;
            const awayScore = match.awayScore || 0;
            
            homeTeam.stats.goalsFor += homeScore;
            homeTeam.stats.goalsAgainst += awayScore;
            awayTeam.stats.goalsFor += awayScore;
            awayTeam.stats.goalsAgainst += homeScore;
            
            // Resultado
            if (homeScore > awayScore) {
                homeTeam.stats.wins += 1;
                awayTeam.stats.losses += 1;
            } else if (awayScore > homeScore) {
                awayTeam.stats.wins += 1;
                homeTeam.stats.losses += 1;
            } else {
                homeTeam.stats.draws += 1;
                awayTeam.stats.draws += 1;
            }
        });
        
        // Calcular puntos
        teams.forEach(team => {
            team.stats.points = (team.stats.wins * 3) + (team.stats.draws * 1);
        });
        
        // Ordenar por puntos
        const standings = teams.sort((a, b) => {
            if (b.stats.points !== a.stats.points) {
                return b.stats.points - a.stats.points;
            }
            const diffA = a.stats.goalsFor - a.stats.goalsAgainst;
            const diffB = b.stats.goalsFor - b.stats.goalsAgainst;
            return diffB - diffA;
        });
        
        // Guardar standings
        this.writeData('standings.json', {
            standings: standings,
            season: "EML Season 1",
            lastUpdated: new Date().toISOString()
        });
        
        // Actualizar equipos
        this.writeData('teams.json', { teams: teams, lastUpdated: new Date().toISOString() });
        
        return standings;
    }
}

module.exports = new GitHubDB();