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

// Endpoint de health check
app.get('/health', (req, res) => {
    res.json({ status: 'online', bot: client?.user?.username || 'Conectando...' });
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

// CONECTAR BOT PRIMERO - luego iniciar servidor
console.log('🚀 Conectando bot a Discord...');
console.log(`🔑 Token presente: ${process.env.DISCORD_TOKEN ? 'SÍ' : 'NO'}`);
console.log(`🔑 Longitud del token: ${process.env.DISCORD_TOKEN ? process.env.DISCORD_TOKEN.length : 0} caracteres`);
console.log(`📊 Node.js versión: ${process.version}`);
console.log(`🌐 Intentando conectar a Gateway de Discord...`);

// Debug: eventos del cliente
client.on('debug', info => {
    console.log(`[DEBUG] ${info}`);
});

client.on('rateLimit', info => {
    console.log(`[RATELIMIT] ${JSON.stringify(info)}`);
});

const loginPromise = client.login(process.env.DISCORD_TOKEN)
    .then(() => {
        console.log('✅ Bot conectado exitosamente');
        return client;
    })
    .catch(error => {
        console.error('❌ Error en login:');
        console.error('  Code:', error.code);
        console.error('  Message:', error.message);
        console.error('  Name:', error.name);
        console.error('  HTTP Status:', error.httpStatus);
        throw error;
    });

// Cuando el bot se conecta, iniciar servidor HTTP
loginPromise
    .then(() => {
        console.log('🌐 Iniciando servidor HTTP...');
        
        // Iniciar servidor HTTP solo después de conectar el bot
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`✅ Servidor HTTP escuchando en puerto ${PORT}`);
        });
    })
    .catch(error => {
        console.error('❌ Error fatal: El bot no pudo conectarse');
        console.error('Esperando 10 segundos antes de salir...');
        setTimeout(() => {
            process.exit(1);
        }, 10000);
    });

