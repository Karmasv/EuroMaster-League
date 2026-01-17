const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('partido')
        .setDescription('Gestión de partidos')
        .addSubcommand(subcommand =>
            subcommand
                .setName('crear')
                .setDescription('Crear nuevo partido')
                .addStringOption(option =>
                    option.setName('local')
                        .setDescription('Equipo local')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('visitante')
                        .setDescription('Equipo visitante')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('fecha')
                        .setDescription('Fecha (DD/MM/YYYY)')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('hora')
                        .setDescription('Hora (HH:MM CET)')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('resultado')
                .setDescription('Registrar resultado de partido')
                .addStringOption(option =>
                    option.setName('id')
                        .setDescription('ID del partido')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName('goles_local')
                        .setDescription('Goles equipo local')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName('goles_visitante')
                        .setDescription('Goles equipo visitante')
                        .setRequired(true))),
    
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        
        if (subcommand === 'crear') {
            const local = interaction.options.getString('local');
            const visitante = interaction.options.getString('visitante');
            const fecha = interaction.options.getString('fecha');
            const hora = interaction.options.getString('hora');
            const partidoId = `MATCH-${Date.now().toString().slice(-6)}`;
            
            const embed = new EmbedBuilder()
                .setColor(0x0066FF)
                .setTitle('✅ PARTIDO PROGRAMADO')
                .setDescription(`**${local} vs ${visitante}**`)
                .addFields(
                    { name: '🏠 Local', value: local, inline: true },
                    { name: '✈️ Visitante', value: visitante, inline: true },
                    { name: '📅 Fecha', value: fecha, inline: true },
                    { name: '⏰ Hora', value: hora, inline: true },
                    { name: '🆔 ID', value: `\`${partidoId}\``, inline: true },
                    { name: '📋 Estado', value: '⏳ Programado', inline: true }
                )
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed] });
            
        } else if (subcommand === 'resultado') {
            const partidoId = interaction.options.getString('id');
            const golesLocal = interaction.options.getInteger('goles_local');
            const golesVisitante = interaction.options.getInteger('goles_visitante');
            
            const embed = new EmbedBuilder()
                .setColor(0x00FF88)
                .setTitle('⚽ RESULTADO REGISTRADO')
                .setDescription(`**Partido ${partidoId}**`)
                .addFields(
                    { name: '🏠 Local', value: `${golesLocal} goles`, inline: true },
                    { name: '✈️ Visitante', value: `${golesVisitante} goles`, inline: true },
                    { name: '🏆 Resultado', value: `${golesLocal} - ${golesVisitante}`, inline: true },
                    { name: '📅 Fecha', value: new Date().toLocaleDateString('es-ES'), inline: true },
                    { name: '👨‍💼 Reportado por', value: interaction.user.tag, inline: false }
                )
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed] });
        }
    }
};
