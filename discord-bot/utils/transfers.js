const Database = require('./database');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const path = require('path');
const fs = require('fs');

class TransferManager {
    static TRANSFERS_PATH = path.join(__dirname, '../../data/transfers.json');

    // Colores para estados
    static getStatusColor(status) {
        const colors = {
            pending: 0xFFAA00,    // Naranja
            accepted: 0x00FF88,   // Verde
            rejected: 0xFF4444,   // Rojo
            expired: 0x808080     // Gris
        };
        return colors[status] || 0x0099FF;
    }

    // Emoji para estados
    static getStatusEmoji(status) {
        const emojis = {
            pending: '⏳',
            accepted: '✅',
            rejected: '❌',
            expired: '⏰'
        };
        return emojis[status] || '📋';
    }

    // Crear embed de oferta de fichaje
    static createOfferEmbed(transfer, team) {
        const embed = new EmbedBuilder()
            .setColor(this.getStatusColor(transfer.status))
            .setTitle(`${this.getStatusEmoji(transfer.status)} OFERTA DE FICHAGE`)
            .setDescription(`Nueva oferta para **${transfer.playerName}**`)
            .addFields(
                { name: '👤 Jugador', value: transfer.playerName, inline: true },
                { name: '🏆 Equipo', value: transfer.toTeam, inline: true },
                { name: '📊 Tag', value: `\`[${team?.abbreviation || '???'}]\``, inline: true },
                { name: '👨‍💼 Manager', value: transfer.manager, inline: true },
                { name: '📅 Creado', value: new Date(transfer.date).toLocaleDateString('es-ES'), inline: true },
                { name: '⏰ Expira', value: new Date(transfer.expiresAt).toLocaleDateString('es-ES'), inline: true }
            )
            .setFooter({ text: `ID: ${transfer.id} | EuroMaster League` })
            .setTimestamp();

        if (team?.logoUrl) {
            embed.setThumbnail(team.logoUrl);
        }

        return embed;
    }

    // Crear botones para la oferta
    static createOfferButtons(transferId) {
        return new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`transfer_accept_${transferId}`)
                    .setLabel('Aceptar')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('✅'),
                new ButtonBuilder()
                    .setCustomId(`transfer_reject_${transferId}`)
                    .setLabel('Rechazar')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('❌')
            );
    }

    // Crear embed de estado actualizado
    static createStatusEmbed(transfer, status) {
        const embed = new EmbedBuilder()
            .setColor(this.getStatusColor(status))
            .setTitle(`${this.getStatusEmoji(status)} TRANSFERENCIA ${status.toUpperCase()}`)
            .setDescription(`Detalles de la transferencia`)
            .addFields(
                { name: '👤 Jugador', value: transfer.playerName, inline: true },
                { name: '📍 De', value: transfer.fromTeam || 'Sin equipo', inline: true },
                { name: '📍 Hacia', value: transfer.toTeam, inline: true },
                { name: '👨‍💼 Manager', value: transfer.manager, inline: true },
                { name: '📅 Fecha', value: new Date(transfer.date).toLocaleString('es-ES'), inline: true }
            )
            .setFooter({ text: `ID: ${transfer.id} | EuroMaster League` })
            .setTimestamp();

        return embed;
    }

    // Procesar aceptación de transferencia
    static async acceptTransfer(transferId, interaction) {
        const transfers = this.loadTransfers();
        const transfer = transfers.find(t => t.id === transferId);

        if (!transfer) {
            return { success: false, message: 'Transferencia no encontrada' };
        }

        if (transfer.status !== 'pending') {
            return { success: false, message: 'La transferencia ya no está pendiente' };
        }

        // Actualizar estado
        transfer.status = 'accepted';
        transfer.acceptedAt = new Date().toISOString();
        transfer.acceptedBy = interaction.user.tag;

        // Actualizar jugador
        const players = Database.loadPlayers();
        const player = players.find(p => p.name.toLowerCase() === transfer.playerName.toLowerCase());

        if (player) {
            player.team = transfer.toTeam;
            player.joinedAt = new Date().toISOString();
            Database.savePlayers(players);
        }

        // Guardar
        this.saveTransfers(transfers);

        return { 
            success: true, 
            transfer,
            message: `${transfer.playerName} ahora es parte de ${transfer.toTeam}`
        };
    }

    // Procesar rechazo de transferencia
    static async rejectTransfer(transferId, interaction) {
        const transfers = this.loadTransfers();
        const transfer = transfers.find(t => t.id === transferId);

        if (!transfer) {
            return { success: false, message: 'Transferencia no encontrada' };
        }

        if (transfer.status !== 'pending') {
            return { success: false, message: 'La transferencia ya no está pendiente' };
        }

        // Actualizar estado
        transfer.status = 'rejected';
        transfer.rejectedAt = new Date().toISOString();
        transfer.rejectedBy = interaction.user.tag;
        transfer.rejectReason = 'Rechazado por el jugador';

        // Guardar
        this.saveTransfers(transfers);

        return { 
            success: true, 
            transfer,
            message: `Transferencia de ${transfer.playerName} rechazada`
        };
    }

    // Expira transferencias antiguas
    static expireOldTransfers() {
        const transfers = this.loadTransfers();
        const now = new Date();
        let expiredCount = 0;

        transfers.forEach(transfer => {
            if (transfer.status === 'pending' && new Date(transfer.expiresAt) < now) {
                transfer.status = 'expired';
                transfer.expiredAt = now.toISOString();
                expiredCount++;
            }
        });

        if (expiredCount > 0) {
            this.saveTransfers(transfers);
            console.log(`⏰ ${expiredCount} transferencias expiradas`);
        }

        return expiredCount;
    }

    // Cargar transfers
    static loadTransfers() {
        try {
            if (fs.existsSync(this.TRANSFERS_PATH)) {
                return JSON.parse(fs.readFileSync(this.TRANSFERS_PATH, 'utf8'));
            }
        } catch (error) {
            console.error('Error cargando transfers:', error);
        }
        return [];
    }

    // Guardar transfers
    static saveTransfers(transfers) {
        fs.writeFileSync(this.TRANSFERS_PATH, JSON.stringify(transfers, null, 2), 'utf8');
    }

    // Obtener historial de un jugador
    static getPlayerHistory(playerName) {
        const transfers = this.loadTransfers();
        return transfers.filter(t => 
            t.playerName.toLowerCase() === playerName.toLowerCase()
        ).sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // Obtener historial de un equipo
    static getTeamHistory(teamName) {
        const transfers = this.loadTransfers();
        return transfers.filter(t => 
            t.toTeam.toLowerCase() === teamName.toLowerCase() ||
            t.fromTeam?.toLowerCase() === teamName.toLowerCase()
        ).sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // Obtener transfers pendientes de un jugador
    static getPendingForPlayer(playerId) {
        const transfers = this.loadTransfers();
        return transfers.filter(t => 
            t.playerId === playerId && t.status === 'pending'
        );
    }
}

module.exports = TransferManager;

