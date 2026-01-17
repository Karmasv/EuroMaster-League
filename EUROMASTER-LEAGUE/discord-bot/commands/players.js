const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../utils/githubDB');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('player')
        .setDescription('Gestión de jugadores')
        
        .addSubcommand(sub => sub
            .setName('register')
            .setDescription('Registrar nuevo jugador')
            .addStringOption(opt => opt
                .setName('name')
                .setDescription('Nombre del jugador')
                .setRequired(true))
            .addStringOption(opt => opt
                .setName('haxball_nick')
                .setDescription('Nick en Haxball')
                .setRequired(true))
            .addStringOption(opt => opt
                .setName('team')
                .setDescription('Equipo al que pertenece')
                .setRequired(true)))
        
        .addSubcommand(sub => sub
            .setName('stats')
            .setDescription('Ver estadísticas de jugador')
            .addStringOption(opt => opt
                .setName('name')
                .setDescription('Nombre del jugador')
                .setRequired(true))),
    
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        
        switch(subcommand) {
            case 'register':
                await registerPlayer(interaction);
                break;
            case 'stats':
                await playerStats(interaction);
                break;
        }
    }
};

async function registerPlayer(interaction) {
    const name = interaction.options.getString('name');
    const haxballNick = interaction.options.getString('haxball_nick');
    const teamName = interaction.options.getString('team');
    
    // Verificar si el equipo existe
    const teams = db.getTeams();
    const team = teams.find(t => 
        t.name.toLowerCase().includes(teamName.toLowerCase()) ||
        t.tag.toLowerCase() === teamName.toLowerCase()
    );
    
    if (!team) {
        return interaction.reply({
            content: `❌ No se encontró el equipo "${teamName}". Registra el equipo primero con /team register.`,
            ephemeral: true
        });
    }
    
    // Crear jugador
    const player = {
        name: name,
        haxballNick: haxballNick,
        teamId: team.id,
        teamName: team.name,
        discordId: interaction.user.id,
        discordTag: interaction.user.tag,
        joinedAt: new Date().toISOString(),
        stats: {
            matches: 0,
            goals: 0,
            assists: 0,
            mvps: 0,
            rating: 0
        }
    };
    
    const savedPlayer = db.addPlayer(player);
    
    // Añadir jugador al equipo
    if (!team.players) team.players = [];
    team.players.push(savedPlayer.id);
    
    const embed = new EmbedBuilder()
        .setColor(0x00FF88)
        .setTitle('✅ JUGADOR REGISTRADO')
        .setDescription(`**${name}**`)
        .addFields(
            { name: '🎮 Nick Haxball', value: haxballNick, inline: true },
            { name: '👥 Equipo', value: team.name, inline: true },
            { name: '📅 Registrado', value: new Date().toLocaleDateString('es-ES'), inline: true },
            { name: '📊 Estadísticas iniciales', value: '0 partidos | 0 goles | 0 asistencias\n0 MVPs | Rating: 0.0', inline: false }
        )
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
}

async function playerStats(interaction) {
    const playerName = interaction.options.getString('name');
    const players = db.getPlayers();
    
    const player = players.find(p => 
        p.name.toLowerCase().includes(playerName.toLowerCase()) ||
        p.haxballNick.toLowerCase().includes(playerName.toLowerCase())
    );
    
    if (!player) {
        return interaction.reply({
            content: '❌ No se encontró el jugador.',
            ephemeral: true
        });
    }
    
    const ratingEmoji = player.stats.rating >= 8 ? '⭐' : 
                       player.stats.rating >= 6 ? '⚡' : '📊';
    
    const embed = new EmbedBuilder()
        .setColor(0x0066FF)
        .setTitle(`📊 ${player.name}`)
        .setDescription(`🎮 **${player.haxballNick}** | 👥 ${player.teamName}`)
        .addFields(
            { name: '📈 Estadísticas', value: `**Partidos:** ${player.stats.matches}\n**Goles:** ${player.stats.goals}\n**Asistencias:** ${player.stats.assists}\n**MVPs:** ${player.stats.mvps}\n**Rating:** ${ratingEmoji} ${player.stats.rating.toFixed(1)}`, inline: true },
            { name: '📅 Registrado', value: new Date(player.joinedAt).toLocaleDateString('es-ES'), inline: true },
            { name: '🎮 Discord', value: player.discordTag || 'No registrado', inline: true }
        )
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
}