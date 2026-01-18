const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('equipos')
        .setDescription('Muestra información de los equipos')
        .addStringOption(option =>
            option.setName('equipo')
                .setDescription('Nombre del equipo (opcional)')
                .setRequired(false)),
    
    async execute(interaction) {
        const equipoNombre = interaction.options.getString('equipo');
        
        if (equipoNombre) {
            // Mostrar equipo específico
            const embed = new EmbedBuilder()
                .setColor(0x0066FF)
                .setTitle(`🏆 ${equipoNombre.toUpperCase()}`)
                .addFields(
                    { name: '👑 DT', value: 'Por definir', inline: true },
                    { name: '👥 Jugadores', value: '0', inline: true },
                    { name: '📊 Partidos', value: '0W - 0D - 0L', inline: true },
                    { name: '⭐ Estrellas', value: '★★☆☆☆', inline: true }
                )
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed] });
        } else {
            // Mostrar lista de equipos
            const embed = new EmbedBuilder()
                .setColor(0x0066FF)
                .setTitle('🏆 EQUIPOS REGISTRADOS')
                .setDescription('Lista de equipos en la liga')
                .addFields(
                    { name: '1. Dragons', value: '👑 DT: Karmasv\n👥 8 jugadores', inline: false },
                    { name: '2. Vikings', value: '👑 DT: Por asignar\n👥 5 jugadores', inline: false },
                    { name: '3. Phoenix', value: '👑 DT: Por asignar\n👥 6 jugadores', inline: false }
                )
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed] });
        }
    }
};
