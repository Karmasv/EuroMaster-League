const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('actualizar-jugadores')
        .setDescription('Actualizar lista de jugadores de un equipo')
        .addStringOption(option =>
            option.setName('equipo')
                .setDescription('Nombre del equipo')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('jugadores')
                .setDescription('Lista de jugadores (separados por coma)')
                .setRequired(true)),
    
    async execute(interaction) {
        const equipo = interaction.options.getString('equipo');
        const jugadoresStr = interaction.options.getString('jugadores');
        const jugadores = jugadoresStr.split(',').map(j => j.trim());
        
        const embed = new EmbedBuilder()
            .setColor(0x0066FF)
            .setTitle('🔄 JUGADORES ACTUALIZADOS')
            .setDescription(`**${equipo}** - ${jugadores.length} jugadores`)
            .addFields(
                { name: '🏆 Equipo', value: equipo, inline: true },
                { name: '👥 Total Jugadores', value: `${jugadores.length}`, inline: true },
                { name: '📋 Lista', value: jugadores.join('\n'), inline: false }
            )
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    }
};
