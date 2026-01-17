const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../utils/githubDB');
const EMLEmbeds = require('../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('match')
        .setDescription('Gestión completa de partidos')
        
        // SUBCOMANDO: Crear
        .addSubcommand(sub => sub
            .setName('create')
            .setDescription('Crear nuevo partido')
            .addStringOption(opt => opt
                .setName('team1')
                .setDescription('Primer equipo')
                .setRequired(true))
            .addStringOption(opt => opt
                .setName('team2')
                .setDescription('Segundo equipo')
                .setRequired(true))
            .addStringOption(opt => opt
                .setName('date')
                .setDescription('Fecha (DD/MM/YYYY)')
                .setRequired(true))
            .addStringOption(opt => opt
                .setName('time')
                .setDescription('Hora (HH:MM CET)')
                .setRequired(true))
            .addStringOption(opt => opt
                .setName('tournament')
                .setDescription('Nombre del torneo')
                .setRequired(true)))
        
        // SUBCOMANDO: Listar
        .addSubcommand(sub => sub
            .setName('list')
            .setDescription('Listar partidos')
            .addStringOption(opt => opt
                .setName('status')
                .setDescription('Filtrar por estado')
                .addChoices(
                    { name: 'Programados', value: 'scheduled' },
                    { name: 'En vivo', value: 'live' },
                    { name: 'Completados', value: 'completed' }
                )))
        
        // SUBCOMANDO: Detalles
        .addSubcommand(sub => sub
            .setName('details')
            .setDescription('Ver detalles de partido')
            .addStringOption(opt => opt
                .setName('id')
                .setDescription('ID del partido')
                .setRequired(true))),
    
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        
        switch(subcommand) {
            case 'create':
                await handleCreate(interaction);
                break;
            case 'list':
                await handleList(interaction);
                break;
            case 'details':
                await handleDetails(interaction);
                break;
        }
    }
};

async function handleCreate(interaction) {
    const team1 = interaction.options.getString('team1');
    const team2 = interaction.options.getString('team2');
    const date = interaction.options.getString('date');
    const time = interaction.options.getString('time');
    const tournament = interaction.options.getString('tournament');
    
    const match = {
        homeTeam: team1,
        awayTeam: team2,
        date: date,
        time: time,
        tournament: tournament,
        status: 'scheduled',
        createdAt: new Date().toISOString()
    };
    
    const savedMatch = db.addMatch(match);
    
    const embed = EMLEmbeds.createMatchEmbed({
        ...savedMatch,
        id: savedMatch.id || Date.now().toString()
    });
    
    await interaction.reply({
        content: `✅ Partido creado con ID: \`${savedMatch.id}\``,
        embeds: [embed],
        ephemeral: false
    });
}

async function handleList(interaction) {
    const status = interaction.options.getString('status');
    const matches = db.getMatches();
    
    let filteredMatches = matches;
    if (status) {
        filteredMatches = matches.filter(m => m.status === status);
    }
    
    if (filteredMatches.length === 0) {
        return interaction.reply({
            content: '📭 No hay partidos con ese filtro.',
            ephemeral: true
        });
    }
    
    const embed = new EmbedBuilder()
        .setColor(EMLEmbeds.colors.primary)
        .setTitle(`📋 PARTIDOS (${filteredMatches.length})`)
        .setTimestamp();
    
    filteredMatches.slice(0, 10).forEach(match => {
        const statusEmoji = {
            'scheduled': '⏳',
            'live': '🔴',
            'completed': '✅'
        }[match.status] || '❓';
        
        embed.addFields({
            name: `${statusEmoji} ${match.homeTeam} vs ${match.awayTeam}`,
            value: `📅 ${match.date} ${match.time}\n🏆 ${match.tournament}\n🆔 \`${match.id}\``,
            inline: false
        });
    });
    
    await interaction.reply({ embeds: [embed] });
}

async function handleDetails(interaction) {
    const matchId = interaction.options.getString('id');
    const matches = db.getMatches();
    const match = matches.find(m => m.id === matchId);
    
    if (!match) {
        return interaction.reply({
            embeds: [EMLEmbeds.createErrorEmbed('No se encontró el partido con ese ID')],
            ephemeral: true
        });
    }
    
    const embed = new EmbedBuilder()
        .setColor(EMLEmbeds.colors.primary)
        .setTitle(`📊 DETALLES DEL PARTIDO`)
        .setDescription(`**${match.homeTeam} vs ${match.awayTeam}**`)
        .addFields(
            { name: '🆔 ID', value: `\`${match.id}\``, inline: true },
            { name: '📅 Fecha', value: match.date, inline: true },
            { name: '⏰ Hora', value: match.time || 'No definida', inline: true },
            { name: '🏆 Torneo', value: match.tournament, inline: true },
            { name: '📋 Estado', value: getStatusText(match.status), inline: true },
            { name: '📝 Creado', value: new Date(match.createdAt).toLocaleDateString('es-ES'), inline: true }
        );
    
    if (match.status === 'completed') {
        embed.addFields(
            { name: '⚽ Resultado', value: `**${match.homeScore} - ${match.awayScore}**`, inline: true },
            { name: '⭐ MVP', value: match.mvps?.join(', ') || 'No especificado', inline: true },
            { name: '🏁 Completado', value: new Date(match.completedAt).toLocaleDateString('es-ES'), inline: true }
        );
    }
    
    await interaction.reply({ embeds: [embed] });
}

function getStatusText(status) {
    const statusMap = {
        'scheduled': '⏳ Programado',
        'live': '🔴 En vivo',
        'completed': '✅ Completado',
        'cancelled': '❌ Cancelado'
    };
    return statusMap[status] || 'Desconocido';
}