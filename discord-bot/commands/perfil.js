const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Database = require('../utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('perfil')
        .setDescription('Muestra el perfil completo de un jugador')
        .addStringOption(option =>
            option.setName('jugador')
                .setDescription('Nombre del jugador')
                .setRequired(false)),
    
    async execute(interaction) {
        const nombre = interaction.options.getString('jugador');
        const players = Database.loadPlayers();
        
        let player;
        
        if (nombre) {
            player = players.find(p => p.name.toLowerCase() === nombre.toLowerCase());
            
            if (!player) {
                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(0xFF0000)
                            .setTitle('❌ JUGADOR NO ENCONTRADO')
                            .setDescription(`No se encontró el jugador "${nombre}"`)
                    ],
                    ephemeral: true
                });
            }
        } else {
            player = players.find(p => p.discordId === interaction.user.id);
            
            if (!player) {
                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(0xFF9900)
                            .setTitle('⚠️ NO REGISTRADO')
                            .setDescription('No estás registrado en la liga. Usa `/registrar-jugador` primero.')
                    ],
                    ephemeral: true
                });
            }
        }

        const team = player.team || '🚫 Sin equipo';
        const goals = player.goals || 0;
        const assists = player.assists || 0;
        const yellowCards = player.yellowCards || 0;
        const redCards = player.redCards || 0;
        const contributions = goals + assists;

        // Calcular promedio por partido (asumiendo partidos jugados)
        const matchesPlayed = goals + assists + yellowCards + redCards || 1;
        const goalRatio = (goals / matchesPlayed).toFixed(2);

        // Obtener ranking
        const sortedByGoals = [...players].sort((a, b) => (b.goals || 0) - (a.goals || 0));
        const goalsRank = sortedByGoals.findIndex(p => p.name === player.name) + 1;

        const sortedByContribs = [...players].sort((a, b) => ((b.goals || 0) + (b.assists || 0)) - ((a.goals || 0) + (a.assists || 0)));
        const contribRank = sortedByContribs.findIndex(p => p.name === player.name) + 1;

        // Determinar rango según contribuciones
        let rank = '🌑 Novato';
        if (contributions >= 50) rank = '👑 Leyenda';
        else if (contributions >= 30) rank = '⭐ Estrella';
        else if (contributions >= 20) rank = '🔥 Pro';
        else if (contributions >= 10) rank = '💎 Diamante';
        else if (contributions >= 5) rank = '🥉 Bronce';
        else if (contributions >= 1) rank = '🥈 Plata';

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`👤 ${player.name}`)
            .setDescription(rank)
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .addFields(
                { name: '━━━━━━━━━━━━━━━━━━━━━━━━', value: '━━━━━━━━━━━━━━━━━━━━━━━━', inline: false },
                { name: '🏠 Equipo Actual', value: team, inline: true },
                { name: '🎮 ID Haxball', value: player.haxballId || 'No especificado', inline: true },
                { name: '━━━━━━━━━━━━━━━━━━━━━━━━', value: '━━━━━━━━━━━━━━━━━━━━━━━━', inline: false },
                { name: '⚽ Goles', value: `**${goals}**`, inline: true },
                { name: '🎯 Asistencias', value: `**${assists}**`, inline: true },
                { name: '⭐ Contribuciones', value: `**${contributions}**`, inline: true },
                { name: '━━━━━━━━━━━━━━━━━━━━━━━━', value: '━━━━━━━━━━━━━━━━━━━━━━━━', inline: false },
                { name: '🟨 Amarillas', value: yellowCards.toString(), inline: true },
                { name: '🟥 Rojas', value: redCards.toString(), inline: true },
                { name: '📈 Ratio Goles', value: goalRatio, inline: true },
                { name: '━━━━━━━━━━━━━━━━━━━━━━━━', value: '━━━━━━━━━━━━━━━━━━━━━━━━', inline: false },
                { name: '🏆 Ranking Goles', value: `#${goalsRank} de ${players.length}`, inline: true },
                { name: '🏆 Ranking General', value: `#${contribRank} de ${players.length}`, inline: true },
                { name: '━━━━━━━━━━━━━━━━━━━━━━━━', value: '━━━━━━━━━━━━━━━━━━━━━━━━', inline: false },
                { name: '📅 Registrado', value: new Date(player.joinedAt).toLocaleDateString('es-ES'), inline: true },
                { name: '🆔 ID Discord', value: player.discordId ? `\`${player.discordId}\`` : 'N/A', inline: true }
            )
            .setFooter({ text: 'EuroMaster League - Haxball' })
            .setTimestamp();

        // Botón para ver estadísticas detalladas
        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Ver Stats')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('📊')
                    .setCustomId('view_stats'),
                new ButtonBuilder()
                    .setLabel('Ver Partidos')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('⚽')
                    .setCustomId('view_matches')
            );

        await interaction.reply({ embeds: [embed], components: [buttons] });
    }
};

