// Configuración para GitHub DB
// En local: usa valores por defecto
// En Vercel: usa variables de entorno

const isBrowser = typeof window !== 'undefined';
const isVercel = process.env.VERCEL === '1';

const config = {
  // Token de GitHub (NUNCA lo pongas aquí directamente)
  // Configúralo en Environment Variables de Vercel
  token: isBrowser ? null : (process.env.GITHUB_TOKEN || ''),
  
  // Repositorio
  repo: process.env.GITHUB_REPO || 'Karmasv/EuroMaster-League',
  
  // Rama
  branch: process.env.GITHUB_BRANCH || 'main',
  
  // Rutas de archivos en el repo
  paths: {
    teams: 'data/teams.json',
    players: 'data/players.json',
    matches: 'data/matches.json',
    standings: 'data/standings.json'
  }
};

// Solo exportar en Node.js (para serverless functions)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = config;
}
