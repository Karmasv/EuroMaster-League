require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const express = require('express');

// Verificar variables de entorno PRIMERO
if (!process.env.DISCORD_TOKEN) {
    console.error('❌ ERROR: DISCORD_TOKEN no está definido en .env');
    console.log('📝 Copia .env.example a .env y llena tus datos');
    process.exit(1);
}

// Crear cliente PRIMERO
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

// DESPUÉS crear Express
const app = express();
const PORT = process.env.PORT || 3000;

// Endpoint de health check
app.get('/health', (req, res) => {
    res.json({ status: 'online', bot: client?.user?.username || 'Conectando...' });
});

app.get('/', (req, res) => {
    res.send('Bot está corriendo');
});

// Iniciar servidor HTTP
app.listen(PORT, () => {
    console.log(`🌐 Servidor HTTP escuchando en puerto ${PORT}`);
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
client.on('error', error => {
    console.error('❌ Error del cliente:', error);
});

process.on('unhandledRejection', error => {
    console.error('❌ Unhandled rejection:', error);
});

// Iniciar bot
console.log('🚀 Iniciando bot...');
console.log(`🔑 Token presente: ${process.env.DISCORD_TOKEN ? 'SÍ' : 'NO'}`);
console.log(`🔑 Longitud del token: ${process.env.DISCORD_TOKEN?.length || 0} caracteres`);

client.login(process.env.DISCORD_TOKEN)
    .then(() => {
        console.log('✅ Login ejecutado exitosamente');
    })
    .catch(error => {
        console.error('❌ Error al iniciar sesión:', error.message);
        console.error('❌ Detalles completos:', error);
        process.exit(1);
    });
