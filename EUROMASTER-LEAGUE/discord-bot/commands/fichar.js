const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fichar')
        .setDescription('Fichar un jugador a tu equipo')
        .addStringOption(option =>
            option.setName('jugador')
                .setDescription('Nombre del jugador a fichar')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('equipo')
                .setDescription('Nombre de tu equipo')
                .setRequired(true)),
    
    async execute(interaction) {
        const jugador = interaction.options.getString('jugador');
        const equipo = interaction.options.getString('equipo');
        
        // Aquí iría la lógica para fichar al jugador en la base de datos
        
        const embed = new EmbedBuilder()
            .setColor(0x00FF88)
            .setTitle('✅ JUGADOR FICHADO')
            .setDescription(`**${jugador}** ha sido fichado por **${equipo}**`)
            .addFields(
                { name: '👤 Jugador', value: jugador, inline: true },
                { name: '🏆 Equipo', value: equipo, inline: true },
                { name: '📅 Fecha', value: new Date().toLocaleDateString('es-ES'), inline: true },
                { name: '👨‍💼 Manager', value: interaction.user.tag, inline: false }
            )
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    }
};
