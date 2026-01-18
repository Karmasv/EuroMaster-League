const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('registrar_equipo')
        .setDescription('Registrar un nuevo equipo en la liga')
        .addStringOption(option =>
            option.setName('nombre')
                .setDescription('Nombre del equipo')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('tag')
                .setDescription('Tag del equipo (3-4 letras)')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('dt')
                .setDescription('Director técnico del equipo')
                .setRequired(true)),
    
    async execute(interaction) {
        const nombre = interaction.options.getString('nombre');
        const tag = interaction.options.getString('tag').toUpperCase();
        const dt = interaction.options.getUser('dt');
        
        const embed = new EmbedBuilder()
            .setColor(0x00FF88)
            .setTitle('✅ EQUIPO REGISTRADO')
            .setDescription(`**${nombre} (${tag})** ha sido registrado en la liga`)
            .addFields(
                { name: '🏆 Equipo', value: nombre, inline: true },
                { name: '🏷️ Tag', value: tag, inline: true },
                { name: '👑 DT', value: `<@${dt.id}>`, inline: true },
                { name: '📅 Fecha', value: new Date().toLocaleDateString('es-ES'), inline: true },
                { name: '👨‍💼 Registrado por', value: interaction.user.tag, inline: false }
            )
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    }
};
