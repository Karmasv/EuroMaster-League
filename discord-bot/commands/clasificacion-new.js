const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Database = require('../utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clasificacion')
        .setDescription('Muestra la clasificación actual'),
    
    async execute(interaction) {
        const standings = Database.loadStandings();

        if (standings.length === 0) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xFF9900)
                        .setTitle('⚠️ CLASIFICACIÓN VACÍA')
                        .setDescription('No hay datos de clasificación aún')
                ]
            });
        }

        // Ordenar por puntos
        standings.sort((a, b) => b.points - a.points);

        const embed = new EmbedBuilder()
            .setColor(0xFFD700)
            .setTitle('🏆 CLASIFICACIÓN GENERAL')
            .setDescription('Estado actual de la liga');

        standings.forEach((team, index) => {
            const goalDiff = team.goalsFor - team.goalsAgainst;
            const goalDiffStr = goalDiff > 0 ? `+${goalDiff}` : goalDiff.toString();
            
            embed.addFields({
                name: `${index + 1}. ${team.team}`,
                value: `PJ: ${team.played} | G: ${team.wins} E: ${team.draws} P: ${team.losses} | GF: ${team.goalsFor} GC: ${team.goalsAgainst} | DG: ${goalDiffStr} | **PTS: ${team.points}**`,
                inline: false
            });
        });

        embed.setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    }
};
