const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('desfichar')
        .setDescription('Desfichar un jugador de tu equipo')
        .addStringOption(option =>
            option.setName('jugador')
                .setDescription('Nombre del jugador a desfichar')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('equipo')
                .setDescription('Nombre de tu equipo')
                .setRequired(true)),
    
    async execute(interaction) {
        const jugador = interaction.options.getString('jugador');
        const equipo = interaction.options.getString('equipo');
        
        const embed = new EmbedBuilder()
            .setColor(0xFF4444)
            .setTitle('❌ JUGADOR DESFICHADO')
            .setDescription(`**${jugador}** ha sido desfichado de **${equipo}**`)
            .addFields(
                { name: '👤 Jugador', value: jugador, inline: true },
                { name: '🏆 Equipo', value: equipo, inline: true },
                { name: '📅 Fecha', value: new Date().toLocaleDateString('es-ES'), inline: true }
            )
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    }
};
