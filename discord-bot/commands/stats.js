const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Database = require('../utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Muestra las estadísticas de un jugador')
        .addStringOption(option =>
            option.setName('jugador')
                .setDescription('Nombre del jugador')
                .setRequired(false)),
    
    async execute(interaction) {
        const nombre = interaction.options.getString('jugador');
        const players = Database.loadPlayers();
        
        let player;
        
        if (nombre) {
            // Buscar por nombre
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
            // Buscar por Discord ID del usuario
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

        const team = player.team || 'Sin equipo';
        const goals = player.goals || 0;
        const assists = player.assists || 0;
        const yellowCards = player.yellowCards || 0;
        const redCards = player.redCards || 0;
        const totalContribuciones = goals + assists;

        // Calcular posición en el ranking de goleadores
        const sortedByGoals = [...players].sort((a, b) => (b.goals || 0) - (a.goals || 0));
        const goalsRank = sortedByGoals.findIndex(p => p.name === player.name) + 1;

        // Calcular posición en el ranking de asistentes
        const sortedByAssists = [...players].sort((a, b) => (b.assists || 0) - (a.assists || 0));
        const assistsRank = sortedByAssists.findIndex(p => p.name === player.name) + 1;

        const embed = new EmbedBuilder()
            .setColor(0x00FF88)
            .setTitle(`📊 ESTADÍSTICAS DE ${player.name.toUpperCase()}`)
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .addFields(
                { name: '🏠 Equipo', value: team, inline: true },
                { name: '🎮 ID Haxball', value: player.haxballId || 'No especificado', inline: true },
                { name: '📅 Registro', value: new Date(player.joinedAt).toLocaleDateString('es-ES'), inline: true },
                { name: '━━━━━━━━━━━━━━━━', value: '━━━━━━━━━━━━━━━━', inline: false },
                { name: '⚽ Goles', value: goals.toString(), inline: true },
                { name: '🎯 Asistencias', value: assists.toString(), inline: true },
                { name: '👟 Contribuciones', value: totalContribuciones.toString(), inline: true },
                { name: '🟨 Amarillas', value: yellowCards.toString(), inline: true },
                { name: '🟥 Rojas', value: redCards.toString(), inline: true },
                { name: '━━━━━━━━━━━━━━━━', value: '━━━━━━━━━━━━━━━━', inline: false },
                { name: '🏆 Ranking Goles', value: `#${goalsRank} de ${players.length}`, inline: true },
                { name: '🏆 Ranking Asistencias', value: `#${assistsRank} de ${players.length}`, inline: true }
            )
            .setFooter({ text: 'EuroMaster League - Haxball' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};

