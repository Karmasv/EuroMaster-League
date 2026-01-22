const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Database = require('../utils/database');
const TransferManager = require('../utils/transfers');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ofertas')
        .setDescription('Muestra las ofertas de transferencia pendientes')
        .addStringOption(option =>
            option.setName('estado')
                .setDescription('Filtrar por estado')
                .setRequired(false)
                .addChoices(
                    { name: 'Pendientes', value: 'pending' },
                    { name: 'Aceptadas', value: 'accepted' },
                    { name: 'Rechazadas', value: 'rejected' },
                    { name: 'Expiradas', value: 'expired' }
                )),
    
    async execute(interaction) {
        const estado = interaction.options.getString('estado') || 'pending';
        const transfers = TransferManager.getAllTransfers();
        
        // Filtrar por estado
        let filteredTransfers = transfers.filter(t => t.status === estado);
        
        // Si no hay filtradas, mostrar todas las del estado solicitado
        if (filteredTransfers.length === 0) {
            const allTransfers = TransferManager.getAllTransfers();
            filteredTransfers = allTransfers.filter(t => t.status === estado);
        }

        // Obtener transferencias pendientes si es el caso
        if (estado === 'pending') {
            filteredTransfers = TransferManager.getPendingTransfers();
        }

        const embed = new EmbedBuilder()
            .setColor(estado === 'pending' ? 0xFFAA00 : 
                      estado === 'accepted' ? 0x00FF88 : 
                      estado === 'rejected' ? 0xFF0000 : 0x808080)
            .setTitle(`📋 OFERTAS DE TRANSFERENCIA`)
            .setDescription(`**Estado:** ${getStatusEmoji(estado)} ${getStatusText(estado)}`)
            .setTimestamp();

        if (filteredTransfers.length === 0) {
            embed.setDescription(`📭 No hay ofertas ${getStatusText(estado).toLowerCase()}`);
        } else {
            embed.setFooter({ text: `Total: ${filteredTransfers.length} ofertas | EuroMaster League` });

            filteredTransfers.slice(0, 10).forEach((transfer, index) => {
                const expiresAt = new Date(transfer.expiresAt);
                const now = new Date();
                const timeLeft = expiresAt > now ? 
                    Math.ceil((expiresAt - now) / (1000 * 60 * 60)) + 'h' : 
                    'Expirada';

                embed.addFields({
                    name: `🔄 Transferencia ${index + 1}`,
                    value: `**${transfer.playerName}**\n📤 ${transfer.fromTeam || 'Sin equipo'} → 📥 ${transfer.toTeam}\n👤 Manager: ${transfer.manager}\n⏰ Expira: ${timeLeft}\n🆔 \`ID: ${transfer.id}\``,
                    inline: false
                });
            });
        }

        // Botones para acciones rápidas
        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Ver Todas')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('📋')
                    .setCustomId('view_all'),
                new ButtonBuilder()
                    .setLabel('Aceptar Oferta')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('✅')
                    .setCustomId('accept_offer'),
                new ButtonBuilder()
                    .setLabel('Rechazar Oferta')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('❌')
                    .setCustomId('reject_offer')
            );

        await interaction.reply({ embeds: [embed], components: [buttons], ephemeral: false });
    }
};

function getStatusEmoji(status) {
    const emojis = {
        'pending': '⏳',
        'accepted': '✅',
        'rejected': '❌',
        'expired': '⏰',
        'cancelled': '🚫'
    };
    return emojis[status] || '❓';
}

function getStatusText(status) {
    const texts = {
        'pending': 'Pendientes',
        'accepted': 'Aceptadas',
        'rejected': 'Rechazadas',
        'expired': 'Expiradas',
        'cancelled': 'Canceladas'
    };
    return texts[status] || 'Desconocido';
}

