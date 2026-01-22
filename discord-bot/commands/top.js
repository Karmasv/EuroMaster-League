const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Database = require('../utils/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('top')
        .setDescription('Muestra los mejores jugadores de la liga')
        .addStringOption(option =>
            option.setName('tipo')
                .setDescription('Tipo de ranking')
                .setRequired(false)
                .addChoices(
                    { name: 'Goleadores', value: 'goals' },
                    { name: 'Asistentes', value: 'assists' },
                    { name: 'Contribuciones', value: 'contributions' }
                )),
    
    async execute(interaction) {
        const tipo = interaction.options.getString('tipo') || 'goals';
        const players = Database.loadPlayers();

        if (players.length === 0) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xFF9900)
                        .setTitle('⚠️ SIN JUGADORES')
                        .setDescription('No hay jugadores registrados en la liga')
                ]
            });
        }

        // Ordenar por tipo
        let sortedPlayers;
        let title;
        let emoji;

        switch (tipo) {
            case 'goals':
                sortedPlayers = [...players].sort((a, b) => (b.goals || 0) - (a.goals || 0));
                title = '🏆 TOP 10 GOLEADORES';
                emoji = '⚽';
                break;
            case 'assists':
                sortedPlayers = [...players].sort((a, b) => (b.assists || 0) - (a.assists || 0));
                title = '🎯 TOP 10 ASISTENTES';
                emoji = '👟';
                break;
            case 'contributions':
                sortedPlayers = [...players].sort((a, b) => ((b.goals || 0) + (b.assists || 0)) - ((a.goals || 0) + (a.assists || 0)));
                title = '👑 TOP 10 CONTRIBUCIONES';
                emoji = '⭐';
                break;
        }

        const top10 = sortedPlayers.slice(0, 10);

        const embed = new EmbedBuilder()
            .setColor(0xFFD700)
            .setTitle(`${emoji} ${title}`)
            .setDescription(`Los mejores ${Math.min(10, players.length)} jugadores de la liga`)
            .setTimestamp();

        let medalEmojis = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

        top10.forEach((player, index) => {
            const goals = player.goals || 0;
            const assists = player.assists || 0;
            const contributions = goals + assists;
            const team = player.team || 'Sin equipo';

            let value;
            if (tipo === 'goals') {
                value = `⚽ ${goals} G | ${team}`;
            } else if (tipo === 'assists') {
                value = `🎯 ${assists} A | ${team}`;
            } else {
                value = `⭐ ${contributions} (${goals}G + ${assists}A) | ${team}`;
            }

            embed.addFields({
                name: `${medalEmojis[index]} ${player.name}`,
                value: value,
                inline: false
            });
        });

        embed.setFooter({ text: `Total jugadores: ${players.length} | EuroMaster League` });

        await interaction.reply({ embeds: [embed] });
    }
};

