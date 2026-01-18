require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const express = require('express');

// Crear aplicación Express para mantener el bot activo
const app = express();
const PORT = process.env.PORT || 3000;

// Endpoint de health check
app.get('/health', (req, res) => {
    res.json({ status: 'online', bot: client?.user?.username || 'Conectando...' });
});

// Iniciar servidor HTTP
app.listen(PORT, () => {
    console.log(`🌐 Servidor HTTP escuchando en puerto ${PORT}`);
});

// Verificar variables de entorno
if (!process.env.DISCORD_TOKEN) {
    console.error('❌ ERROR: DISCORD_TOKEN no está definido en .env');
    console.log('📝 Copia .env.example a .env y llena tus datos');
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
    }
}
// Añade esto después de cargar los comandos
const PermissionManager = require('./utils/permissions');

// Al iniciar el bot, verificar owners
client.once('ready', () => {
    console.log('🤖 Bot conectado...');
    
    // Cargar owners
    const owners = PermissionManager.getOwners();
    console.log(`👑 ${owners.length} owners configurados`);
    
    // Si no hay owners, usar el de .env como inicial
    if (owners.length === 0 && process.env.INITIAL_OWNER_ID) {
        console.log(`⚠️  Configurando owner inicial: ${process.env.INITIAL_OWNER_ID}`);
        // Aquí podrías inicializar el archivo owners.json
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

// Iniciar bot
console.log('🚀 Iniciando bot...');
client.login(process.env.DISCORD_TOKEN).catch(error => {
    console.error('❌ Error al iniciar sesión:', error);
    process.exit(1);
});