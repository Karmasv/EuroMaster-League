const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Database = require('../utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('jornada')
        .setDescription('Muestra los partidos de una jornada específica')
        .addIntegerOption(option =>
            option.setName('numero')
                .setDescription('Número de jornada (1, 2, 3...)')
                .setRequired(false)),
    
    async execute(interaction) {
        const jornada = interaction.options.getInteger('numero');
        const matches = Database.loadMatches();

        if (matches.length === 0) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xFF9900)
                        .setTitle('⚠️ SIN PARTIDOS')
                        .setDescription('No hay partidos en la base de datos')
                ]
            });
        }

        // Si no se especifica jornada, mostrar última jornada
        const jornadaNum = jornada || 1;
        const matchesPerJornada = 5; // Asumiendo 5 partidos por jornada

        const startIndex = (jornadaNum - 1) * matchesPerJornada;
        const endIndex = startIndex + matchesPerJornada;
        const jornadaMatches = matches.slice(startIndex, endIndex);

        const embed = new EmbedBuilder()
            .setColor(0xFFD700)
            .setTitle(`📊 JORNADA ${jornadaNum}`)
            .setDescription(jornadaMatches.length > 0 ? 
                `Partidos de la jornada ${jornadaNum}` : 
                'No hay partidos en esta jornada')
            .setTimestamp();

        if (jornadaMatches.length === 0) {
            // Mostrar últimos partidos jugados
            const completedMatches = matches.filter(m => m.status === 'completed').slice(-5);
            
            if (completedMatches.length > 0) {
                embed.setDescription('📋 Últimos partidos jugados');
                completedMatches.forEach(match => {
                    const score = `${match.goals1 || 0} - ${match.goals2 || 0}`;
                    embed.addFields({
                        name: `${match.team1 || 'TBD'} vs ${match.team2 || 'TBD'}`,
                        value: `⚽ ${score} | 📅 ${new Date(match.date).toLocaleDateString('es-ES')}`,
                        inline: false
                    });
                });
            }
        } else {
            jornadaMatches.forEach((match, index) => {
                let matchInfo;
                
                if (match.status === 'completed') {
                    const score = `${match.goals1 || 0} - ${match.goals2 || 0}`;
                    matchInfo = `⚽ **${score}** (FINALIZADO)`;
                } else if (match.status === 'live') {
                    matchInfo = `🔴 **EN VIVO** - ${match.goals1 || 0} - ${match.goals2 || 0}`;
                } else {
                    const date = match.date || 'Fecha no definida';
                    const time = match.time || '';
                    matchInfo = `⏳ **PROGRAMADO** - ${date} ${time}`;
                }

                embed.addFields({
                    name: `⚽ Partido ${index + 1}`,
                    value: matchInfo,
                    inline: false
                });
            });
        }

        embed.setFooter({ text: `Total jornadas: ${Math.ceil(matches.length / matchesPerJornada)} | EuroMaster League` });

        await interaction.reply({ embeds: [embed] });
    }
};

