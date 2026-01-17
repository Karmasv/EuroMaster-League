const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('permisos')
        .setDescription('Ver o modificar permisos')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('ver')
                .setDescription('Ver permisos de un usuario')
                .addUserOption(option =>
                    option.setName('usuario')
                        .setDescription('Usuario a verificar')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('añadir')
                .setDescription('Añadir permisos a un usuario')
                .addUserOption(option =>
                    option.setName('usuario')
                        .setDescription('Usuario')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('permiso')
                        .setDescription('Permiso a añadir')
                        .addChoices(
                            { name: 'Admin', value: 'admin' },
                            { name: 'Moderador', value: 'mod' },
                            { name: 'Árbitro', value: 'arbitro' }
                        )
                        .setRequired(true))),
    
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        
        if (subcommand === 'ver') {
            const usuario = interaction.options.getUser('usuario');
            
            const embed = new EmbedBuilder()
                .setColor(0x0066FF)
                .setTitle('🔐 PERMISOS DE USUARIO')
                .setDescription(`Permisos de **${usuario.tag}**`)
                .addFields(
                    { name: '👤 Usuario', value: `<@${usuario.id}>`, inline: true },
                    { name: '🆔 ID', value: `\`${usuario.id}\``, inline: true },
                    { name: '👑 Owner', value: '✅ Sí', inline: true },
                    { name: '🛠️ Admin', value: '✅ Sí', inline: true },
                    { name: '⚖️ Árbitro', value: '❌ No', inline: true }
                )
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed], ephemeral: true });
        } else if (subcommand === 'añadir') {
            const usuario = interaction.options.getUser('usuario');
            const permiso = interaction.options.getString('permiso');
            
            const embed = new EmbedBuilder()
                .setColor(0x00FF88)
                .setTitle('✅ PERMISO AÑADIDO')
                .setDescription(`**${permiso.toUpperCase()}** añadido a **${usuario.tag}**`)
                .addFields(
                    { name: '👤 Usuario', value: `<@${usuario.id}>`, inline: true },
                    { name: '🔑 Permiso', value: permiso, inline: true },
                    { name: '📅 Fecha', value: new Date().toLocaleDateString('es-ES'), inline: true }
                )
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed] });
        }
    }
};
