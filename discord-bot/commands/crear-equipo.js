const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Database = require('../utils/database');
const PermissionManager = require('../utils/permissions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('crear-equipo')
        .setDescription('Crear un nuevo equipo (solo managers)')
        .addStringOption(option =>
            option.setName('nombre')
                .setDescription('Nombre del equipo')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('ciudad')
                .setDescription('Ciudad/Ubicación')
                .setRequired(false)),
    
    async execute(interaction) {
        // Verificar permisos (solo managers y owners)
        if (!PermissionManager.hasAdminPermission(interaction.member)) {
            return await interaction.reply({
                content: '❌ Solo managers y owners pueden crear equipos',
                ephemeral: true
            });
        }

        const nombre = interaction.options.getString('nombre');
        const ciudad = interaction.options.getString('ciudad') || 'No especificado';

        const teams = Database.loadTeams();
        
        if (Database.findTeamByName(nombre)) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xFF0000)
                        .setTitle('❌ ERROR')
                        .setDescription(`El equipo "${nombre}" ya está registrado`)
                ],
                ephemeral: true
            });
        }

        const newTeam = {
            id: teams.length + 1,
            name: nombre,
            city: ciudad,
            manager: interaction.user.tag,
            managerId: interaction.user.id,
            points: 0,
            founded: new Date().toISOString()
        };

        teams.push(newTeam);
        Database.saveTeams(teams);

        const embed = new EmbedBuilder()
            .setColor(0x00FF88)
            .setTitle('✅ EQUIPO CREADO')
            .addFields(
                { name: '🏆 Equipo', value: nombre, inline: true },
                { name: '🏙️ Ciudad', value: ciudad, inline: true },
                { name: '👨‍💼 Manager', value: interaction.user.tag, inline: true },
                { name: '📝 Siguiente Paso', value: 'Usa `/fichar` para agregar jugadores', inline: false }
            )
            .setFooter({ text: `Creado por ${interaction.user.tag}` })
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    }
};
