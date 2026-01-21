const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

class EMLEmbeds {
    static get colors() {
        return {
            primary: 0x0066FF,    // Azul EuroMaster
            success: 0x00FF88,    // Verde
            warning: 0xFFAA00,    // Naranja
            error: 0xFF4444,      // Rojo
            info: 0x5865F2,       // Discord color
            pending: 0xFFAA00,    // Naranja para pending
            accepted: 0x00FF88,   // Verde para accepted
            rejected: 0xFF4444,   // Rojo para rejected
            expired: 0x808080     // Gris para expired
        };
    }

    // ========== EMBEDS DE TRANSFERENCIAS ==========

    // Embed de oferta de fichaje
    static createTransferOfferEmbed(transfer, team) {
        const embed = new EmbedBuilder()
            .setColor(this.colors.pending)
            .setTitle('⏳ OFERTA DE FICHAGE')
            .setDescription(`Nueva oferta para **${transfer.playerName}**`)
            .addFields(
                { name: '👤 Jugador', value: transfer.playerName, inline: true },
                { name: '🏆 Equipo', value: transfer.toTeam, inline: true },
                { name: '📊 Tag', value: `\`[${team?.abbreviation || '???'}]\``, inline: true },
                { name: '👨‍💼 Manager', value: transfer.manager, inline: true },
                { name: '📅 Creado', value: new Date(transfer.date).toLocaleDateString('es-ES'), inline: true },
                { name: '⏰ Expira', value: new Date(transfer.expiresAt).toLocaleString('es-ES'), inline: true }
            )
            .setFooter({ text: `ID: ${transfer.id} | EuroMaster League` })
            .setTimestamp();

        if (team?.logoUrl) {
            embed.setThumbnail(team.logoUrl);
        }

        return embed;
    }

    // Embed de transferencia aceptada
    static createTransferAcceptedEmbed(transfer, team) {
        const embed = new EmbedBuilder()
            .setColor(this.colors.accepted)
            .setTitle('✅ TRANSFERENCIA ACEPTADA')
            .setDescription(`**${transfer.playerName}** se une a **${transfer.toTeam}**`)
            .addFields(
                { name: '👤 Jugador', value: transfer.playerName, inline: true },
                { name: '🏆 Equipo', value: transfer.toTeam, inline: true },
                { name: '📊 Tag', value: `\`[${team?.abbreviation || '???'}]\``, inline: true },
                { name: '👨‍💼 Manager', value: transfer.manager, inline: true },
                { name: '📅 Fecha', value: new Date(transfer.date).toLocaleDateString('es-ES'), inline: true },
                { name: '✅ Aceptada por', value: transfer.acceptedBy || 'Sistema', inline: true }
            )
            .setFooter({ text: `ID: ${transfer.id} | EuroMaster League` })
            .setTimestamp();

        if (team?.logoUrl) {
            embed.setThumbnail(team.logoUrl);
        }

        return embed;
    }

    // Embed de transferencia rechazada
    static createTransferRejectedEmbed(transfer) {
        return new EmbedBuilder()
            .setColor(this.colors.rejected)
            .setTitle('❌ TRANSFERENCIA RECHAZADA')
            .setDescription(`Oferta para **${transfer.playerName}** rechazada`)
            .addFields(
                { name: '👤 Jugador', value: transfer.playerName, inline: true },
                { name: '🏆 Equipo', value: transfer.toTeam, inline: true },
                { name: '👨‍💼 Manager', value: transfer.manager, inline: true },
                { name: '📅 Fecha', value: new Date(transfer.date).toLocaleDateString('es-ES'), inline: true },
                { name: '❌ Rechazada por', value: transfer.rejectedBy || 'Jugador', inline: true },
                { name: '📝 Razón', value: transfer.rejectReason || 'No especificada', inline: true }
            )
            .setFooter({ text: `ID: ${transfer.id} | EuroMaster League` })
            .setTimestamp();
    }

    // Embed de transferencia expirada
    static createTransferExpiredEmbed(transfer) {
        return new EmbedBuilder()
            .setColor(this.colors.expired)
            .setTitle('⏰ TRANSFERENCIA EXPIRADA')
            .setDescription(`La oferta para **${transfer.playerName}** ha expirado`)
            .addFields(
                { name: '👤 Jugador', value: transfer.playerName, inline: true },
                { name: '🏆 Equipo', value: transfer.toTeam, inline: true },
                { name: '👨‍💼 Manager', value: transfer.manager, inline: true },
                { name: '📅 Creado', value: new Date(transfer.date).toLocaleDateString('es-ES'), inline: true },
                { name: '⏰ Expira', value: new Date(transfer.expiresAt).toLocaleString('es-ES'), inline: true }
            )
            .setFooter({ text: `ID: ${transfer.id} | EuroMaster League` })
            .setTimestamp();
    }

    // Botones de transferencia
    static createTransferButtons(transferId) {
        return new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`transfer_accept_${transferId}`)
                    .setLabel('Aceptar')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('✅'),
                new ButtonBuilder()
                    .setCustomId(`transfer_reject_${transferId}`)
                    .setLabel('Rechazar')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('❌')
            );
    }

    // ========== EMBEDS DE EQUIPOS ==========

    // Embed de equipo creado
    static createTeamCreatedEmbed(team) {
        const embed = new EmbedBuilder()
            .setColor(parseInt(team.color.replace('#', '0x')) || this.colors.primary)
            .setTitle('🏆 EQUIPO CREADO')
            .setDescription(`**${team.name}** se une a EuroMaster League`)
            .addFields(
                { name: '📛 Nombre', value: team.name, inline: true },
                { name: '📊 Tag', value: `\`[${team.abbreviation}]\``, inline: true },
                { name: '🏙️ Ciudad', value: team.city, inline: true },
                { name: '👨‍💼 Manager', value: team.manager, inline: true },
                { name: '📅 Fundación', value: new Date(team.founded).toLocaleDateString('es-ES'), inline: true }
            )
            .setFooter({ text: 'EuroMaster League' })
            .setTimestamp();

        if (team.logoUrl) {
            embed.setThumbnail(team.logoUrl);
        }

        return embed;
    }

    // Embed de lista de equipos
    static createTeamsListEmbed(teams) {
        const embed = new EmbedBuilder()
            .setColor(this.colors.primary)
            .setTitle('🏆 LISTA DE EQUIPOS - EuroMaster League')
            .setTimestamp();

        if (teams.length === 0) {
            embed.setDescription('No hay equipos registrados');
            return embed;
        }

        teams.forEach((team, index) => {
            const pos = index + 1;
            let posEmoji = `${pos}.`;
            if (pos === 1) posEmoji = '🥇';
            if (pos === 2) posEmoji = '🥈';
            if (pos === 3) posEmoji = '🥉';

            embed.addFields({
                name: `${posEmoji} ${team.name} \`[${team.abbreviation}]\``,
                value: `🏙️ ${team.city} | 👨‍💼 ${team.manager || 'Sin asignar'} | Puntos: ${team.points || 0}`,
                inline: false
            });
        });

        embed.setFooter({ text: `${teams.length} equipos` });

        return embed;
    }

    // ========== EMBEDS DE JUGADORES ==========

    // Embed de jugador
    static createPlayerEmbed(player, team = null) {
        const embed = new EmbedBuilder()
            .setColor(this.colors.primary)
            .setTitle(`👤 ${player.name}`)
            .setTimestamp();

        if (team) {
            embed.setDescription(`**${team.name}** \`[${team.abbreviation}]\``);
            embed.addFields(
                { name: '🏆 Equipo', value: team.name, inline: true },
                { name: '📊 Tag', value: `\`[${team.abbreviation}]\``, inline: true }
            );
        } else {
            embed.setDescription('⚪ Sin equipo');
        }

        embed.addFields(
            { name: '⚽ Goles', value: (player.goals || 0).toString(), inline: true },
            { name: '🎯 Asistencias', value: (player.assists || 0).toString(), inline: true },
            { name: '🟨 Amarillas', value: (player.yellowCards || 0).toString(), inline: true },
            { name: '🟥 Rojas', value: (player.redCards || 0).toString(), inline: true }
        );

        if (player.joinedAt) {
            embed.addFields({
                name: '📅 Joined',
                value: new Date(player.joinedAt).toLocaleDateString('es-ES'),
                inline: true
            });
        }

        return embed;
    }

    // ========== EMBEDS DE PARTIDOS ==========

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

    // ========== EMBEDS DE CLASIFICACIÓN ==========

    static createStandingsEmbed(teams) {
        const embed = new EmbedBuilder()
            .setColor(this.colors.primary)
            .setTitle('🏆 CLASIFICACIÓN - EML Season 1')
            .setTimestamp();
        
        teams.forEach((team, index) => {
            const pos = index + 1;
            let posEmoji = `${pos}.`;
            if (pos === 1) posEmoji = '🥇';
            if (pos === 2) posEmoji = '🥈';
            if (pos === 3) posEmoji = '🥉';
            
            const puntos = (team.stats?.wins * 3) + (team.stats?.draws * 1);
            const difGol = (team.stats?.goalsFor || 0) - (team.stats?.goalsAgainst || 0);
            
            embed.addFields({
                name: `${posEmoji} ${team.name} (${team.abbreviation})`,
                value: `**PTS:** ${puntos} | **PJ:** ${(team.stats?.wins || 0) + (team.stats?.draws || 0) + (team.stats?.losses || 0)} | **PG:** ${team.stats?.wins || 0} | **PE:** ${team.stats?.draws || 0} | **PP:** ${team.stats?.losses || 0}\n**GF:** ${team.stats?.goalsFor || 0} | **GC:** ${team.stats?.goalsAgainst || 0} | **DG:** ${difGol}`,
                inline: false
            });
        });
        
        return embed;
    }

    // ========== EMBEDS DE LOGS (TIPO KOYA) ==========

    // Log de comando
    static createCommandLogEmbed(command, user, guild, options = {}) {
        return new EmbedBuilder()
            .setColor(this.colors.info)
            .setTitle('🔧 COMANDO EJECUTADO')
            .setDescription(`\`/${command}\``)
            .addFields(
                { name: '👤 Usuario', value: `${user.tag} (\`${user.id}\`)`, inline: true },
                { name: '🏠 Servidor', value: guild?.name || 'DM', inline: true },
                { name: '📅 Hora', value: new Date().toLocaleString('es-ES'), inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'EuroMaster League Logs' });
    }

    // Log de mensaje eliminado
    static createMessageDeleteEmbed(message, executor) {
        const embed = new EmbedBuilder()
            .setColor(this.colors.warning)
            .setTitle('💬 MENSAJE ELIMINADO')
            .setTimestamp();

        // Contenido del mensaje (limitado a 1000 caracteres)
        const content = message.content || '*Mensaje sin texto*';
        embed.setDescription(content.length > 1000 ? content.substring(0, 1000) + '...' : content);

        embed.addFields(
            { name: '👤 Autor', value: `${message.author?.tag || 'Desconocido'} (\`${message.author?.id || '???'}\`)`, inline: true },
            { name: '📁 Canal', value: message.channel?.toString() || 'Desconocido', inline: true },
            { name: '🕐 Hora', value: new Date().toLocaleString('es-ES'), inline: true }
        );

        if (executor) {
            embed.addFields({
                name: '🗑️ Eliminado por', value: `${executor.tag} (\`${executor.id}\`)`, inline: true
            });
        }

        if (message.attachments?.size > 0) {
            embed.addFields({
                name: '📎 Adjuntos', value: `${message.attachments.size} archivo(s)`, inline: true
            });
        }

        return embed;
    }

    // Log de mensaje editado
    static createMessageEditEmbed(oldMessage, newMessage) {
        const oldContent = oldMessage.content || '*Sin contenido*';
        const newContent = newMessage.content || '*Sin contenido*';

        return new EmbedBuilder()
            .setColor(this.colors.info)
            .setTitle('✏️ MENSAJE EDITADO')
            .addFields(
                { name: '👤 Autor', value: `${oldMessage.author?.tag || 'Desconocido'} (\`${oldMessage.author?.id || '???'}\`)`, inline: true },
                { name: '📁 Canal', value: oldMessage.channel?.toString() || 'Desconocido', inline: true },
                { name: '🕐 Hora', value: new Date().toLocaleString('es-ES'), inline: true },
                { name: '📝 Antes', value: oldContent.length > 500 ? oldContent.substring(0, 500) + '...' : oldContent, inline: false },
                { name: '📝 Después', value: newContent.length > 500 ? newContent.substring(0, 500) + '...' : newContent, inline: false }
            )
            .setTimestamp()
            .setFooter({ text: 'EuroMaster League Logs' });
    }

    // Log de miembro
    static createMemberLogEmbed(type, member, executor = null) {
        const embed = new EmbedBuilder()
            .setTimestamp();

        const titles = {
            join: '👋 MIEMBRO UNIDO',
            leave: '👋 MIEMBRO SALIÓ',
            kick: '🦶 MIEMBRO EXPULSADO',
            ban: '🔨 MIEMBRO BANEADO',
            unban: '🔓 MIEMBRO DESBANEADO',
            nickchange: '📝 APODO CAMBIADO',
            roleadd: '🎭 ROL AÑADIDO',
            roleremove: '🎭 ROL REMOVIDO'
        };

        embed.setTitle(titles[type] || '👥 CAMBIO DE MIEMBRO');

        if (type === 'join') {
            embed.setColor(this.colors.success);
            embed.setDescription(`**${member.user.tag}** se unió al servidor`);
        } else if (type === 'leave') {
            embed.setColor(this.colors.warning);
            embed.setDescription(`**${member.user.tag}** salió del servidor`);
        } else if (type === 'kick') {
            embed.setColor(this.colors.error);
            embed.setDescription(`**${member.user.tag}** fue expulsado`);
        } else if (type === 'ban') {
            embed.setColor(this.colors.error);
            embed.setDescription(`**${member.user.tag}** fue baneado`);
        } else if (type === 'unban') {
            embed.setColor(this.colors.success);
            embed.setDescription(`**${member.user.tag}** fue desbaneado`);
        } else if (type === 'nickchange') {
            embed.setColor(this.colors.info);
            embed.setDescription(`**${member.user.tag}** cambió su apodo`);
        } else if (type === 'roleadd') {
            embed.setColor(this.colors.success);
            embed.setDescription(`Rol añadido a **${member.user.tag}**`);
        } else if (type === 'roleremove') {
            embed.setColor(this.colors.warning);
            embed.setDescription(`Rol removido de **${member.user.tag}**`);
        }

        embed.addFields(
            { name: '👤 Usuario', value: `${member.user.tag} (\`${member.id}\`)`, inline: true },
            { name: '🏠 Servidor', value: member.guild?.name || 'Desconocido', inline: true }
        );

        if (executor) {
            embed.addFields({
                name: '👨‍💼 Ejecutor', value: `${executor.tag} (\`${executor.id}\`)`, inline: true
            });
        }

        embed.setFooter({ text: 'EuroMaster League Logs' });

        return embed;
    }

    // Log de voz
    static createVoiceLogEmbed(oldState, newState) {
        const embed = new EmbedBuilder()
            .setColor(this.colors.info)
            .setTitle('🔊 CAMBIO DE VOZ')
            .setTimestamp();

        const user = newState.member?.user || oldState.member?.user;
        const channel = newState.channel || oldState.channel;

        let description = '';
        let action = '';

        if (!oldState.channelId && newState.channelId) {
            action = '🟢 SE CONECTÓ A VOZ';
            description = `**${user?.tag}** se conectó a ${channel?.name || 'canal desconocido'}`;
        } else if (oldState.channelId && !newState.channelId) {
            action = '🔴 SE DESCONECTÓ DE VOZ';
            description = `**${user?.tag}** se desconectó de ${oldState.channel?.name || 'canal desconocido'}`;
        } else if (oldState.channelId !== newState.channelId) {
            action = '🔄 CAMBIÓ DE CANAL';
            description = `**${user?.tag}** cambió de ${oldState.channel?.name || 'desconocido'} a ${channel?.name || 'desconocido'}`;
        } else if (oldState.selfMute !== newState.selfMute) {
            action = newState.selfMute ? '🔇 SE SILENCIÓ' : '🔊 DESMUTEO';
            description = `**${user?.tag}** ${newState.selfMute ? 'se silenció' : 'desmuteó'}`;
        } else if (oldState.selfDeaf !== newState.selfDeaf) {
            action = newState.selfDeaf ? '🔇 SE ENSORDECIÓ' : '🔊 DESENSORDECIÓ';
            description = `**${user?.tag}** ${newState.selfDeaf ? 'se ensordeció' : 'desensordeció'}`;
        } else if (oldState.selfVideo !== newState.selfVideo) {
            action = newState.selfVideo ? '📹 ENCENDIÓ CÁMARA' : '📹 APAGÓ CÁMARA';
            description = `**${user?.tag}** ${newState.selfVideo ? 'encendió' : 'apagó'} la cámara`;
        }

        embed.setTitle(action);
        embed.setDescription(description);

        embed.addFields(
            { name: '👤 Usuario', value: `${user?.tag || 'Desconocido'} (\`${user?.id || '???'}\`)`, inline: true },
            { name: '📁 Canal', value: channel?.name || 'Desconocido', inline: true }
        );

        embed.setFooter({ text: 'EuroMaster League Logs' });

        return embed;
    }

    // Log de canal
    static createChannelLogEmbed(type, channel, executor) {
        const embed = new EmbedBuilder()
            .setTimestamp();

        const titles = {
            create: '📁 CANAL CREADO',
            delete: '📁 CANAL ELIMINADO',
            update: '📁 CANAL ACTUALIZADO'
        };

        const colors = {
            create: this.colors.success,
            delete: this.colors.error,
            update: this.colors.warning
        };

        embed.setTitle(titles[type] || '📁 CAMBIO DE CANAL');
        embed.setColor(colors[type] || this.colors.info);

        if (type === 'create') {
            embed.setDescription(`Canal **#${channel?.name || 'desconocido'}** creado`);
        } else if (type === 'delete') {
            embed.setDescription(`Canal **#${channel?.name || 'desconocido'}** eliminado`);
        } else if (type === 'update') {
            embed.setDescription(`Canal **#${channel?.name || 'desconocido'}** actualizado`);
        }

        embed.addFields(
            { name: '📁 Canal', value: channel?.toString() || 'Desconocido', inline: true },
            { name: '👨‍💼 Ejecutor', value: `${executor.tag} (\`${executor.id}\`)`, inline: true }
        );

        embed.setFooter({ text: 'EuroMaster League Logs' });

        return embed;
    }

    // Log de servidor
    static createGuildLogEmbed(type, guild, executor) {
        const embed = new EmbedBuilder()
            .setColor(this.colors.info)
            .setTitle('⚙️ CAMBIO DE SERVIDOR')
            .setTimestamp();

        embed.setDescription(`Cambios en **${guild?.name || 'Desconocido'}**`);
        embed.addFields(
            { name: '🏠 Servidor', value: guild?.name || 'Desconocido', inline: true },
            { name: '👨‍💼 Ejecutor', value: `${executor.tag} (\`${executor.id}\`)`, inline: true }
        );

        embed.setFooter({ text: 'EuroMaster League Logs' });

        return embed;
    }

    // ========== EMBEDS BÁSICOS ==========

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

    static createErrorEmbed(message) {
        return new EmbedBuilder()
            .setColor(this.colors.error)
            .setTitle('❌ Error')
            .setDescription(message)
            .setTimestamp();
    }

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

