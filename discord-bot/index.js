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

// Endpoint de health check (CRÍTICO para Render)
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Endpoint raíz para health checks de Render
app.get('/', (req, res) => {
    res.status(200).send('Bot running');
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
    if (info.includes('heartbeat') || info.includes('connecting') || info.includes('identify') || info.includes('ready')) {
        console.log(`[DISCORD DEBUG] ${info}`);
    }
});

client.on('disconnect', (event) => {
    console.log('❌ Discord disconnected:', JSON.stringify(event, null, 2));
});

client.on('reconnecting', () => {
    console.log('🔄 Discord reconectando...');
});

