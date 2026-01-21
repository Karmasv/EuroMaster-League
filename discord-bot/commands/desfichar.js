const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Database = require('../utils/database');
const TransferManager = require('../utils/transfers');
const EMLEmbeds = require('../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('desfichar')
        .setDescription('Desvincular un jugador de un equipo')
        .addStringOption(option =>
            option.setName('jugador')
                .setDescription('Nombre del jugador a desfichar')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('razon')
                .setDescription('Motivo del desfichaje')
                .setRequired(false)),
    
    async execute(interaction) {
        const jugadorNombre = interaction.options.getString('jugador');
        const razon = interaction.options.getString('razon') || 'No especificada';

        // Cargar jugadores
        const players = Database.loadPlayers();
        const player = players.find(p => p.name.toLowerCase() === jugadorNombre.toLowerCase());

        if (!player) {
            return await interaction.reply({
                embeds: [EMLEmbeds.createErrorEmbed(`❌ El jugador "${jugadorNombre}" no está registrado`)],
                ephemeral: true
            });
        }

        if (!player.team) {
            return await interaction.reply({
                embeds: [EMLEmbeds.createErrorEmbed(`⚠️ ${jugadorNombre} no tiene equipo`)],
                ephemeral: true
            });
        }

        // Verificar equipo
        const teams = Database.loadTeams();
        const team = teams.find(t => t.name.toLowerCase() === player.team.toLowerCase());

        // Verificar permisos
        const isManager = team && team.managerId === interaction.user.id;
        const isAdmin = interaction.member.roles.cache.some(r => r.name.toLowerCase().includes('admin')) ||
                       interaction.member.roles.cache.some(r => r.name.toLowerCase().includes('owner'));

        if (!isManager && !isAdmin) {
            return await interaction.reply({
                embeds: [EMLEmbeds.createErrorEmbed('❌ Solo el manager del equipo puede desfichar jugadores')],
                ephemeral: true
            });
        }

        try {
            const equipoAnterior = player.team;

            // Desvincular jugador
            player.team = null;
            player.leftAt = new Date().toISOString();
            Database.savePlayers(players);

            // Registrar en transfers
            const transferResult = TransferManager.createTransfer({
                playerName: player.name,
                playerId: player.id?.toString(),
                fromTeam: equipoAnterior,
                toTeam: null,
                manager: interaction.user.tag,
                managerId: interaction.user.id,
                reason: razon
            });

            const transfer = transferResult.transfer;

            // Crear embed de confirmación
            const embed = new EmbedBuilder()
                .setColor(0xFF4444)
                .setTitle('🦶 JUGADOR DESFICHADO')
                .setDescription(`**${player.name}** ha sido desfichado de **${equipoAnterior}**`)
                .addFields(
                    { name: '👤 Jugador', value: player.name, inline: true },
                    { name: '🏆 Equipo anterior', value: equipoAnterior, inline: true },
                    { name: '👨‍💼 Manager', value: interaction.user.tag, inline: true },
                    { name: '📝 Razón', value: razon, inline: true },
                    { name: '📅 Fecha', value: new Date().toLocaleDateString('es-ES'), inline: true }
                )
                .setFooter({ text: 'EuroMaster League' })
                .setTimestamp();

            // Botón de confirmación
            const buttons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('Confirmar')
                        .setStyle(ButtonStyle.Success)
                        .setEmoji('✅')
                        .setCustomId(`desfichar_confirm_${player.id}`)
                );

            await interaction.reply({ embeds: [embed], components: [buttons] });

            console.log(`🦶 ${player.name} desfichado de ${equipoAnterior} por ${interaction.user.tag}`);

        } catch (error) {
            console.error('Error desfichando:', error);
            await interaction.reply({
                embeds: [EMLEmbeds.createErrorEmbed(`❌ Error al desfichar: ${error.message}`)],
                ephemeral: true
            });
        }
    }
};

