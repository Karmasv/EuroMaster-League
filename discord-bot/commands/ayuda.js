const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ayuda')
        .setDescription('Muestra los comandos disponibles'),
    
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0xd4af37)
            .setTitle('📚 COMANDOS DISPONIBLES - EuroMaster League')
            .setDescription('Aquí están todos los comandos disponibles en la liga de Haxball')
            .addFields(
                {
                    name: '👤 REGISTRO Y PERFIL',
                    value: '`/registrar-jugador` - Registrarse en la liga\n`/perfil` - Ver tu perfil de jugador\n`/stats` - Ver estadísticas detalladas',
                    inline: false
                },
                {
                    name: '⭐ RANKINGS',
                    value: '`/top` - Top 10 goleadores\n`/top goleadores` - Ver mejores goleadores\n`/top asistentes` - Mejores asistentes',
                    inline: false
                },
                {
                    name: '🏆 EQUIPOS',
                    value: '`/crear-equipo` - Crear equipo (Manager)\n`/equipos` - Ver todos los equipos\n`/roster` - Ver plantilla de un equipo',
                    inline: false
                },
                {
                    name: '🔄 TRANSFERENCIAS',
                    value: '`/fichar` - Crear oferta de fichaje\n`/desfichar` - Desvincular jugador\n`/ofertas` - Ver ofertas pendientes\n`/transferencias` - Historial de transferencias',
                    inline: false
                },
                {
                    name: '⚽ PARTIDOS',
                    value: '`/resultado` - Registrar resultado (Admin)\n`/match create` - Programar partido\n`/clasificacion` - Ver tabla de posiciones\n`/calendario` - Ver partidos programados\n`/jornada` - Ver partidos por jornada\n`/historial` - Ver historial de partidos',
                    inline: false
                },
                {
                    name: '👨‍💼 Árbitros y Staff',
                    value: '`/asignar-arbitro` - Asignar árbitro (Admin)\n`/remover-arbitro` - Quitar árbitro (Admin)\n`/reglas` - Ver reglas de la liga',
                    inline: false
                },
                {
                    name: '❓ UTILIDADES',
                    value: '`/ping` - Ver latencia del bot\n`/ayuda` - Ver este mensaje\n`/permisos` - Ver tus permisos',
                    inline: false
                }
            )
            .addFields(
                {
                    name: '🎯 FLUJO BÁSICO PARA JUGADORES',
                    value: '1. 📝 `/registrar-jugador` - Regístrate en la liga\n2. 👀 Espera a que un manager te fiche\n3. ⚽ `/perfil` - Revisa tu perfil\n4. 📊 `/stats` - Sigue tus estadísticas\n5. 🏆 `/top` - Compite en los rankings',
                    inline: false
                },
                {
                    name: '🎯 FLUJO BÁSICO PARA MANAGERS',
                    value: '1. 🏆 `/crear-equipo` - Crea tu equipo\n2. 🔄 `/fichar` - Fichar jugadores\n3. 📋 `/roster` - Ver tu plantilla\n4. ⚽ `/match create` - Programar partidos\n5. 📊 `/clasificacion` - Ver posición en la liga',
                    inline: false
                }
            )
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setFooter({ text: '¿Preguntas? Contacta con un admin | EuroMaster League - Haxball' })
            .setTimestamp();

        // Botones para acceso rápido
        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Reglas')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('📜')
                    .setCustomId('btn_reglas'),
                new ButtonBuilder()
                    .setLabel('Clasificación')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('🏆')
                    .setCustomId('btn_clasificacion'),
                new ButtonBuilder()
                    .setLabel('Top Jugadores')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('⭐')
                    .setCustomId('btn_top'),
                new ButtonBuilder()
                    .setLabel('Calendario')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('📅')
                    .setCustomId('btn_calendario')
            );

        await interaction.reply({ embeds: [embed], components: [buttons] });
    }
};

