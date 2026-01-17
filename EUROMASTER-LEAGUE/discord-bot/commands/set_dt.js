const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set_dt')
        .setDescription('Asignar/remover DT de un equipo')
        .addStringOption(option =>
            option.setName('equipo')
                .setDescription('Nombre del equipo')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('nuevo_dt')
                .setDescription('Nuevo DT (deja vacío para remover)')
                .setRequired(false)),
    
    async execute(interaction) {
        const equipo = interaction.options.getString('equipo');
        const nuevoDt = interaction.options.getUser('nuevo_dt');
        
        if (nuevoDt) {
            const embed = new EmbedBuilder()
                .setColor(0x00FF88)
                .setTitle('👑 NUEVO DT ASIGNADO')
                .setDescription(`**${nuevoDt.tag}** es ahora DT de **${equipo}**`)
                .addFields(
                    { name: '🏆 Equipo', value: equipo, inline: true },
                    { name: '👑 DT', value: `<@${nuevoDt.id}>`, inline: true },
                    { name: '📅 Fecha', value: new Date().toLocaleDateString('es-ES'), inline: true }
                )
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
                .setColor(0xFF4444)
                .setTitle('❌ DT REMOVIDO')
                .setDescription(`Se ha removido el DT de **${equipo}**`)
                .addFields(
                    { name: '🏆 Equipo', value: equipo, inline: true },
                    { name: '📅 Fecha', value: new Date().toLocaleDateString('es-ES'), inline: true }
                )
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed] });
        }
    }
};
