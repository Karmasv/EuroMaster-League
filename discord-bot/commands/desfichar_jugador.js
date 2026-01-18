const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Database = require('../utils/database');
const PermissionManager = require('../utils/permissions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('desfichar_jugador')
        .setDescription('Desfichar un jugador de tu equipo')
        .addStringOption(option =>
            option.setName('jugador')
                .setDescription('Nombre del jugador')
                .setRequired(true)),
    
    async execute(interaction) {
        // Solo managers y admins
        if (!PermissionManager.hasAdminPermission(interaction.member) && 
            !interaction.member.roles.cache.some(role => role.name.toLowerCase().includes('manager'))) {
            
            return await interaction.reply({
                content: '❌ Solo managers y admins pueden desfichar jugadores',
                ephemeral: true
            });
        }

        const jugador = interaction.options.getString('jugador');
        const player = Database.findPlayerByName(jugador);

        if (!player) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xFF0000)
                        .setTitle('❌ ERROR')
                        .setDescription(`El jugador "${jugador}" no existe`)
                ],
                ephemeral: true
            });
        }

        if (!player.team) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xFF9900)
                        .setTitle('⚠️ JUGADOR SIN EQUIPO')
                        .setDescription(`${jugador} no está fichado a ningún equipo`)
                ],
                ephemeral: true
            });
        }

        const result = Database.removePlayer(jugador);

        const embed = new EmbedBuilder()
            .setColor(0xFF6B6B)
            .setTitle('✅ JUGADOR DESFICHADO')
            .setDescription(`${jugador} ha sido desfichado de ${player.team}`)
            .addFields(
                { name: '👤 Jugador', value: jugador, inline: true },
                { name: '🏆 Equipo Anterior', value: player.team, inline: true },
                { name: '👨‍💼 Manager', value: interaction.user.tag, inline: true },
                { name: '📅 Fecha', value: new Date().toLocaleDateString('es-ES'), inline: true }
            )
            .setFooter({ text: 'El jugador puede ser fichado nuevamente' })
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    }
};
