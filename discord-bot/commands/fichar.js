const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Database = require('../utils/database');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fichar')
        .setDescription('Fichar un jugador a tu equipo (solo managers)')
        .addStringOption(option =>
            option.setName('jugador')
                .setDescription('Nombre del jugador')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('equipo')
                .setDescription('Tu equipo')
                .setRequired(true)),
    
    async execute(interaction) {
        const jugadorNombre = interaction.options.getString('jugador');
        const equipoNombre = interaction.options.getString('equipo');

        // Verificar que es manager de ese equipo
        const teams = Database.loadTeams();
        const team = teams.find(t => t.name.toLowerCase() === equipoNombre.toLowerCase());

        if (!team) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xFF0000)
                        .setTitle('❌ EQUIPO NO ENCONTRADO')
                        .setDescription(`El equipo "${equipoNombre}" no existe`)
                ],
                ephemeral: true
            });
        }

        // Verificar permisos
        if (team.managerId !== interaction.user.id && interaction.user.id !== process.env.INITIAL_OWNER_ID) {
            return await interaction.reply({
                content: '❌ Solo el manager puede fichar jugadores a su equipo',
                ephemeral: true
            });
        }

        let players = Database.loadPlayers();
        const player = players.find(p => p.name.toLowerCase() === jugadorNombre.toLowerCase());

        if (!player) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xFF0000)
                        .setTitle('❌ JUGADOR NO ENCONTRADO')
                        .setDescription(`El jugador "${jugadorNombre}" no está registrado`)
                ],
                ephemeral: true
            });
        }

        if (player.team) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xFF9900)
                        .setTitle('⚠️ JUGADOR YA FICHADO')
                        .setDescription(`${jugadorNombre} ya juega para ${player.team}`)
                ],
                ephemeral: true
            });
        }

        // Fichar jugador
        player.team = equipoNombre;
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
            fromTeam: null,
            toTeam: equipoNombre,
            date: new Date().toISOString(),
            manager: interaction.user.tag,
            type: 'entrada'
        });

        fs.writeFileSync(TRANSFERS_PATH, JSON.stringify(transfers, null, 2), 'utf8');

        const embed = new EmbedBuilder()
            .setColor(0x2ec47f)
            .setTitle('✅ JUGADOR FICHADO')
            .addFields(
                { name: '👤 Jugador', value: jugadorNombre, inline: true },
                { name: '🏆 Equipo', value: equipoNombre, inline: true },
                { name: '📅 Fecha', value: new Date().toLocaleDateString('es-ES'), inline: true },
                { name: '👨‍💼 Manager', value: interaction.user.tag, inline: false }
            )
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    }
};
