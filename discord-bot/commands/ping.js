const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Revisa la latencia del bot'),
    
    async execute(interaction) {
        const sent = await interaction.deferReply({ fetchReply: true });
        
        const latency = sent.createdTimestamp - interaction.createdTimestamp;
        const apiLatency = Math.round(interaction.client.ws.ping);
        
        const embed = new EmbedBuilder()
            .setColor(0x00FF88)
            .setTitle('🏓 Pong!')
            .addFields(
                { name: '📡 Latencia', value: `${latency}ms`, inline: true },
                { name: '🌐 API', value: `${apiLatency}ms`, inline: true },
                { name: '⏱️ Uptime', value: formatUptime(interaction.client.uptime), inline: true }
            )
            .setTimestamp();
        
        await interaction.editReply({ embeds: [embed] });
    }
};

function formatUptime(uptime) {
    const seconds = Math.floor(uptime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    return `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`;
}
