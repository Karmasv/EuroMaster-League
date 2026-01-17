const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('asignar_arbitro')
        .setDescription('Asignar árbitro a un partido')
        .addStringOption(option =>
            option.setName('partido')
                .setDescription('ID o nombre del partido')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('arbitro')
                .setDescription('Usuario que será árbitro')
                .setRequired(true)),
    
    async execute(interaction) {
        const partido = interaction.options.getString('partido');
        const arbitro = interaction.options.getUser('arbitro');
        
        const embed = new EmbedBuilder()
            .setColor(0x0066FF)
            .setTitle('⚖️ ÁRBITRO ASIGNADO')
            .setDescription(`**${arbitro.tag}** será el árbitro del partido`)
            .addFields(
                { name: '🎮 Partido', value: partido, inline: true },
                { name: '👨‍⚖️ Árbitro', value: `<@${arbitro.id}>`, inline: true },
                { name: '📅 Fecha', value: new Date().toLocaleDateString('es-ES'), inline: true }
            )
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    }
};
