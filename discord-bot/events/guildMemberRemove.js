const EMLEmbeds = require('../utils/embeds');

module.exports = {
    name: 'guildMemberRemove',
    async execute(member, client) {
        // Ignorar si no hay canal de logs
        const logChannelId = process.env.LOG_CHANNEL_ID;
        if (!logChannelId) return;

        const logChannel = client.channels.cache.get(logChannelId);
        if (!logChannel) return;

        try {
            const embed = EMLEmbeds.createMemberLogEmbed('leave', member);

            await logChannel.send({ embeds: [embed] });

            console.log(`👋 Member left: ${member.user.tag}`);

        } catch (error) {
            console.error('Error en guildMemberRemove:', error);
        }
    }
};

