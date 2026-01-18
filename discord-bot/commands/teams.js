const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../utils/githubDB');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('team')
        .setDescription('Gestión de equipos')
        
        .addSubcommand(sub => sub
            .setName('register')
            .setDescription('Registrar nuevo equipo')
            .addStringOption(opt => opt
                .setName('name')
                .setDescription('Nombre del equipo')
                .setRequired(true))
            .addStringOption(opt => opt
                .setName('tag')
                .setDescription('Tag del equipo (3-4 letras)')
                .setRequired(true))
            .addStringOption(opt => opt
                .setName('captain')
                .setDescription('Nombre del capitán')
                .setRequired(true)))
        
        .addSubcommand(sub => sub
            .setName('list')
            .setDescription('Listar todos los equipos'))
        
        .addSubcommand(sub => sub
            .setName('info')
            .setDescription('Ver información de equipo')
            .addStringOption(opt => opt
                .setName('team')
                .setDescription('Nombre o tag del equipo')
                .setRequired(true))),
    
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        
        switch(subcommand) {
            case 'register':
                await registerTeam(interaction);
                break;
            case 'list':
                await listTeams(interaction);
                break;
            case 'info':
                await teamInfo(interaction);
                break;
        }
    }
};

async function registerTeam(interaction) {
    const name = interaction.options.getString('name');
    const tag = interaction.options.getString('tag').toUpperCase();
    const captain = interaction.options.getString('captain');
    
    // Verificar si el equipo ya existe
    const teams = db.getTeams();
    const existingTeam = teams.find(t => 
        t.name.toLowerCase() === name.toLowerCase() || 
        t.tag === tag
    );
    
    if (existingTeam) {
        return interaction.reply({
            content: `❌ Ya existe un equipo con ese nombre o tag:\n**${existingTeam.name}** (${existingTeam.tag})`,
            ephemeral: true
        });
    }
    
    // Crear equipo
    const team = {
        name: name,
        tag: tag,
        captain: captain,
        players: [],
        createdAt: new Date().toISOString(),
        stats: {
            wins: 0,
            losses: 0,
            draws: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            points: 0
        }
    };
    
    const savedTeam = db.addTeam(team);
    
    const embed = new EmbedBuilder()
        .setColor(0x0066FF)
        .setTitle('✅ EQUIPO REGISTRADO')
        .setDescription(`**${name}** (${tag})`)
        .addFields(
            { name: '👑 Capitán', value: captain, inline: true },
            { name: '📅 Registrado', value: new Date().toLocaleDateString('es-ES'), inline: true },
            { name: '👥 Jugadores', value: '0', inline: true },
            { name: '🏆 Estadísticas', value: '0 PG | 0 PE | 0 PP\n0 GF | 0 GC', inline: false }
        )
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
}

async function listTeams(interaction) {
    const teams = db.getTeams();
    
    if (teams.length === 0) {
        return interaction.reply({
            content: '📭 No hay equipos registrados.',
            ephemeral: true
        });
    }
    
    const embed = new EmbedBuilder()
        .setColor(0x0066FF)
        .setTitle(`👥 EQUIPOS REGISTRADOS (${teams.length})`)
        .setTimestamp();
    
    teams.forEach(team => {
        const points = (team.stats.wins * 3) + (team.stats.draws * 1);
        embed.addFields({
            name: `${team.name} (${team.tag})`,
            value: `👑 ${team.captain}\n📊 ${points} pts | ${team.stats.wins}W ${team.stats.draws}D ${team.stats.losses}L\n👥 ${team.players?.length || 0} jugadores`,
            inline: true
        });
    });
    
    await interaction.reply({ embeds: [embed] });
}

async function teamInfo(interaction) {
    const teamQuery = interaction.options.getString('team');
    const teams = db.getTeams();
    
    const team = teams.find(t => 
        t.name.toLowerCase().includes(teamQuery.toLowerCase()) ||
        t.tag.toLowerCase() === teamQuery.toLowerCase()
    );
    
    if (!team) {
        return interaction.reply({
            content: '❌ No se encontró el equipo.',
            ephemeral: true
        });
    }
    
    const points = (team.stats.wins * 3) + (team.stats.draws * 1);
    const goalDiff = team.stats.goalsFor - team.stats.goalsAgainst;
    
    const embed = new EmbedBuilder()
        .setColor(0x0066FF)
        .setTitle(`📊 ${team.name} (${team.tag})`)
        .setDescription(`👑 Capitán: **${team.captain}**`)
        .addFields(
            { name: '🏆 Estadísticas', value: `**Puntos:** ${points}\n**PG:** ${team.stats.wins} | **PE:** ${team.stats.draws} | **PP:** ${team.stats.losses}\n**GF:** ${team.stats.goalsFor} | **GC:** ${team.stats.goalsAgainst} | **DG:** ${goalDiff}`, inline: false },
            { name: '📅 Registrado', value: new Date(team.createdAt).toLocaleDateString('es-ES'), inline: true },
            { name: '👥 Jugadores', value: `${team.players?.length || 0}`, inline: true }
        )
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
}