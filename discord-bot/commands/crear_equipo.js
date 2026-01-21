const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Database = require('../utils/database');
const PermissionManager = require('../utils/permissions');
const EMLEmbeds = require('../utils/embeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('crear_equipo')
        .setDescription('Crear un nuevo equipo con todos los detalles')
        .addStringOption(option =>
            option.setName('nombre')
                .setDescription('Nombre completo del equipo')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('abreviatura')
                .setDescription('Abreviatura de 3 letras (RMA, BAR, MIL)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('escudo')
                .setDescription('URL del escudo del equipo')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('color')
                .setDescription('Color del rol en hex (ej: #FF0000)')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('ciudad')
                .setDescription('Ciudad del equipo')
                .setRequired(false)),
    
    async execute(interaction) {
        // Verificar permisos
        const hasPermission = PermissionManager.hasAdminPermission(interaction.member) ||
            interaction.member.roles.cache.some(role => role.name.toLowerCase().includes('manager')) ||
            interaction.member.roles.cache.some(role => role.name.toLowerCase().includes('admin'));

        if (!hasPermission) {
            return await interaction.reply({
                embeds: [EMLEmbeds.createErrorEmbed('❌ Solo managers y admins pueden crear equipos')],
                ephemeral: true
            });
        }

        const nombre = interaction.options.getString('nombre');
        const abreviatura = interaction.options.getString('abreviatura');
        const escudo = interaction.options.getString('escudo');
        const color = interaction.options.getString('color') || '#0099FF';
        const ciudad = interaction.options.getString('ciudad') || 'Sin especificar';

        // Validar abreviatura
        if (abreviatura.length < 2 || abreviatura.length > 5) {
            return await interaction.reply({
                embeds: [EMLEmbeds.createErrorEmbed('❌ La abreviatura debe tener entre 2 y 5 caracteres')],
                ephemeral: true
            });
        }

        // Validar URL de escudo
        try {
            new URL(escudo);
        } catch {
            return await interaction.reply({
                embeds: [EMLEmbeds.createErrorEmbed('❌ La URL del escudo no es válida')],
                ephemeral: true
            });
        }

        const teams = Database.loadTeams();

        // Verificar si ya existe el equipo
        if (Database.findTeamByName(nombre)) {
            return await interaction.reply({
                embeds: [EMLEmbeds.createErrorEmbed(`❌ El equipo "${nombre}" ya existe`)],
                ephemeral: true
            });
        }

        // Verificar si ya existe la abreviatura
        if (Database.findTeamByAbbreviation(abreviatura)) {
            return await interaction.reply({
                embeds: [EMLEmbeds.createErrorEmbed(`❌ La abreviatura "${abreviatura}" ya está en uso`)],
                ephemeral: true
            });
        }

        try {
            // Crear rol del equipo
            const role = await interaction.guild.roles.create({
                name: `${abreviatura} | ${nombre}`,
                color: color,
                reason: `Rol creado para el equipo ${nombre}`
            });

            // Crear canal del equipo
            const channel = await interaction.guild.channels.create({
                name: `📋・${abreviatura.toLowerCase()}-equipo`,
                topic: `Canal oficial del equipo ${nombre}`,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: ['ViewChannel']
                    },
                    {
                        id: role.id,
                        allow: ['ViewChannel', 'SendMessages', 'Connect']
                    },
                    {
                        id: interaction.user.id,
                        allow: ['ViewChannel', 'SendMessages', 'ManageMessages', 'Connect']
                    }
                ],
                reason: `Canal creado para el equipo ${nombre}`
            });

            // Crear equipo en la base de datos
            const result = Database.createTeam({
                name: nombre,
                abbreviation: abreviatura.toUpperCase(),
                city: ciudad,
                logoUrl: escudo,
                color: color,
                roleId: role.id,
                channelId: channel.id,
                managerId: interaction.user.id,
                manager: interaction.user.tag
            });

            if (!result.success) {
                // Eliminar rol y canal si falla
                await role.delete().catch(() => {});
                await channel.delete().catch(() => {});
                
                return await interaction.reply({
                    embeds: [EMLEmbeds.createErrorEmbed(`❌ ${result.message}`)],
                    ephemeral: true
                });
            }

            // Crear embed de confirmación
            const embed = new EmbedBuilder()
                .setColor(parseInt(color.replace('#', '0x')) || 0x0099FF)
                .setTitle('🏆 EQUIPO CREADO')
                .setDescription(`**${nombre}** \`[${abreviatura.toUpperCase()}]\` se une a EuroMaster League`)
                .addFields(
                    { name: '📛 Nombre', value: nombre, inline: true },
                    { name: '📊 Abreviatura', value: `\`[${abreviatura.toUpperCase()}]\``, inline: true },
                    { name: '🏙️ Ciudad', value: ciudad, inline: true },
                    { name: '🎨 Color', value: color, inline: true },
                    { name: '👨‍💼 Manager', value: interaction.user.tag, inline: true },
                    { name: '📅 Fecha', value: new Date().toLocaleDateString('es-ES'), inline: true }
                )
                .setThumbnail(escudo)
                .setFooter({ text: 'EuroMaster League' })
                .setTimestamp();

            // Botones para ver rol y canal
            const buttons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('Ver Rol')
                        .setStyle(ButtonStyle.Link)
                        .setURL(`https://discord.com/roles/${role.id}`)
                        .setEmoji('🎭'),
                    new ButtonBuilder()
                        .setLabel('Ver Canal')
                        .setStyle(ButtonStyle.Link)
                        .setURL(`https://discord.com/channels/${interaction.guild.id}/${channel.id}`)
                        .setEmoji('📁')
                );

            await interaction.reply({ embeds: [embed], components: [buttons] });

            // Log del comando
            console.log(`✅ Equipo "${nombre}" [${abreviatura}] creado por ${interaction.user.tag}`);

        } catch (error) {
            console.error('Error creando equipo:', error);
            await interaction.reply({
                embeds: [EMLEmbeds.createErrorEmbed(`❌ Error al crear el equipo: ${error.message}`)],
                ephemeral: true
            });
        }
    }
};

