const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reglas')
        .setDescription('Muestra las reglas de la liga EuroMaster League'),
    
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0xFFD700)
            .setTitle('📜 REGLAS DE EUROMASTER LEAGUE')
            .setDescription('**Liga de Haxball en Discord**')
            .addFields(
                {
                    name: '⚽ REGLAS GENERALES',
                    value: `
1. ✅ Respeta a todos los miembros de la liga
2. ✅ Juega limpio y sin trampas
3. ✅ Reporta los resultados correctamente
4. ✅ Usa los canales adecuados para cada cosa
5. ❌ No insultes ni discrimines
6. ❌ No hagas spam en los canales
                    `,
                    inline: false
                },
                {
                    name: '🏆 SISTEMA DE PUNTOS',
                    value: `
• **Victoria:** 3 puntos
• **Empate:** 1 punto
• **Derrota:** 0 puntos
                    `,
                    inline: false
                },
                {
                    name: '⚠️ SANCIONES',
                    value: `
• 🟨 Segunda amarilla = 1 partido de suspensión
• 🟥 Tarjeta roja directa = 2 partidos de suspensión
• ⚠️ Comportamiento antideportivo = investigación del staff
                    `,
                    inline: false
                },
                {
                    name: '📋 REGLAS DE FICHAJES',
                    value: `
• Cada equipo puede tener máximo 8 jugadores
• Las transferencias son temporales (24 horas)
• Un jugador no puede estar en más de un equipo
• Los managers deben aceptar las ofertas
                    `,
                    inline: false
                },
                {
                    name: '🎮 REGLAS DE PARTIDOS',
                    value: `
• Los partidos deben jugarse en el horario acordado
• En caso de incomparecencia, el equipo presente gana 3-0
• Se requiere evidencia del resultado (screenshot)
• Los árbitros deben estar presentes en partidos oficiales
                    `,
                    inline: false
                },
                {
                    name: '👨‍💼 STAFF',
                    value: `
Para dudas o problemas, contacta:
• Admins del servidor
• Managers de equipos
• Uso del comando \`/sugerencia\` para propuestas
                    `,
                    inline: false
                }
            )
            .setFooter({ text: '¿Dudas? Usa /ayuda o contacta a un admin' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};

