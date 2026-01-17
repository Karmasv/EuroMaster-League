const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lista_equipos')
        .setDescription('Muestra la lista completa de equipos'),
    
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0x0066FF)
            .setTitle('📋 LISTA DE EQUIPOS - EuroMaster League')
            .setDescription('Todos los equipos registrados en la liga')
            .addFields(
                { name: '1. 🐉 Dragons (DRG)', value: '👑 DT: Karmasv\n👥 8 jugadores\n⭐ ★★★☆☆', inline: false },
                { name: '2. ⚔️ Vikings (VIK)', value: '👑 DT: Por asignar\n👥 5 jugadores\n⭐ ★★☆☆☆', inline: false },
                { name: '3. 🔥 Phoenix (PHX)', value: '👑 DT: Por asignar\n👥 6 jugadores\n⭐ ★★☆☆☆', inline: false },
                { name: '4. 🏛️ Titans (TIT)', value: '👑 DT: Por asignar\n👥 7 jugadores\n⭐ ★★★☆☆', inline: false },
                { name: '5. ⚡ Storm (STM)', value: '👑 DT: Por asignar\n👥 4 jugadores\n⭐ ★☆☆☆☆', inline: false }
            )
            .setFooter({ text: `Total: 5 equipos registrados | ${new Date().toLocaleDateString('es-ES')}` })
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    }
};
