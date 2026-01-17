module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        // Solo manejar comandos slash
        if (!interaction.isChatInputCommand()) return;
        
        const command = interaction.client.commands.get(interaction.commandName);
        
        if (!command) {
            console.error(`❌ Comando no encontrado: ${interaction.commandName}`);
            return;
        }
        
        try {
            // Log del comando usado
            console.log(`📝 /${interaction.commandName} - @${interaction.user.tag} (${interaction.user.id})`);
            
            // Ejecutar comando
            await command.execute(interaction);
            
        } catch (error) {
            console.error(`💥 Error en comando ${interaction.commandName}:`, error);
            
            // Responder al usuario
            const errorMessage = {
                content: '❌ **Error ejecutando el comando**\nEl error ha sido reportado a los administradores.',
                ephemeral: true
            };
            
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMessage);
            } else {
                await interaction.reply(errorMessage);
            }
            
            // Log detallado
            const logChannel = interaction.client.channels.cache.get(process.env.LOG_CHANNEL_ID);
            if (logChannel) {
                logChannel.send(`💥 **Error en comando**\n\`/${interaction.commandName}\`\nUsuario: <@${interaction.user.id}>\n\`\`\`${error.message}\`\`\``);
            }
        }
    }
};