const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Database = require('../utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roster')
        .setDescription('Muestra la plantilla de un equipo')
        .addStringOption(option =>
            option.setName('equipo')
                .setDescription('Nombre del equipo')
                .setRequired(true)),
    
    async execute(interaction) {
        const equipoNombre = interaction.options.getString('equipo');
        
        // Buscar equipo
        const teams = Database.loadTeams();
        const team = teams.find(t => t.name.toLowerCase() === equipoNombre.toLowerCase());
        
        if (!team) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xFF0000)
                        .setTitle('❌ EQUIPO NO ENCONTRADO')
                        .setDescription(`No se encontró el equipo "${equipoNombre}"`)
                ],
                ephemeral: true
            });
        }

        // Obtener jugadores del equipo
        const allPlayers = Database.loadPlayers();
        const teamPlayers = allPlayers.filter(p => 
            p.team && p.team.toLowerCase() === team.name.toLowerCase()
        );

        // Calcular estadísticas del equipo
        const totalGoals = teamPlayers.reduce((sum, p) => sum + (p.goals || 0), 0);
        const totalAssists = teamPlayers.reduce((sum, p) => sum + (p.assists || 0), 0);
        const topScorer = teamPlayers.sort((a, b) => (b.goals || 0) - (a.goals || 0))[0] || null;
        const yellowCards = teamPlayers.reduce((sum, p) => sum + (p.yellowCards || 0), 0);
        const redCards = teamPlayers.reduce((sum, p) => sum + (p.redCards || 0), 0);

        const embed = new EmbedBuilder()
            .setColor(team.color ? parseInt(team.color.replace('#', '0x')) : 0x0099FF)
            .setTitle(`📋 PLANTILLA: ${team.name.toUpperCase()}`)
            .setDescription(`**Abreviatura:** \`[${team.abbreviation}]\``)
            .setThumbnail(team.logoUrl || interaction.guild.iconURL({ dynamic: true }))
            .addFields(
                { name: '👥 Jugadores', value: teamPlayers.length.toString(), inline: true },
                { name: '⚽ Goles Totales', value: totalGoals.toString(), inline: true },
                { name: '🎯 Asistencias Totales', value: totalAssists.toString(), inline: true },
                { name: '🟨 Amarillas', value: yellowCards.toString(), inline: true },
                { name: '🟥 Rojas', value: redCards.toString(), inline: true },
                { name: '⭐ Goleador', value: topScorer ? `${topScorer.name} (${topScorer.goals || 0}G)` : 'N/A', inline: true }
            )
            .setFooter({ text: `Manager: ${team.manager || 'No especificado'} | EuroMaster League` })
            .setTimestamp();

        if (teamPlayers.length === 0) {
            embed.addFields({
                name: '📝 Plantilla',
                value: '⚠️ Este equipo no tiene jugadores aún',
                inline: false
            });
        } else {
            // Ordenar por goles
            const sortedPlayers = [...teamPlayers].sort((a, b) => (b.goals || 0) - (a.goals || 0));
            
            // Crear lista de jugadores
            let playersList = '';
            sortedPlayers.forEach((player, index) => {
                const playerGoals = player.goals || 0;
                const playerAssists = player.assists || 0;
                const contributions = playerGoals + playerAssists;
                playersList += `${index + 1}. **${player.name}** - ${playerGoals}G ${playerAssists}A (${contributions}⭐)\n`;
            });

            embed.addFields({
                name: '📝 Jugadores',
                value: playersList,
                inline: false
            });
        }

        // Botón para ver más info
        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Ver Equipo')
                    .setStyle(ButtonStyle.Link)
                    .setEmoji('🏆')
                    .setURL(`https://discord.com/channels/${interaction.guild.id}/${team.channelId || interaction.channel.id}`)
            );

        await interaction.reply({ embeds: [embed], components: [buttons] });
    }
};

