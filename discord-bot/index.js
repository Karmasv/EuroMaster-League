require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const express = require('express');

// Verificar variables de entorno
if (!process.env.DISCORD_TOKEN) {
    console.error('❌ ERROR: DISCORD_TOKEN no está definido');
    process.exit(1);
}

// Crear cliente
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Colecciones
client.commands = new Collection();

// Crear Express (pero NO iniciar aún)
const app = express();
const PORT = process.env.PORT || 10000;

// Endpoint de health check (CRÍTICO para Railway)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Endpoint raíz para health checks de Railway y otros platforms
app.get('/', (req, res) => {
    res.status(200).json({ 
        status: 'running',
        bot: client.user ? client.user.tag : 'connecting...',
        timestamp: new Date().toISOString()
    });
});

// Cargar comandos
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

console.log('📂 Cargando comandos...');
for (const file of commandFiles) {
    try {
        const command = require(path.join(commandsPath, file));
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            console.log(`  ✅ ${command.data.name}`);
        }
    } catch (error) {
        console.log(`  ❌ ${file}: ${error.message}`);
        continue;
    }
}

// Cargar PermissionManager
const PermissionManager = require('./utils/permissions');

// Evento ready
client.once('ready', () => {
    console.log(`✅ ${client.user.tag} está online!`);
    console.log(`📊 Servidores: ${client.guilds.cache.size}`);
    console.log(`⚙️ Comandos: ${client.commands.size}`);
    
    // Cargar owners
    const owners = PermissionManager.getOwners();
    console.log(`👑 ${owners.length} owners configurados`);
    
    // Establecer estado
    client.user.setPresence({
        activities: [{
            name: '/comandos | EuroMaster League',
            type: 'WATCHING'
        }],
        status: 'online'
    });
    
    // Log de inicio
    const logChannel = client.channels.cache.get(process.env.LOG_CHANNEL_ID);
    if (logChannel) {
        logChannel.send(`✅ **EuroMaster League Bot** iniciado correctamente.\n📊 ${client.commands.size} comandos cargados.`);
    }
});

// Cargar eventos
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

console.log('📂 Cargando eventos...');
for (const file of eventFiles) {
    try {
        const event = require(path.join(eventsPath, file));
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
        console.log(`  ✅ ${event.name}`);
    } catch (error) {
        console.log(`  ❌ ${file}: ${error.message}`);
    }
}

// Manejar errores
client.on('error', console.error);
process.on('unhandledRejection', console.error);

// ========== MANEJO DE BOTONES ==========
const { EmbedBuilder } = require('discord.js');
const TransferManager = require('./utils/transfers');
const Database = require('./utils/database');

client.on('interactionCreate', async (interaction) => {
    // Manejar botones
    if (interaction.isButton()) {
        const customId = interaction.customId;

        // Botones de transferencia
        if (customId.startsWith('transfer_accept_')) {
            const transferId = parseInt(customId.replace('transfer_accept_', ''));
            
            try {
                const result = await TransferManager.acceptTransfer(transferId, interaction);
                
                if (result.success) {
                    // Actualizar embed original
                    const teams = Database.loadTeams();
                    const team = teams.find(t => t.name === result.transfer.toTeam);
                    const embed = new EmbedBuilder()
                        .setColor(0x00FF88)
                        .setTitle('✅ TRANSFERENCIA ACEPTADA')
                        .setDescription(`**${result.transfer.playerName}** ahora es parte de **${result.transfer.toTeam}**`)
                        .addFields(
                            { name: '👤 Jugador', value: result.transfer.playerName, inline: true },
                            { name: '🏆 Equipo', value: result.transfer.toTeam, inline: true },
                            { name: '📊 Tag', value: `\`[${team?.abbreviation || '???'}]\``, inline: true },
                            { name: '👨‍💼 Manager', value: result.transfer.manager, inline: true },
                            { name: '📅 Fecha', value: new Date(result.transfer.date).toLocaleDateString('es-ES'), inline: true },
                            { name: '✅ Aceptada por', value: interaction.user.tag, inline: true }
                        )
                        .setTimestamp();

                    await interaction.update({ embeds: [embed], components: [] });
                    
                    // Notificar al manager
                    console.log(`✅ Transferencia aceptada: ${result.transfer.playerName} -> ${result.transfer.toTeam}`);
                } else {
                    await interaction.update({ content: `❌ ${result.message}`, components: [] });
                }
            } catch (error) {
                console.error('Error aceptando transferencia:', error);
                await interaction.update({ content: '❌ Error al aceptar la transferencia', components: [] });
            }
        }
        else if (customId.startsWith('transfer_reject_')) {
            const transferId = parseInt(customId.replace('transfer_reject_', ''));
            
            try {
                const result = await TransferManager.rejectTransfer(transferId, interaction);
                
                if (result.success) {
                    const embed = new EmbedBuilder()
                        .setColor(0xFF4444)
                        .setTitle('❌ TRANSFERENCIA RECHAZADA')
                        .setDescription(`**${result.transfer.playerName}** rechazó la oferta de **${result.transfer.toTeam}**`)
                        .addFields(
                            { name: '👤 Jugador', value: result.transfer.playerName, inline: true },
                            { name: '🏆 Equipo', value: result.transfer.toTeam, inline: true },
                            { name: '👨‍💼 Manager', value: result.transfer.manager, inline: true },
                            { name: '📅 Fecha', value: new Date(result.transfer.date).toLocaleDateString('es-ES'), inline: true },
                            { name: '❌ Rechazada por', value: interaction.user.tag, inline: true }
                        )
                        .setTimestamp();

                    await interaction.update({ embeds: [embed], components: [] });
                    
                    console.log(`❌ Transferencia rechazada: ${result.transfer.playerName}`);
                } else {
                    await interaction.update({ content: `❌ ${result.message}`, components: [] });
                }
            } catch (error) {
                console.error('Error rechazando transferencia:', error);
                await interaction.update({ content: '❌ Error al rechazar la transferencia', components: [] });
            }
        }
    }
    
    // Continuar con el manejo de comandos slash
    if (!interaction.isChatInputCommand()) return;
    
    const command = interaction.client.commands.get(interaction.commandName);
    
    if (!command) {
        console.error(`❌ Comando no encontrado: ${interaction.commandName}`);
        return;
    }
    
    try {
        // Log del comando usado
        console.log(`📝 /${interaction.commandName} - @${interaction.user.tag}`);
        
        // Ejecutar comando
        await command.execute(interaction);
        
    } catch (error) {
        console.error(`💥 Error en comando ${interaction.commandName}:`, error);
        
        const errorMessage = {
            content: '❌ **Error ejecutando el comando**\nEl error ha sido reportado a los administradores.',
            ephemeral: true
        };
        
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(errorMessage);
        } else {
            await interaction.reply(errorMessage);
        }
    }
});

// Debug: eventos del cliente (ANTES de login)
client.on('debug', info => {
    console.log(`[DEBUG] ${info}`);
});

client.on('rateLimit', info => {
    console.log(`[RATELIMIT] ${JSON.stringify(info)}`);
});

client.on('invalidSession', () => {
    console.log('[invalidSession] Sesión inválida, reintentando...');
});

client.on('shardReady', (id) => {
    console.log(`[shardReady] Shard ${id} listo`);
});

// INICIAR SERVIDOR HTTP PRIMERO - luego conectar bot
// Esto es CRÍTICO para Render que hace port scan
console.log('🌐 Iniciando servidor HTTP...');

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor HTTP escuchando en puerto ${PORT}`);
    
    // Delay pequeño para asegurar que el servidor está listo
    setTimeout(() => {
        console.log('🚀 Conectando bot a Discord...');
        console.log(`🔑 Token presente: ${process.env.DISCORD_TOKEN ? 'SÍ' : 'NO'}`);
        console.log(`🔑 Longitud del token: ${process.env.DISCORD_TOKEN ? process.env.DISCORD_TOKEN.length : 0} caracteres`);
        console.log(`📊 Node.js versión: ${process.version}`);
        console.log(`🌐 Gateway URL: ${process.env.DISCORD_GATEWAY || 'wss://gateway.discord.gg'}`);

        // Conectar bot después de que el servidor esté listo
        client.login(process.env.DISCORD_TOKEN)
            .then(() => {
                console.log('✅ Bot conectado exitosamente');
            })
            .catch(error => {
                console.error('❌ Error en login:');
                console.error('  Code:', error.code);
                console.error('  Message:', error.message);
                console.error('  Name:', error.name);
                console.error('  HTTP Status:', error.httpStatus);
                console.error('  Full error:', JSON.stringify(error, null, 2));
                // No salimos, el servidor sigue corriendo para health checks
            });
    }, 1000);
});

// Manejar errores del servidor
server.on('error', (error) => {
    console.error('❌ Error del servidor HTTP:', error);
});

// Debug adicional - eventos de conexión
client.on('debug', (info) => {
    console.log(`[DISCORD DEBUG] ${info}`);
});

client.on('disconnect', (event) => {
    console.log('❌ Discord disconnected:', JSON.stringify(event, null, 2));
});

client.on('reconnecting', () => {
    console.log('🔄 Discord reconectando...');
});

// Timeout de conexión - forzar error si no conecta en 30 segundos
setTimeout(() => {
    if (!client.user) {
        console.error('❌ TIMEOUT: Bot no pudo conectarse en 30 segundos');
        console.error('Posibles causas:');
        console.error('  1. Render bloquea conexiones WebSocket');
        console.error('  2. Token inválido o permissions insuficientes');
        console.error('  3. Discord Gateway bloqueado por IP de Render');
        console.error('  4. Intents insuficientes');
    }
}, 30000);

