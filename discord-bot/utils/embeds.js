const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

class EMLEmbeds {
    static get colors() {
        return {
            primary: 0x0066FF,    // Azul EuroMaster
            success: 0x00FF88,    // Verde
            warning: 0xFFAA00,    // Naranja
            error: 0xFF4444,      // Rojo
            info: 0x5865F2        // Discord color
        };
    }
    
    // Embed básico
    static createBasic(title, description, color = this.colors.primary) {
        return new EmbedBuilder()
            .setColor(color)
            .setTitle(title)
            .setDescription(description)
            .setTimestamp()
            .setFooter({ 
                text: 'EuroMaster League', 
                iconURL: 'https://cdn.discordapp.com/embed/avatars/0.png' 
            });
    }
    
    // Embed de partido
    static createMatchEmbed(match) {
        const embed = new EmbedBuilder()
            .setColor(this.colors.primary)
            .setTitle('🎮 NUEVO PARTIDO')
            .setDescription(`**${match.homeTeam} vs ${match.awayTeam}**`);
        
        if (match.status === 'programado') {
            embed.addFields(
                { name: '📅 Fecha', value: match.date, inline: true },
                { name: '⏰ Hora', value: match.time, inline: true },
                { name: '🏆 Torneo', value: match.tournament, inline: true },
                { name: '🆔 ID', value: `\`${match.id}\``, inline: true },
                { name: '📋 Estado', value: '⏳ Programado', inline: true }
            );
        } else if (match.status === 'completado') {
            embed.addFields(
                { name: '📅 Fecha', value: match.date, inline: true },
                { name: '🏆 Torneo', value: match.tournament, inline: true },
                { name: '⚽ Resultado', value: `**${match.homeScore} - ${match.awayScore}**`, inline: true },
                { name: '⭐ MVP', value: match.mvps?.join(', ') || 'No especificado', inline: true }
            );
        }
        
        return embed;
    }
    
    // Embed de resultado
    static createResultEmbed(match) {
        return new EmbedBuilder()
            .setColor(this.colors.success)
            .setTitle('⚽ RESULTADO REGISTRADO')
            .setDescription(`**${match.homeTeam} ${match.homeScore} - ${match.awayScore} ${match.awayTeam}**`)
            .addFields(
                { name: '🏆 Torneo', value: match.tournament, inline: true },
                { name: '📅 Fecha', value: match.date, inline: true },
                { name: '⭐ MVP', value: match.mvps?.join(', ') || 'No especificado', inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `ID: ${match.id}` });
    }
    
    // Embed de clasificación
    static createStandingsEmbed(teams) {
        const embed = new EmbedBuilder()
            .setColor(this.colors.primary)
            .setTitle('🏆 CLASIFICACIÓN - EML Season 1')
            .setTimestamp();
        
        teams.forEach((team, index) => {
            const pos = index + 1;
            const puntos = (team.stats.wins * 3) + (team.stats.draws * 1);
            const difGol = team.stats.goalsFor - team.stats.goalsAgainst;
            
            let posEmoji = `${pos}.`;
            if (pos === 1) posEmoji = '🥇';
            if (pos === 2) posEmoji = '🥈';
            if (pos === 3) posEmoji = '🥉';
            
            embed.addFields({
                name: `${posEmoji} ${team.name} (${team.tag})`,
                value: `**PTS:** ${puntos} | **PJ:** ${team.stats.wins + team.stats.draws + team.stats.losses} | **PG:** ${team.stats.wins} | **PE:** ${team.stats.draws} | **PP:** ${team.stats.losses}\n**GF:** ${team.stats.goalsFor} | **GC:** ${team.stats.goalsAgainst} | **DG:** ${difGol}`,
                inline: false
            });
        });
        
        return embed;
    }
    
    // Embed de error
    static createErrorEmbed(message) {
        return new EmbedBuilder()
            .setColor(this.colors.error)
            .setTitle('❌ Error')
            .setDescription(message)
            .setTimestamp();
    }
    
    // Embed de éxito
    static createSuccessEmbed(message) {
        return new EmbedBuilder()
            .setColor(this.colors.success)
            .setTitle('✅ Éxito')
            .setDescription(message)
            .setTimestamp();
    }
    
    // Botones para partidos
    static createMatchButtons(matchId) {
        return new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`match_result_${matchId}`)
                    .setLabel('Registrar Resultado')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('⚽'),
                new ButtonBuilder()
                    .setCustomId(`match_cancel_${matchId}`)
                    .setLabel('Cancelar Partido')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('❌'),
                new ButtonBuilder()
                    .setCustomId(`match_details_${matchId}`)
                    .setLabel('Ver Detalles')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('📊')
            );
    }
}

module.exports = EMLEmbeds;