// Configuración del Bot de Discord
require('dotenv').config();

module.exports = {
  // Token del Bot de Discord (OBTENER EN: https://discord.com/developers/applications)
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  
  // ID del servidor (Guild) - Opcional para comandos slash
  GUILD_ID: process.env.GUILD_ID,
  
  // Configuración de GitHub DB
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  GITHUB_REPO: process.env.GITHUB_REPO || 'Karmasv/EuroMaster-League',
  GITHUB_BRANCH: process.env.GITHUB_BRANCH || 'main',
  
  // Prefijo de comandos
  PREFIX: process.env.PREFIX || '!',
  
  // IDs de administradores
  ADMIN_IDS: process.env.ADMIN_IDS ? process.env.ADMIN_IDS.split(',') : []
};
