const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const DATA_PATH = path.join(__dirname, '../data');

// Helper para leer datos
function loadData(file) {
    try {
        const filePath = path.join(DATA_PATH, `${file}.json`);
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
        console.error(`Error leyendo ${file}:`, error);
        return [];
    }
}

// Helper para guardar datos
function saveData(file, data) {
    try {
        const filePath = path.join(DATA_PATH, `${file}.json`);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error(`Error guardando ${file}:`, error);
        return false;
    }
}

// ====== ENDPOINTS DE LECTURA ======

app.get('/api/teams', (req, res) => {
    const teams = loadData('teams');
    res.json(teams);
});

app.get('/api/players', (req, res) => {
    const players = loadData('players');
    res.json(players);
});

app.get('/api/matches', (req, res) => {
    const matches = loadData('matches');
    res.json(matches);
});

app.get('/api/standings', (req, res) => {
    const standings = loadData('standings');
    // Ordenar por puntos
    standings.sort((a, b) => b.points - a.points);
    res.json(standings);
});

// Get team by name
app.get('/api/teams/:name', (req, res) => {
    const teams = loadData('teams');
    const team = teams.find(t => t.name.toLowerCase() === req.params.name.toLowerCase());
    if (!team) {
        return res.status(404).json({ error: 'Team not found' });
    }
    
    const players = loadData('players');
    const teamPlayers = players.filter(p => p.team.toLowerCase() === team.name.toLowerCase());
    
    res.json({ ...team, players: teamPlayers });
});

// Get transfers (últimos traspasos)
app.get('/api/transfers', (req, res) => {
    try {
        const filePath = path.join(DATA_PATH, 'transfers.json');
        const transfers = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        res.json(transfers.slice(0, 20));
    } catch (error) {
        res.json([]);
    }
});

// Get top scorers
app.get('/api/top-scorers', (req, res) => {
    const players = loadData('players');
    const sorted = players.sort((a, b) => (b.goals || 0) - (a.goals || 0));
    res.json(sorted.slice(0, 10));
});

// Get top assists
app.get('/api/top-assists', (req, res) => {
    const players = loadData('players');
    const sorted = players.sort((a, b) => (b.assists || 0) - (a.assists || 0));
    res.json(sorted.slice(0, 10));
});

// ====== ENDPOINTS DE SINCRONIZACIÓN ======

// Recibir actualización de stats
app.post('/api/update-player-stats', (req, res) => {
    const { playerName, goals, assists, yellowCards, redCards } = req.body;

    let players = loadData('players');
    const player = players.find(p => p.name.toLowerCase() === playerName.toLowerCase());

    if (!player) {
        return res.status(404).json({ error: 'Player not found' });
    }

    if (goals !== undefined) player.goals = goals;
    if (assists !== undefined) player.assists = assists;
    if (yellowCards !== undefined) player.yellowCards = yellowCards;
    if (redCards !== undefined) player.redCards = redCards;

    if (saveData('players', players)) {
        res.json({ success: true, message: 'Stats actualizado', player });
    } else {
        res.status(500).json({ error: 'Error al guardar' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 API servidor escuchando en puerto ${PORT}`);
});

module.exports = app;
