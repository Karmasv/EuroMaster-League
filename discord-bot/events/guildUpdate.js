const { EmbedBuilder } = require('discord.js');
const EMLEmbeds = require('../utils/embeds');

module.exports = {
    name: 'guildUpdate',
    async execute(oldGuild, newGuild, client) {
        // Ignorar si no hay canal de logs
        const logChannelId = process.env.LOG_CHANNEL_ID;
        if (!logChannelId) return;

        const logChannel = client.channels.cache.get(logChannelId);
        if (!logChannel) return;

        try {
            // Detectar cambios en el servidor
            const changes = [];

            if (oldGuild.name !== newGuild.name) {
                changes.push(`Nombre: ${oldGuild.name} → ${newGuild.name}`);
            }

            if (oldGuild.icon !== newGuild.icon) {
                changes.push('Icono del servidor actualizado');
            }

            if (oldGuild.region !== newGuild.region) {
                changes.push(`Región: ${oldGuild.region} → ${newGuild.region}`);
            }

            if (changes.length === 0) return;

            const embed = new EmbedBuilder()
                .setColor(0xFFAA00)
                .setTitle('⚙️ SERVIDOR ACTUALIZADO')
                .setDescription(`Cambios en **${newGuild.name}**`)
                .addFields(
                    { name: '📝 Cambios', value: changes.join('\n'), inline: false },
                    { name: '🕐 Hora', value: new Date().toLocaleString('es-ES'), inline: true }
                )
                .setTimestamp()
                .setFooter({ text: 'EuroMaster League Logs' });

            await logChannel.send({ embeds: [embed] });

            console.log(`⚙️ Guild update: ${newGuild.name}`);

        } catch (error) {
            console.error('Error en guildUpdate:', error);
        }
    }
};

