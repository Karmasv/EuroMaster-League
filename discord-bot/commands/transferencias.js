const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Database = require('../utils/database');
const PermissionManager = require('../utils/permissions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('transferencia')
        .setDescription('Registrar una transferencia de jugador')
        .addStringOption(option =>
            option.setName('jugador')
                .setDescription('Nombre del jugador')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('equipo_origen')
                .setDescription('Equipo de origen')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('equipo_destino')
                .setDescription('Equipo de destino')
                .setRequired(true)),
    
    async execute(interaction) {
        // Verificar permisos
        if (!PermissionManager.hasAdminPermission(interaction.member)) {
            return await interaction.reply({
                content: '❌ No tienes permisos para usar este comando',
                ephemeral: true
            });
        }

        const jugador = interaction.options.getString('jugador');
        const origen = interaction.options.getString('equipo_origen');
        const destino = interaction.options.getString('equipo_destino');

        const result = Database.transferPlayer(jugador, origen, destino);

        const embed = new EmbedBuilder()
            .setColor(result.success ? 0x00FF88 : 0xFF0000)
            .setTitle(result.success ? '✅ TRANSFERENCIA REGISTRADA' : '❌ ERROR')
            .setDescription(result.message)
            .addFields(
                { name: '👤 Jugador', value: jugador, inline: true },
                { name: '➡️ De', value: origen, inline: true },
                { name: '⬅️ Para', value: destino, inline: true },
                { name: '📅 Fecha', value: new Date().toLocaleDateString('es-ES'), inline: true }
            )
            .setFooter({ text: `Registrado por ${interaction.user.tag}` })
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    }
};
