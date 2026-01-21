const EMLEmbeds = require('../utils/embeds');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member, client) {
        // Ignorar si no hay canal de logs
        const logChannelId = process.env.LOG_CHANNEL_ID;
        if (!logChannelId) return;

        const logChannel = client.channels.cache.get(logChannelId);
        if (!logChannel) return;

        try {
            const embed = EMLEmbeds.createMemberLogEmbed('join', member);

            await logChannel.send({ embeds: [embed] });

            console.log(`👋 Member joined: ${member.user.tag}`);

        } catch (error) {
            console.error('Error en guildMemberAdd:', error);
        }
    }
};

