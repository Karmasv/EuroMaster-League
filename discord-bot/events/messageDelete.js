const EMLEmbeds = require('../utils/embeds');
const Logger = require('../utils/logger');

module.exports = {
    name: 'messageDelete',
    async execute(message, client) {
        // Ignorar mensajes de bots
        if (message.author?.bot) return;

        // Ignorar si no hay canal de logs
        const logChannelId = process.env.LOG_CHANNEL_ID;
        if (!logChannelId) return;

        const logChannel = client.channels.cache.get(logChannelId);
        if (!logChannel) return;

        try {
            // Buscar quien eliminó el mensaje (si es posible)
            let executor = null;
            
            // Crear embed de log
            const embed = EMLEmbeds.createMessageDeleteEmbed(message, executor);

            await logChannel.send({ embeds: [embed] });

            // Log adicional
            console.log(`💬 Mensaje eliminado de ${message.author?.tag} en #${message.channel?.name}`);

        } catch (error) {
            console.error('Error en messageDelete:', error);
        }
    }
};

