const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('añadir_owner')
        .setDescription('Añadir un nuevo owner al bot')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuario a añadir como owner')
                .setRequired(true)),
    
    async execute(interaction) {
        const usuario = interaction.options.getUser('usuario');
        
        const embed = new EmbedBuilder()
            .setColor(0x00FF88)
            .setTitle('👑 NUEVO OWNER AÑADIDO')
            .setDescription(`**${usuario.tag}** es ahora owner del bot`)
            .addFields(
                { name: '👤 Usuario', value: `<@${usuario.id}>`, inline: true },
                { name: '🆔 ID', value: `\`${usuario.id}\``, inline: true },
                { name: '📅 Fecha', value: new Date().toLocaleDateString('es-ES'), inline: true }
            )
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    }
};
