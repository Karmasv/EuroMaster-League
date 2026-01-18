const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Database = require('../utils/database');
const PermissionManager = require('../utils/permissions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('crear_equipo')
        .setDescription('Crear un nuevo equipo (Manager/Admin)')
        .addStringOption(option =>
            option.setName('nombre')
                .setDescription('Nombre del equipo')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('ciudad')
                .setDescription('Ciudad del equipo')
                .setRequired(false)),
    
    async execute(interaction) {
        // Solo managers y admins
        if (!PermissionManager.hasAdminPermission(interaction.member) && 
            !interaction.member.roles.cache.some(role => role.name.toLowerCase().includes('manager'))) {
            
            return await interaction.reply({
                content: '❌ Solo managers y admins pueden crear equipos',
                ephemeral: true
            });
        }

        const nombre = interaction.options.getString('nombre');
        const ciudad = interaction.options.getString('ciudad') || 'Sin especificar';

        const teams = Database.loadTeams();

        if (Database.findTeamByName(nombre)) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xFF0000)
                        .setTitle('❌ ERROR')
                        .setDescription(`El equipo "${nombre}" ya existe`)
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
                { name: '📅 Fecha', value: new Date().toLocaleDateString('es-ES'), inline: true }
            )
            .setFooter({ text: 'Ahora puedes fichar jugadores' })
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    }
};
