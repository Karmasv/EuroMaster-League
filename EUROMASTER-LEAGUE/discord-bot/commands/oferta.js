const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('oferta')
        .setDescription('Hacer una oferta por un jugador')
        .addStringOption(option =>
            option.setName('jugador')
                .setDescription('Nombre del jugador')
                .setRequired(true))
        .addNumberOption(option =>
            option.setName('monto')
                .setDescription('Monto de la oferta')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('equipo')
                .setDescription('Tu equipo')
                .setRequired(true)),
    
    async execute(interaction) {
        const jugador = interaction.options.getString('jugador');
        const monto = interaction.options.getNumber('monto');
        const equipo = interaction.options.getString('equipo');
        
        const embed = new EmbedBuilder()
            .setColor(0x00FF88)
            .setTitle('💸 OFERTA ENVIADA')
            .setDescription(`**${equipo}** ofrece por **${jugador}**`)
            .addFields(
                { name: '👤 Jugador', value: jugador, inline: true },
                { name: '💰 Oferta', value: `$${monto.toLocaleString()}`, inline: true },
                { name: '🏆 Equipo', value: equipo, inline: true },
                { name: '📅 Fecha', value: new Date().toLocaleDateString('es-ES'), inline: true },
                { name: '⏳ Estado', value: '⏳ Pendiente de respuesta', inline: false }
            )
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    }
};
