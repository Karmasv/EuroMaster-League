const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('comandos')
        .setDescription('Muestra todos los comandos disponibles'),
    
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0x0066FF)
            .setTitle('📚 COMANDOS DISPONIBLES - EuroMaster League')
            .setDescription('Selecciona una categoría para ver más detalles')
            .addFields(
                { name: '🛠️ ADMINISTRACIÓN', value: '`/ping` `/comandos` `/añadir_owner` `/permisos`', inline: false },
                { name: '👥 JUGADORES', value: '`/fichar` `/desfichar` `/actualizar-jugadores` `/transferencias` `/oferta`', inline: false },
                { name: '🏆 EQUIPOS', value: '`/equipos` `/registrar_equipo` `/set_dt` `/lista_equipos`', inline: false },
                { name: '⚽ PARTIDOS', value: '`/partido` `/asignar_arbitro` `/remover_arbitro`', inline: false }
            )
            .setFooter({ text: 'Usa /help <comando> para más detalles' });
        
        // Crear menú de selección
        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('comandos_menu')
                    .setPlaceholder('Selecciona una categoría')
                    .addOptions([
                        { label: 'Administración', value: 'admin_cmds', emoji: '🛠️' },
                        { label: 'Jugadores', value: 'player_cmds', emoji: '👥' },
                        { label: 'Equipos', value: 'team_cmds', emoji: '🏆' },
                        { label: 'Partidos', value: 'match_cmds', emoji: '⚽' }
                    ])
            );
        
        await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
    }
};
