const EMLEmbeds = require('../utils/embeds');

module.exports = {
    name: 'guildMemberUpdate',
    async execute(oldMember, newMember, client) {
        // Ignorar si no hay canal de logs
        const logChannelId = process.env.LOG_CHANNEL_ID;
        if (!logChannelId) return;

        const logChannel = client.channels.cache.get(logChannelId);
        if (!logChannel) return;

        try {
            // Verificar cambios de roles
            const oldRoles = oldMember.roles.cache.map(r => r.id);
            const newRoles = newMember.roles.cache.map(r => r.id);

            const addedRoles = newRoles.filter(r => !oldRoles.includes(r));
            const removedRoles = oldRoles.filter(r => !newRoles.includes(r));

            // Log de roles añadidos
            if (addedRoles.length > 0) {
                const addedRoleObjects = addedRoles.map(id => newMember.guild.roles.cache.get(id)).filter(Boolean);
                for (const role of addedRoleObjects) {
                    const embed = EMLEmbeds.createMemberLogEmbed('roleadd', newMember);
                    embed.addFields({ name: '🎭 Rol añadido', value: role.name, inline: true });
                    await logChannel.send({ embeds: [embed] });
                }
            }

            // Log de roles removidos
            if (removedRoles.length > 0) {
                const removedRoleObjects = removedRoles.map(id => newMember.guild.roles.cache.get(id)).filter(Boolean);
                for (const role of removedRoleObjects) {
                    const embed = EMLEmbeds.createMemberLogEmbed('roleremove', newMember);
                    embed.addFields({ name: '🎭 Rol removido', value: role.name, inline: true });
                    await logChannel.send({ embeds: [embed] });
                }
            }

            // Verificar cambio de apodo
            if (oldMember.nickname !== newMember.nickname) {
                const embed = EMLEmbeds.createMemberLogEmbed('nickchange', newMember);
                embed.addFields(
                    { name: '📝 Anterior', value: oldMember.nickname || 'Sin apodo', inline: true },
                    { name: '📝 Nuevo', value: newMember.nickname || 'Sin apodo', inline: true }
                );
                await logChannel.send({ embeds: [embed] });
            }

            console.log(`👥 Member update: ${newMember.user.tag}`);

        } catch (error) {
            console.error('Error en guildMemberUpdate:', error);
        }
    }
};

