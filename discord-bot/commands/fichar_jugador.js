const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const PermissionManager = require('../utils/permissions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fichar_jugador')
        .setDescription('Fichar un jugador a tu equipo')
        .addStringOption(option =>
            option.setName('jugador')
                .setDescription('Nombre del jugador a fichar')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('equipo')
                .setDescription('Tu equipo')
                .setRequired(true)),
    
    async execute(interaction) {
        const Database = require('../utils/database');
        const jugador = interaction.options.getString('jugador');
        const equipo = interaction.options.getString('equipo');

        // Verificar que el usuario sea manager/owner del equipo
        const teams = Database.loadTeams();
        const teamData = Database.findTeamByName(equipo);

        if (!teamData) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xFF0000)
                        .setTitle('❌ ERROR')
                        .setDescription(`El equipo "${equipo}" no existe`)
                ],
                ephemeral: true
            });
        }

        // Si no es admin/owner, verificar que sea manager del equipo
        if (!PermissionManager.hasAdminPermission(interaction.member)) {
            // Aquí podrías agregar lógica para verificar roles de manager
            // Por ahora, solo admin puede fichar
            return await interaction.reply({
                content: '❌ Solo managers y admins pueden fichar jugadores',
                ephemeral: true
            });
        }

        const player = Database.findPlayerByName(jugador);
        if (!player) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xFF0000)
                        .setTitle('❌ ERROR')
                        .setDescription(`El jugador "${jugador}" no existe o no está registrado`)
                        .addFields(
                            { name: '💡 Ayuda', value: 'Asegúrate que el jugador se haya registrado con `/registrar_jugador`' }
                        )
                ],
                ephemeral: true
            });
        }

        if (player.team) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xFF9900)
                        .setTitle('⚠️ JUGADOR YA FICHADO')
                        .setDescription(`${jugador} ya pertenece a ${player.team}`)
                ],
                ephemeral: true
            });
        }

        // Fichar al jugador
        const result = Database.transferPlayer(jugador, 'Sin equipo', equipo);

        const embed = new EmbedBuilder()
            .setColor(0x00FF88)
            .setTitle('✅ JUGADOR FICHADO')
            .setDescription(`${jugador} ahora juega para ${equipo}`)
            .addFields(
                { name: '👤 Jugador', value: jugador, inline: true },
                { name: '🏆 Equipo', value: equipo, inline: true },
                { name: '👨‍💼 Manager', value: interaction.user.tag, inline: true },
                { name: '📅 Fecha', value: new Date().toLocaleDateString('es-ES'), inline: true }
            )
            .setFooter({ text: 'Sincronización en vivo activada' })
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });

        // Notificar al jugador si es posible
        try {
            const playerUser = await interaction.guild.members.fetch(player.discordId);
            if (playerUser) {
                const dmEmbed = new EmbedBuilder()
                    .setColor(0x00FF88)
                    .setTitle('🎉 ¡HAS SIDO FICHADO!')
                    .setDescription(`Bienvenido a **${equipo}** en EuroMaster League`)
                    .addFields(
                        { name: '👨‍💼 Manager', value: interaction.user.tag, inline: false }
                    )
                    .setTimestamp();
                
                await playerUser.send({ embeds: [dmEmbed] }).catch(() => {
                    // Si no se puede enviar DM, ignorar
                });
            }
        } catch (error) {
            // Ignorar errores al enviar DM
        }
    }
};
