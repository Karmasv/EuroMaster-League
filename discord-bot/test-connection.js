// Test script para verificar conexión a Discord
const https = require('https');
const dns = require('dns');

console.log('=== Test de conexión a Discord ===\n');

// Test 1: Resolver DNS
console.log('1. Intentando resolver gateway.discord.gg...');
dns.resolve('gateway.discord.gg', (err, addresses) => {
    if (err) {
        console.error('❌ Error DNS:', err.message);
    } else {
        console.log('✅ DNS resuelto:', addresses);
    }
});

// Test 2: Hacer request HTTPS a Discord API
console.log('\n2. Intentando conectar a discord.com...');
const req = https.get('https://discord.com/api/v10/gateway', {
    headers: { 'User-Agent': 'DiscordBot (test)' }
}, (res) => {
    console.log(`✅ Conectado! Status: ${res.statusCode}`);
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log('Response:', data.substring(0, 200));
    });
});

req.on('error', (err) => {
    console.error('❌ Error de conexión:', err.message);
});

req.setTimeout(5000, () => {
    console.error('❌ Timeout (5s)');
    req.destroy();
});

console.log('\n=== Test iniciado, esperando respuestas... ===');

