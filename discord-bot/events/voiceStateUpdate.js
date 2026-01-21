const EMLEmbeds = require('../utils/embeds');

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState, client) {
        // Ignorar si no hay canal de logs
        const logChannelId = process.env.LOG_CHANNEL_ID;
        if (!logChannelId) return;

        const logChannel = client.channels.cache.get(logChannelId);
        if (!logChannel) return;

        // Ignorar cambios del bot
        if (newState.member?.user?.bot) return;

        try {
            // Verificar si hay un cambio significativo
            const hasChanges = 
                !oldState.channelId && newState.channelId || // Conexión
                oldState.channelId && !newState.channelId || // Desconexión
                oldState.channelId !== newState.channelId || // Cambio de canal
                oldState.selfMute !== newState.selfMute ||   // Silencio
                oldState.selfDeaf !== newState.selfDeaf ||   // Sordina
                oldState.selfVideo !== newState.selfVideo;   // Video

            if (!hasChanges) return;

            const embed = EMLEmbeds.createVoiceLogEmbed(oldState, newState);

            await logChannel.send({ embeds: [embed] });

            console.log(`🔊 Voice update: ${newState.member?.user?.tag}`);

        } catch (error) {
            console.error('Error en voiceStateUpdate:', error);
        }
    }
};

