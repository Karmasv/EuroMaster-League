const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('transferencias')
        .setDescription('Muestra el mercado de transferencias'),
    
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0xFFAA00)
            .setTitle('💰 MERCADO DE TRANSFERENCIAS')
            .setDescription('Jugadores disponibles para transferencia')
            .addFields(
                { name: '⚽ Delantero Star', value: '💰 Valor: $500k\n🏆 Equipo: Dragons\n📊 Rating: 8.5', inline: false },
                { name: '🛡️ Defensa Pro', value: '💰 Valor: $350k\n🏆 Equipo: Vikings\n📊 Rating: 7.8', inline: false },
                { name: '🧤 Portero Elite', value: '💰 Valor: $450k\n🏆 Equipo: Phoenix\n📊 Rating: 8.2', inline: false }
            )
            .setFooter({ text: 'Usa /oferta para hacer una oferta' })
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    }
};
