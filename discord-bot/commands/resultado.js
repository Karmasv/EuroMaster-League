const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Database = require('../utils/database');
const PermissionManager = require('../utils/permissions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resultado')
        .setDescription('Registrar resultado de un partido')
        .addStringOption(option =>
            option.setName('equipo1')
                .setDescription('Primer equipo')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('goles1')
                .setDescription('Goles equipo 1')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('equipo2')
                .setDescription('Segundo equipo')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('goles2')
                .setDescription('Goles equipo 2')
                .setRequired(true)),
    
    async execute(interaction) {
        // Verificar permisos
        if (!PermissionManager.hasAdminPermission(interaction.member)) {
            return await interaction.reply({
                content: '❌ No tienes permisos para usar este comando',
                ephemeral: true
            });
        }

        const equipo1 = interaction.options.getString('equipo1');
        const goles1 = interaction.options.getInteger('goles1');
        const equipo2 = interaction.options.getString('equipo2');
        const goles2 = interaction.options.getInteger('goles2');

        // Validar equipos
        const team1 = Database.findTeamByName(equipo1);
        const team2 = Database.findTeamByName(equipo2);

        if (!team1 || !team2) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xFF0000)
                        .setTitle('❌ EQUIPO NO ENCONTRADO')
                        .setDescription('Uno o ambos equipos no existen')
                ]
            });
        }

        const matches = Database.loadMatches();
        const newMatch = {
            id: matches.length + 1,
            team1: equipo1,
            goals1: goles1,
            team2: equipo2,
            goals2: goles2,
            date: new Date().toISOString(),
            status: 'finished'
        };

        matches.push(newMatch);
        Database.saveMatches(matches);

        // Actualizar puntajes
        const standings = Database.loadStandings();
        let standing1 = standings.find(s => s.team.toLowerCase() === equipo1.toLowerCase());
        let standing2 = standings.find(s => s.team.toLowerCase() === equipo2.toLowerCase());

        if (!standing1) standing1 = { team: equipo1, played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0 };
        if (!standing2) standing2 = { team: equipo2, played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0 };

        standing1.played++;
        standing2.played++;
        standing1.goalsFor += goles1;
        standing1.goalsAgainst += goles2;
        standing2.goalsFor += goles2;
        standing2.goalsAgainst += goles1;

        if (goles1 > goles2) {
            standing1.wins++;
            standing1.points += 3;
            standing2.losses++;
        } else if (goles2 > goles1) {
            standing2.wins++;
            standing2.points += 3;
            standing1.losses++;
        } else {
            standing1.draws++;
            standing1.points += 1;
            standing2.draws++;
            standing2.points += 1;
        }

        standings.push(standing1, standing2);
        Database.saveStandings(standings);

        const embed = new EmbedBuilder()
            .setColor(0x00FF88)
            .setTitle('✅ RESULTADO REGISTRADO')
            .addFields(
                { name: '⚽ Resultado', value: `${equipo1} ${goles1} - ${goles2} ${equipo2}`, inline: false },
                { name: '📅 Fecha', value: new Date().toLocaleDateString('es-ES'), inline: true },
                { name: '⏰ Hora', value: new Date().toLocaleTimeString('es-ES'), inline: true }
            )
            .setFooter({ text: `Registrado por ${interaction.user.tag}` })
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    }
};
