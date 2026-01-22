const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Database = require('../utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('calendario')
        .setDescription('Muestra el calendario de partidos de la liga'),
    
    async execute(interaction) {
        const matches = Database.loadMatches();

        if (matches.length === 0) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xFF9900)
                        .setTitle('⚠️ SIN PARTIDOS')
                        .setDescription('No hay partidos programados en la liga')
                ]
            });
        }

        // Filtrar solo partidos programados
        const scheduledMatches = matches.filter(m => m.status === 'scheduled' || !m.status);
        
        // Ordenar por fecha
        scheduledMatches.sort((a, b) => {
            const dateA = new Date(a.date || a.createdAt);
            const dateB = new Date(b.date || b.createdAt);
            return dateA - dateB;
        });

        const embed = new EmbedBuilder()
            .setColor(0x00FF88)
            .setTitle('📅 CALENDARIO DE PARTIDOS')
            .setDescription(`Próximos ${Math.min(10, scheduledMatches.length)} partidos`)
            .setTimestamp();

        if (scheduledMatches.length === 0) {
            embed.setDescription('📭 No hay partidos programados');
        } else {
            scheduledMatches.slice(0, 10).forEach((match, index) => {
                const date = match.date || new Date(match.createdAt).toLocaleDateString('es-ES');
                const time = match.time || 'Hora no definida';
                const tournament = match.tournament || 'Partido Amistoso';
                
                embed.addFields({
                    name: `⚽ Partido ${index + 1}`,
                    value: `**${match.homeTeam || 'TBD'}** vs **${match.awayTeam || 'TBD'}**\n📅 ${date} a las ${time}\n🏆 ${tournament}`,
                    inline: false
                });
            });
        }

        embed.setFooter({ text: `Total partidos programados: ${scheduledMatches.length} | EuroMaster League` });

        await interaction.reply({ embeds: [embed] });
    }
};

