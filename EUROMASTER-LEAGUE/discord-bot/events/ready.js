module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`✅ ${client.user.tag} está online!`);
        console.log(`📊 Servidores: ${client.guilds.cache.size}`);
        console.log(`⚙️ Comandos: ${client.commands.size}`);
        
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
    }
};