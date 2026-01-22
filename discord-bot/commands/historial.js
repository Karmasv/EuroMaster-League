const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('historial')
        .setDescription('Muestra el historial de partidos de un equipo')
        .addStringOption(option =>
            option.setName('equipo')
                .setDescription('Nombre del equipo')
                .setRequired(false)),
    
    async execute(interaction) {
        const equipoNombre = interaction.options.getString('equipo');
        const matches = Database.loadMatches();

        if (matches.length === 0) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xFF9900)
                        .setTitle('⚠️ SIN PARTIDOS')
                        .setDescription('No hay partidos jugados en la base de datos')
                ]
            });
        }

        // Filtrar partidos completados
        const completedMatches = matches.filter(m => m.status === 'completed');

        let filteredMatches;
        
        if (equipoNombre) {
            // Filtrar por equipo
            filteredMatches = completedMatches.filter(m => 
                (m.team1 && m.team1.toLowerCase() === equipoNombre.toLowerCase()) ||
                (m.team2 && m.team2.toLowerCase() === equipoNombre.toLowerCase())
            );

            if (filteredMatches.length === 0) {
                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(0xFF0000)
                            .setTitle('❌ EQUIPO NO ENCONTRADO')
                            .setDescription(`No se encontraron partidos para "${equipoNombre}"`)
                    ],
                    ephemeral: true
                });
            }
        } else {
            // Mostrar todos los partidos completados
            filteredMatches = completedMatches;
        }

        // Ordenar por fecha (más recientes primero)
        filteredMatches.sort((a, b) => new Date(b.date) - new Date(a.date));

        const embed = new EmbedBuilder()
            .setColor(0x0066FF)
            .setTitle(equipoNombre ? 
                `📊 HISTORIAL: ${equipoNombre.toUpperCase()}` : 
                '📊 HISTORIAL DE PARTIDOS')
            .setDescription(`Últimos ${Math.min(10, filteredMatches.length)} partidos`)
            .setTimestamp();

        // Calcular estadísticas si es por equipo
        if (equipoNombre) {
            let wins = 0, draws = 0, losses = 0;
            let goalsFor = 0, goalsAgainst = 0;

            filteredMatches.forEach(match => {
                const isTeam1 = match.team1.toLowerCase() === equipoNombre.toLowerCase();
                const teamGoals = isTeam1 ? match.goals1 : match.goals2;
                const opponentGoals = isTeam1 ? match.goals2 : match.goals1;
                
                goalsFor += teamGoals;
                goalsAgainst += opponentGoals;

                if (teamGoals > opponentGoals) wins++;
                else if (teamGoals === opponentGoals) draws++;
                else losses++;
            });

            const goalDiff = goalsFor - goalsAgainst;
            const totalPoints = wins * 3 + draws;

            embed.addFields(
                { name: '📊 Estadísticas', value: `${wins}G ${draws}E ${losses}P`, inline: true },
                { name: '⚽ Goles', value: `${goalsFor} a favor, ${goalsAgainst} en contra`, inline: true },
                { name: '📈 Puntos', value: totalPoints.toString(), inline: true }
            );
        }

        // Mostrar partidos
        filteredMatches.slice(0, 10).forEach((match, index) => {
            const date = new Date(match.date).toLocaleDateString('es-ES');
            const score = `${match.goals1} - ${match.goals2}`;
            const tournament = match.tournament || 'Partido Amistoso';
            
            // Determinar resultado para el equipo si aplica
            let resultEmoji = '';
            if (equipoNombre) {
                const isTeam1 = match.team1.toLowerCase() === equipoNombre.toLowerCase();
                const teamGoals = isTeam1 ? match.goals1 : match.goals2;
                const opponentGoals = isTeam1 ? match.goals2 : match.goals1;

                if (teamGoals > opponentGoals) resultEmoji = '✅';
                else if (teamGoals === opponentGoals) resultEmoji = '🟡';
                else resultEmoji = '❌';
            }

            embed.addFields({
                name: `${resultEmoji} Partido ${index + 1}`,
                value: `**${match.team1}** ${score} **${match.team2}**\n📅 ${date} | 🏆 ${tournament}`,
                inline: false
            });
        });

        embed.setFooter({ text: `Total partidos: ${filteredMatches.length} | EuroMaster League` });

        await interaction.reply({ embeds: [embed] });
    }
};

