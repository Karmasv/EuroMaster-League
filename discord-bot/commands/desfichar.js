const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Database = require('../utils/database');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('desfichar')
        .setDescription('Desfichar un jugador (solo managers)')
        .addStringOption(option =>
            option.setName('jugador')
                .setDescription('Nombre del jugador')
                .setRequired(true)),
    
    async execute(interaction) {
        const jugadorNombre = interaction.options.getString('jugador');

        let players = Database.loadPlayers();
        const player = players.find(p => p.name.toLowerCase() === jugadorNombre.toLowerCase());

        if (!player) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xFF0000)
                        .setTitle('❌ JUGADOR NO ENCONTRADO')
                        .setDescription(`El jugador "${jugadorNombre}" no existe`)
                ],
                ephemeral: true
            });
        }

        if (!player.team) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xFF9900)
                        .setTitle('⚠️ JUGADOR SIN EQUIPO')
                        .setDescription(`${jugadorNombre} no juega en ningún equipo`)
                ],
                ephemeral: true
            });
        }

        // Verificar permisos
        const teams = Database.loadTeams();
        const team = teams.find(t => t.name === player.team);

        if (team && team.managerId !== interaction.user.id && interaction.user.id !== process.env.INITIAL_OWNER_ID) {
            return await interaction.reply({
                content: '❌ Solo el manager del equipo puede desfichar jugadores',
                ephemeral: true
            });
        }

        const teamAnterior = player.team;
        player.team = null;
        Database.savePlayers(players);

        // Registrar traspaso
        const TRANSFERS_PATH = path.join(__dirname, '../../data/transfers.json');
        let transfers = [];
        try {
            if (fs.existsSync(TRANSFERS_PATH)) {
                transfers = JSON.parse(fs.readFileSync(TRANSFERS_PATH, 'utf8'));
            }
        } catch (error) {
            console.error('Error leyendo transfers:', error);
        }

        transfers.unshift({
            id: transfers.length + 1,
            playerName: jugadorNombre,
            fromTeam: teamAnterior,
            toTeam: null,
            date: new Date().toISOString(),
            manager: interaction.user.tag,
            type: 'salida'
        });

        fs.writeFileSync(TRANSFERS_PATH, JSON.stringify(transfers, null, 2), 'utf8');

        const embed = new EmbedBuilder()
            .setColor(0xe63946)
            .setTitle('✅ JUGADOR DESFICHADO')
            .addFields(
                { name: '👤 Jugador', value: jugadorNombre, inline: true },
                { name: '🏆 Equipo', value: teamAnterior, inline: true },
                { name: '📅 Fecha', value: new Date().toLocaleDateString('es-ES'), inline: true }
            )
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    }
};
