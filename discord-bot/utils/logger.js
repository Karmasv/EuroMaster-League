// Sistema de Logging con Webhooks para DM
// Envía todos los eventos, comandos y acciones a través de webhooks

const { WebhookClient, EmbedBuilder } = require('discord.js');

class Logger {
    constructor() {
        this.webhookUrl = process.env.LOG_WEBHOOK_URL;
        this.webhookClient = null;
        this.userId = process.env.OWNER_ID;
        
        if (this.webhookUrl) {
            try {
                this.webhookClient = new WebhookClient({ url: this.webhookUrl });
                console.log('✅ Logger Webhook inicializado');
            } catch (error) {
                console.warn('⚠️ No se pudo inicializar el webhook de logging:', error.message);
            }
        } else {
            console.log('ℹ️ LOG_WEBHOOK_URL no configurado - logs solo en consola');
        }
    }

    // Colores para los embeds
    get colors() {
        return {
            info: 0x5865F2,      // Discord Blue
            success: 0x00FF88,   // Verde
            warning: 0xFFAA00,   // Naranja
            error: 0xFF4444,     // Rojo
            command: 0x0066FF,   // Azul
            action: 0x9B59B6,    // Púrpura
            data: 0xE67E22       // Naranja oscuro
        };
    }

    // Crear embed básico
    createEmbed(title, description, color, fields = []) {
        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle(title)
            .setDescription(description)
            .setTimestamp();

        if (fields.length > 0) {
            embed.addFields(fields);
        }

        return embed;
    }

    // Enviar mensaje al webhook
    async send(embed) {
        if (!this.webhookClient) return false;
        
        try {
            await this.webhookClient.send({ embeds: [embed] });
            return true;
        } catch (error) {
            console.error('❌ Error enviando log al webhook:', error.message);
            return false;
        }
    }

    // ============ MÉTODOS DE LOG ============

    // Log de inicio del bot
    async logStart(client) {
        const embed = this.createEmbed(
            '🚀 Bot Iniciado',
            `**${client.user.tag}** está online`,
            this.colors.success,
            [
                { name: '📊 Servidores', value: `${client.guilds.cache.size}`, inline: true },
                { name: '⚙️ Comandos', value: `${client.commands.size}`, inline: true },
                { name: '🕐 Hora', value: new Date().toLocaleString('es-ES'), inline: true }
            ]
        );
        return this.send(embed);
    }

    // Log de comando ejecutado
    async logCommand(commandName, user, guild, args = []) {
        const embed = this.createEmbed(
            '💬 Comando Ejecutado',
            `\`/${commandName}\``,
            this.colors.command,
            [
                { name: '👤 Usuario', value: `${user} (\`${user.id}\`)`, inline: true },
                { name: '🏠 Servidor', value: guild?.name || 'DM', inline: true },
                { name: '📝 Args', value: args.length > 0 ? `\`${args.join(' ')}\`` : 'Sin args', inline: false }
            ]
        );
        return this.send(embed);
    }

    // Log de acción (fichar, crear equipo, etc.)
    async logAction(actionType, user, details, color = this.colors.action) {
        const embed = this.createEmbed(
            `⚡ ${actionType}`,
            details.description,
            color,
            details.fields || []
        );
        
        // Añadir info del usuario
        if (!details.noUser) {
            embed.data.fields.unshift({ 
                name: '👤 Ejecutado por', 
                value: `${user}`, 
                inline: true 
            });
        }
        
        return this.send(embed);
    }

    // Log de partido
    async logMatch(eventType, matchData, user) {
        const titles = {
            created: '📅 Partido Creado',
            updated: '✏️ Partido Actualizado',
            completed: '⚽ Resultado Registrado',
            cancelled: '❌ Partido Cancelado'
        };

        const embed = this.createEmbed(
            titles[eventType] || '🎮 Evento de Partido',
            `**${matchData.homeTeam} vs ${matchData.awayTeam}**`,
            eventType === 'completed' ? this.colors.success : this.colors.info,
            [
                { name: '🏆 Torneo', value: matchData.tournament || 'EML', inline: true },
                { name: '📅 Fecha', value: matchData.date || 'N/A', inline: true }
            ]
        );

        if (eventType === 'completed') {
            embed.addFields({
                name: '⚽ Resultado',
                value: `**${matchData.homeScore} - ${matchData.awayScore}**`,
                inline: true
            });
        }

        embed.addFields({ name: '👤', value: `${user}`, inline: true });
        return this.send(embed);
    }

    // Log de error
    async logError(error, context = '') {
        const embed = this.createEmbed(
            '❌ Error',
            `\`\`\`${error.message}\`\`\``,
            this.colors.error,
            context ? [{ name: '📍 Contexto', value: context, inline: false }] : []
        );
        return this.send(embed);
    }

    // Log de transferencia/fichaje
    async logTransfer(type, player, fromTeam, toTeam, user) {
        const emoji = type === 'fichar' ? '🆕' : '👋';
        const title = type === 'fichar' ? '🆕 Nuevo Fichaje' : '👋 Desfichado';
        
        const embed = this.createEmbed(
            title,
            `**${player.name}**`,
            type === 'fichar' ? this.colors.success : this.colors.warning,
            [
                { name: '📤 De', value: fromTeam || 'Agente Libre', inline: true },
                { name: '📥 A', value: toTeam || 'Agente Libre', inline: true },
                { name: '👤', value: `${user}`, inline: true }
            ]
        );
        return this.send(embed);
    }

    // Log de sync de datos
    async logSync(source, details) {
        const embed = this.createEmbed(
            '🔄 Sync de Datos',
            `Datos sincronizados desde ${source}`,
            this.colors.data,
            [
                { name: '📄 Archivos', value: details.files?.join(', ') || 'N/A', inline: false },
                { name: '🕐 Hora', value: new Date().toLocaleString('es-ES'), inline: true }
            ]
        );
        return this.send(embed);
    }

    // Log genérico
    async log(title, description, color = this.colors.info, fields = []) {
        const embed = this.createEmbed(title, description, color, fields);
        return this.send(embed);
    }
}

// Exportar instancia única
module.exports = new Logger();

