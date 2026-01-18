const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ayuda')
        .setDescription('Muestra los comandos disponibles'),
    
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0xd4af37)
            .setTitle('📚 COMANDOS DISPONIBLES - EuroMaster League')
            .setDescription('Aquí están todos los comandos disponibles en la liga')
            .addFields(
                {
                    name: '👤 JUGADORES',
                    value: '`/registrar_jugador` - Registrarse en la liga\n`/jugadores` - Ver lista de jugadores\n`/clasificacion` - Ver tabla de posiciones',
                    inline: false
                },
                {
                    name: '🏆 EQUIPOS',
                    value: '`/crear_equipo` - Crear un equipo (Manager/Admin)\n`/equipos` - Ver equipos\n`/fichar_jugador` - Fichar jugador a tu equipo\n`/desfichar_jugador` - Desfichar jugador',
                    inline: false
                },
                {
                    name: '⚽ PARTIDOS',
                    value: '`/resultado` - Registrar resultado de partido\n`/clasificacion` - Ver clasificación\n`/transferencia` - Registrar traspaso',
                    inline: false
                },
                {
                    name: '❓ OTRO',
                    value: '`/ping` - Ver latencia del bot\n`/ayuda` - Ver este mensaje',
                    inline: false
                }
            )
            .addFields(
                {
                    name: '🎯 FLUJO BÁSICO',
                    value: '1. Registrate con `/registrar_jugador`\n2. Espera a ser fichado por un equipo\n3. ¡Juega y sube de rango!',
                    inline: false
                }
            )
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setFooter({ text: '¿Preguntas? Contacta con un admin' })
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    }
};
