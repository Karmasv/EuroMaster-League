const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../utils/githubDB');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('result')
        .setDescription('Registrar resultado de partido')
        .addStringOption(option => option
            .setName('match_id')
            .setDescription('ID del partido')
            .setRequired(true))
        .addIntegerOption(option => option
            .setName('score_home')
            .setDescription('Puntuación del equipo local')
            .setRequired(true))
        .addIntegerOption(option => option
            .setName('score_away')
            .setDescription('Puntuación del equipo visitante')
            .setRequired(true))
        .addStringOption(option => option
            .setName('mvp1')
            .setDescription('Primer jugador MVP')
            .setRequired(false))
        .addStringOption(option => option
            .setName('mvp2')
            .setDescription('Segundo jugador MVP')
            .setRequired(false))
        .addStringOption(option => option
            .setName('notes')
            .setDescription('Notas adicionales')
            .setRequired(false)),
    
    async execute(interaction) {
        const matchId = interaction.options.getString('match_id');
        const scoreHome = interaction.options.getInteger('score_home');
        const scoreAway = interaction.options.getInteger('score_away');
        const mvp1 = interaction.options.getString('mvp1');
        const mvp2 = interaction.options.getString('mvp2');
        const notes = interaction.options.getString('notes');
        
        // Buscar partido
        const matches = db.getMatches();
        const match = matches.find(m => m.id === matchId);
        
        if (!match) {
            return interaction.reply({
                content: '❌ No se encontró el partido con ese ID',
                ephemeral: true
            });
        }
        
        if (match.status === 'completed') {
            return interaction.reply({
                content: '⚠️ Este partido ya tiene un resultado registrado',
                ephemeral: true
            });
        }
        
        // Preparar MVPs
        const mvps = [];
        if (mvp1) mvps.push(mvp1);
        if (mvp2) mvps.push(mvp2);
        
        // Actualizar resultado
        const resultData = {
            homeScore: scoreHome,
            awayScore: scoreAway,
            mvps: mvps,
            notes: notes,
            status: 'completed',
            completedAt: new Date().toISOString(),
            reportedBy: interaction.user.tag,
            reportedById: interaction.user.id
        };
        
        const updatedMatch = db.updateMatchResult(matchId, resultData);
        
        if (!updatedMatch) {
            return interaction.reply({
                content: '❌ Error al actualizar el resultado',
                ephemeral: true
            });
        }
        
        // Crear embed de resultado
        const embed = new EmbedBuilder()
            .setColor(0x00FF88)
            .setTitle('⚽ RESULTADO REGISTRADO')
            .setDescription(`**${match.homeTeam} ${scoreHome} - ${scoreAway} ${match.awayTeam}**`)
            .addFields(
                { name: '🏆 Torneo', value: match.tournament, inline: true },
                { name: '📅 Fecha', value: match.date, inline: true },
                { name: '📝 Reportado por', value: interaction.user.tag, inline: true },
                { name: '⭐ MVP', value: mvps.length > 0 ? mvps.join(', ') : 'No especificado', inline: false }
            )
            .setTimestamp();
        
        if (notes) {
            embed.addFields({ name: '📌 Notas', value: notes, inline: false });
        }
        
        await interaction.reply({ 
            content: `✅ Resultado registrado para el partido \`${matchId}\``,
            embeds: [embed] 
        });
        
        // Actualizar standings automáticamente
        setTimeout(() => {
            db.updateStandings();
        }, 1000);
    }
};