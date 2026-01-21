const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const GitHubDB = require('../utils/githubDB');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('teams')
    .setDescription('Muestra los equipos de la liga'),
  
  async execute(interaction) {
    try {
      const db = new GitHubDB();
      const teams = db.getTeams();
      
      if (teams.length === 0) {
        return await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(0xFF9900)
              .setTitle('⚠️ SIN EQUIPOS')
              .setDescription('No hay equipos registrados en la liga')
          ]
        });
      }
      
      const embed = new EmbedBuilder()
        .setColor(0x0066FF)
        .setTitle('🏆 EQUIPOS DE LA LIGA')
        .setDescription(`Total: ${teams.length} equipos`)
        .setTimestamp();
      
      teams.forEach((team, index) => {
        const points = (team.stats?.wins || 0) * 3 + (team.stats?.draws || 0);
        embed.addFields({
          name: `${index + 1}. ${team.name}`,
          value: `📊 ${points} pts | ${team.stats?.wins || 0}G ${team.stats?.draws || 0}E ${team.stats?.losses || 0}P`,
          inline: false
        });
      });
      
      await interaction.reply({ embeds: [embed] });
      
    } catch (error) {
      console.error('Error en comando teams:', error);
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('❌ ERROR')
            .setDescription('Error al obtener equipos')
        ]
      });
    }
  }
};

