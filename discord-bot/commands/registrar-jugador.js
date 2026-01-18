const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Database = require('../utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('registrar-jugador')
        .setDescription('Registrarte como jugador en la liga')
        .addStringOption(option =>
            option.setName('nombre')
                .setDescription('Tu nombre en Haxball')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('id-haxball')
                .setDescription('Tu ID de Haxball (opcional)')
                .setRequired(false)),
    
    async execute(interaction) {
        const nombre = interaction.options.getString('nombre');
        const idHaxball = interaction.options.getString('id-haxball') || 'No especificado';

        let players = Database.loadPlayers();
        
        // Verificar si ya existe
        if (players.find(p => p.discordId === interaction.user.id)) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xFF9900)
                        .setTitle('⚠️ YA REGISTRADO')
                        .setDescription('Ya estás registrado en la liga')
                ],
                ephemeral: true
            });
        }

        // Verificar nombre duplicado
        if (players.find(p => p.name.toLowerCase() === nombre.toLowerCase())) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xFF0000)
                        .setTitle('❌ ERROR')
                        .setDescription('El nombre "' + nombre + '" ya está registrado')
                ],
                ephemeral: true
            });
        }

        const newPlayer = {
            id: players.length + 1,
            discordId: interaction.user.id,
            name: nombre,
            haxballId: idHaxball,
            team: null,
            goals: 0,
            assists: 0,
            yellowCards: 0,
            redCards: 0,
            joinedAt: new Date().toISOString()
        };

        players.push(newPlayer);
        Database.savePlayers(players);

        const embed = new EmbedBuilder()
            .setColor(0x00FF88)
            .setTitle('✅ ¡BIENVENIDO A LA LIGA!')
            .setDescription('¡' + nombre + ' está listo para jugar!')
            .addFields(
                { name: '👤 Nombre', value: nombre, inline: true },
                { name: '🎮 ID Haxball', value: idHaxball, inline: true },
                { name: '📅 Fecha Registro', value: new Date().toLocaleDateString('es-ES'), inline: true },
                { name: '📝 Siguiente Paso', value: 'Espera a que un manager te fiche a su equipo', inline: false }
            )
            .setFooter({ text: 'Discord: ' + interaction.user.tag })
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    }
};
