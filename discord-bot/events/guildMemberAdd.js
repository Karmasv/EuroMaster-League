const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildMemberAdd',
    once: false,

    async execute(member, client) {
        try {
            // Mensaje de bienvenida privado
            const welcomeEmbed = new EmbedBuilder()
                .setColor(0xd4af37)
                .setTitle('👑 ¡BIENVENIDO A EUROMASTER LEAGUE!')
                .setDescription('La máxima competencia de Haxball en Ecuador')
                .addFields(
                    {
                        name: '📝 PRIMER PASO: Registrarse',
                        value: 'Usa `/registrar-jugador` en el servidor con tu nombre en Haxball',
                        inline: false
                    },
                    {
                        name: '⚽ SEGUNDO PASO: Ser Fichado',
                        value: 'Un manager te agregará a su equipo usando `/fichar`',
                        inline: false
                    },
                    {
                        name: '🎮 COMANDOS PRINCIPALES',
                        value: '`/equipos` - Ver equipos\n`/jugadores` - Ver jugadores\n`/clasificacion` - Ver tabla',
                        inline: false
                    },
                    {
                        name: '💬 CONTACTO',
                        value: 'Únete a nuestro servidor de Discord para más información',
                        inline: false
                    }
                )
                .setFooter({ text: 'EuroMaster League 2026' })
                .setTimestamp();

            await member.send({ embeds: [welcomeEmbed] });

            // Mensaje en el canal si existe
            const guild = member.guild;
            const channelId = process.env.WELCOME_CHANNEL_ID;
            
            if (channelId) {
                const channel = guild.channels.cache.get(channelId);
                if (channel) {
                    const channelEmbed = new EmbedBuilder()
                        .setColor(0xd4af37)
                        .setTitle('🎉 NUEVO JUGADOR')
                        .setDescription(`${member.user.tag} se ha unido a la liga`)
                        .addFields(
                            { name: '👤 Usuario', value: member.user.username, inline: true },
                            { name: '📅 Fecha', value: new Date().toLocaleDateString('es-ES'), inline: true }
                        )
                        .setThumbnail(member.user.displayAvatarURL())
                        .setTimestamp();

                    await channel.send({ embeds: [channelEmbed] });
                }
            }

        } catch (error) {
            console.error('Error en evento guildMemberAdd:', error);
        }
    }
};
