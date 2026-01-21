const logger = require('../utils/logger');

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
            // Log del comando usado (consola + webhook)
            console.log(`📝 /${interaction.commandName} - @${interaction.user.tag} (${interaction.user.id})`);
            
            // Enviar a webhook
            await logger.logCommand(
                interaction.commandName,
                interaction.user,
                interaction.guild
            );
            
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
            
            // Log de error al webhook
            await logger.logError(
                error,
                `Comando: /${interaction.commandName}\nUsuario: ${interaction.user.tag} (${interaction.user.id})\nServidor: ${interaction.guild?.name || 'DM'}`
            );
        }
    }
};

