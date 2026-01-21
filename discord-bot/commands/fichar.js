const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Database = require('../utils/database');
const TransferManager = require('../utils/transfers');
const EMLEmbeds = require('../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fichar')
        .setDescription('Crear una oferta de fichaje para un jugador')
        .addStringOption(option =>
            option.setName('jugador')
                .setDescription('Nombre del jugador a fichar')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('equipo')
                .setDescription('Nombre del equipo')
                .setRequired(true)),
    
    async execute(interaction) {
        const jugadorNombre = interaction.options.getString('jugador');
        const equipoNombre = interaction.options.getString('equipo');

        // Verificar que el equipo existe
        const teams = Database.loadTeams();
        const team = teams.find(t => t.name.toLowerCase() === equipoNombre.toLowerCase());

        if (!team) {
            return await interaction.reply({
                embeds: [EMLEmbeds.createErrorEmbed(`❌ El equipo "${equipoNombre}" no existe`)],
                ephemeral: true
            });
        }

        // Verificar que es manager de ese equipo o es admin
        const isManager = team.managerId === interaction.user.id;
        const isAdmin = interaction.member.roles.cache.some(r => r.name.toLowerCase().includes('admin')) ||
                       interaction.member.roles.cache.some(r => r.name.toLowerCase().includes('owner'));

        if (!isManager && !isAdmin) {
            return await interaction.reply({
                embeds: [EMLEmbeds.createErrorEmbed('❌ Solo el manager del equipo puede fichar jugadores')],
                ephemeral: true
            });
        }

        // Verificar que el jugador existe (buscar por nombre)
        let players = Database.loadPlayers();
        let player = players.find(p => p.name.toLowerCase() === jugadorNombre.toLowerCase());

        if (!player) {
            return await interaction.reply({
                embeds: [EMLEmbeds.createErrorEmbed(`❌ El jugador "${jugadorNombre}" no está registrado`)],
                ephemeral: true
            });
        }

        // Verificar si ya tiene equipo
        if (player.team && player.team.toLowerCase() === equipoNombre.toLowerCase()) {
            return await interaction.reply({
                embeds: [EMLEmbeds.createErrorEmbed(`⚠️ ${jugadorNombre} ya está en ${team.name}`)],
                ephemeral: true
            });
        }

        // Verificar si ya tiene una transferencia pendiente
        const pendingTransfers = TransferManager.getPendingForPlayer(player.id || player.discordId);
        if (pendingTransfers.length > 0) {
            return await interaction.reply({
                embeds: [EMLEmbeds.createErrorEmbed(`⚠️ ${jugadorNombre} ya tiene una transferencia pendiente`)],
                ephemeral: true
            });
        }

        try {
            // Crear la transferencia
            const transferResult = TransferManager.createTransfer({
                playerName: player.name,
                playerId: player.id?.toString(),
                fromTeam: player.team || null,
                toTeam: team.name,
                manager: interaction.user.tag,
                managerId: interaction.user.id
            });

            if (!transferResult.success) {
                return await interaction.reply({
                    embeds: [EMLEmbeds.createErrorEmbed(`❌ ${transferResult.message}`)],
                    ephemeral: true
                });
            }

            const transfer = transferResult.transfer;

            // Crear embed de la oferta
            const embed = EMLEmbeds.createTransferOfferEmbed(transfer, team);
            
            // Crear botones
            const buttons = EMLEmbeds.createTransferButtons(transfer.id);

            // Responder al manager
            await interaction.reply({
                embeds: [embed],
                components: [buttons],
                ephemeral: false
            });

            // Si hay un usuario específico, notificarle (si tenemos su ID)
            if (player.discordId) {
                try {
                    const user = await interaction.client.users.fetch(player.discordId);
                    if (user) {
                        const dmEmbed = new EmbedBuilder()
                            .setColor(0xFFAA00)
                            .setTitle('⏳ OFERTA DE FICHAGE')
                            .setDescription(`Has recibido una oferta para unirte a **${team.name}**`)
                            .addFields(
                                { name: '👤 Manager', value: interaction.user.tag, inline: true },
                                { name: '📅 Expira', value: new Date(transfer.expiresAt).toLocaleString('es-ES'), inline: true }
                            )
                            .setTimestamp();

                        await user.send({ embeds: [dmEmbed, embed], components: [buttons] });
                    }
                } catch (e) {
                    console.log(`No se pudo enviar DM al jugador: ${e.message}`);
                }
            }

            console.log(`📝 Oferta de fichaje creada: ${jugadorNombre} -> ${team.name} por ${interaction.user.tag}`);

        } catch (error) {
            console.error('Error creando fichaje:', error);
            await interaction.reply({
                embeds: [EMLEmbeds.createErrorEmbed(`❌ Error al crear el fichaje: ${error.message}`)],
                ephemeral: true
            });
        }
    }
};

