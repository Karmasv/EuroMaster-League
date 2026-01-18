const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Database = require('../utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('jugadores')
        .setDescription('Muestra los jugadores de un equipo o todos')
        .addStringOption(option =>
            option.setName('equipo')
                .setDescription('Nombre del equipo (opcional)')
                .setRequired(false)),
    
    async execute(interaction) {
        const equipoNombre = interaction.options.getString('equipo');
        const players = Database.loadPlayers();

        let filteredPlayers = players;

        if (equipoNombre) {
            filteredPlayers = players.filter(p => p.team.toLowerCase() === equipoNombre.toLowerCase());
            
            if (filteredPlayers.length === 0) {
                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(0xFF0000)
                            .setTitle('❌ NO HAY JUGADORES')
                            .setDescription(`No se encontraron jugadores en ${equipoNombre}`)
                    ]
                });
            }
        }

        // Ordenar por goles
        filteredPlayers.sort((a, b) => (b.goals || 0) - (a.goals || 0));

        // Paginar si hay muchos
        const chunks = [];
        for (let i = 0; i < filteredPlayers.length; i += 10) {
            chunks.push(filteredPlayers.slice(i, i + 10));
        }

        const embed = new EmbedBuilder()
            .setColor(0x00AAFF)
            .setTitle(equipoNombre ? `👥 JUGADORES - ${equipoNombre.toUpperCase()}` : '👥 TODOS LOS JUGADORES')
            .setDescription(`Total: ${filteredPlayers.length} jugadores`);

        chunks[0].forEach((player, index) => {
            embed.addFields({
                name: `${index + 1}. ${player.name}`,
                value: `⚽ ${player.goals || 0} goles | 🎯 ${player.assists || 0} asistencias | 🏠 ${player.team}`,
                inline: false
            });
        });

        if (chunks.length > 1) {
            embed.setFooter({ text: `Página 1 de ${chunks.length}` });
        }

        embed.setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    }
};
