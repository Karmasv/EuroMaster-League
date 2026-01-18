const GitHubDB = require('../githubDB.js');
const config = require('../config.js');

module.exports = {
  name: 'teams',
  description: 'Muestra los equipos de la liga',
  async execute(interaction) {
    try {
      const db = new GitHubDB();
      const teams = await db.get('teams');
      
      if (teams.length === 0) {
        return await interaction.reply('No hay equipos registrados.');
      }
      
      const teamsList = teams.map(t => `• ${t.name} (${t.points || 0} pts)`).join('\n');
      await interaction.reply(`**Equipos de la Liga:**\n${teamsList}`);
      
    } catch (error) {
      console.error('Error en comando teams:', error);
      await interaction.reply('Error al obtener equipos.');
    }
  }
};
