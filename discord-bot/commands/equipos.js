const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Database = require('../utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('equipos')
        .setDescription('Muestra información de los equipos')
        .addStringOption(option =>
            option.setName('equipo')
                .setDescription('Nombre del equipo (opcional)')
                .setRequired(false)),
    
    async execute(interaction) {
        const equipoNombre = interaction.options.getString('equipo');

        const teams = Database.loadTeams();

        if (equipoNombre) {
            // Mostrar equipo específico
            const team = Database.findTeamByName(equipoNombre);
            
            if (!team) {
                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(0xFF0000)
                            .setTitle('❌ EQUIPO NO ENCONTRADO')
                            .setDescription(`El equipo "${equipoNombre}" no existe`)
                    ]
                });
            }

            const players = Database.findTeamPlayers(team.name);
            
            const embed = new EmbedBuilder()
                .setColor(0x0066FF)
                .setTitle(`🏆 ${team.name.toUpperCase()}`)
                .addFields(
                    { name: '👥 Jugadores', value: players.length.toString(), inline: true },
                    { name: '⭐ Puntaje', value: team.points?.toString() || '0', inline: true }
                );

            if (players.length > 0) {
                const playersList = players.map((p, i) => `${i + 1}. ${p.name} (${p.goals || 0}G)`).join('\n');
                embed.addFields({ name: '📋 Plantilla', value: playersList });
            }

            embed.setTimestamp();
            
            return await interaction.reply({ embeds: [embed] });
        } else {
            // Mostrar lista de equipos
            const embed = new EmbedBuilder()
                .setColor(0x0066FF)
                .setTitle('🏆 EQUIPOS REGISTRADOS')
                .setDescription(`Total: ${teams.length} equipos`);

            teams.forEach(team => {
                const playerCount = Database.findTeamPlayers(team.name).length;
                embed.addFields({
                    name: team.name,
                    value: `👥 ${playerCount} jugadores | 📊 ${team.points || 0} puntos`,
                    inline: false
                });
            });

            embed.setTimestamp();
            
            return await interaction.reply({ embeds: [embed] });
        }
    }
};
