const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remover_arbitro')
        .setDescription('Remover árbitro de un partido')
        .addStringOption(option =>
            option.setName('partido')
                .setDescription('ID o nombre del partido')
                .setRequired(true)),
    
    async execute(interaction) {
        const partido = interaction.options.getString('partido');
        
        const embed = new EmbedBuilder()
            .setColor(0xFF4444)
            .setTitle('❌ ÁRBITRO REMOVIDO')
            .setDescription(`Se ha removido el árbitro del partido`)
            .addFields(
                { name: '🎮 Partido', value: partido, inline: true },
                { name: '📅 Fecha', value: new Date().toLocaleDateString('es-ES'), inline: true }
            )
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    }
};
