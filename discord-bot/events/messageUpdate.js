const EMLEmbeds = require('../utils/embeds');

module.exports = {
    name: 'messageUpdate',
    async execute(oldMessage, newMessage, client) {
        // Ignorar mensajes de bots
        if (oldMessage.author?.bot) return;

        // Ignorar si no hay cambios de contenido
        if (oldMessage.content === newMessage.content) return;

        // Ignorar si no hay canal de logs
        const logChannelId = process.env.LOG_CHANNEL_ID;
        if (!logChannelId) return;

        const logChannel = client.channels.cache.get(logChannelId);
        if (!logChannel) return;

        try {
            const embed = EMLEmbeds.createMessageEditEmbed(oldMessage, newMessage);

            await logChannel.send({ embeds: [embed] });

            console.log(`✏️ Mensaje editado de ${oldMessage.author?.tag} en #${oldMessage.channel?.name}`);

        } catch (error) {
            console.error('Error en messageUpdate:', error);
        }
    }
};

