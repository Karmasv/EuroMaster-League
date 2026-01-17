const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Ruta al archivo de owners
const OWNERS_FILE = path.join(__dirname, '../config/owners.json');

// Cargar owners
function loadOwners() {
    try {
        if (fs.existsSync(OWNERS_FILE)) {
            const data = JSON.parse(fs.readFileSync(OWNERS_FILE, 'utf8'));
            return data.owners || [];
        }
    } catch (error) {
        console.error('Error cargando owners:', error);
    }
    
    // Si no existe, crear con el owner inicial
    const initialOwner = process.env.INITIAL_OWNER_ID || '';
    const owners = initialOwner ? [initialOwner] : [];
    saveOwners(owners);
    return owners;
}

// Guardar owners
function saveOwners(owners) {
    const data = { owners, updatedAt: new Date().toISOString() };
    fs.writeFileSync(OWNERS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Verificar si es owner
function isOwner(userId) {
    const owners = loadOwners();
    return owners.includes(userId);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('owner')
        .setDescription('Gestión de owners del bot (solo para owners)')
        
        // SUBCOMANDO: Listar owners
        .addSubcommand(sub => sub
            .setName('list')
            .setDescription('Listar todos los owners'))
        
        // SUBCOMANDO: Añadir owner
        .addSubcommand(sub => sub
            .setName('add')
            .setDescription('Añadir nuevo owner')
            .addUserOption(opt => opt
                .setName('user')
                .setDescription('Usuario a añadir como owner')
                .setRequired(true)))
        
        // SUBCOMANDO: Remover owner
        .addSubcommand(sub => sub
            .setName('remove')
            .setDescription('Remover owner')
            .addUserOption(opt => opt
                .setName('user')
                .setDescription('Usuario a remover como owner')
                .setRequired(true)))
        
        // SUBCOMANDO: Verificar
        .addSubcommand(sub => sub
            .setName('check')
            .setDescription('Verificar si un usuario es owner')
            .addUserOption(opt => opt
                .setName('user')
                .setDescription('Usuario a verificar')
                .setRequired(false))),
    
    async execute(interaction) {
        // Verificar si el que ejecuta el comando es owner
        const currentOwners = loadOwners();
        
        if (!currentOwners.includes(interaction.user.id)) {
            return interaction.reply({
                content: '❌ Solo los owners del bot pueden usar este comando.',
                ephemeral: true
            });
        }
        
        const subcommand = interaction.options.getSubcommand();
        
        switch(subcommand) {
            case 'list':
                await listOwners(interaction);
                break;
            case 'add':
                await addOwner(interaction);
                break;
            case 'remove':
                await removeOwner(interaction);
                break;
            case 'check':
                await checkOwner(interaction);
                break;
        }
    }
};

async function listOwners(interaction) {
    const owners = loadOwners();
    
    if (owners.length === 0) {
        return interaction.reply({
            content: '📭 No hay owners configurados.',
            ephemeral: true
        });
    }
    
    const embed = new EmbedBuilder()
        .setColor(0x0066FF)
        .setTitle('👑 OWNERS DEL BOT')
        .setDescription(`Total: ${owners.length} owners`)
        .setTimestamp();
    
    // Listar cada owner
    owners.forEach((ownerId, index) => {
        embed.addFields({
            name: `#${index + 1} - <@${ownerId}>`,
            value: `ID: \`${ownerId}\``,
            inline: false
        });
    });
    
    await interaction.reply({ embeds: [embed], ephemeral: true });
}

async function addOwner(interaction) {
    const user = interaction.options.getUser('user');
    const owners = loadOwners();
    
    // Verificar si ya es owner
    if (owners.includes(user.id)) {
        return interaction.reply({
            content: `❌ <@${user.id}> ya es owner del bot.`,
            ephemeral: true
        });
    }
    
    // Añadir nuevo owner
    owners.push(user.id);
    saveOwners(owners);
    
    const embed = new EmbedBuilder()
        .setColor(0x00FF88)
        .setTitle('✅ OWNER AÑADIDO')
        .setDescription(`**${user.tag}** ahora es owner del bot.`)
        .addFields(
            { name: '👤 Usuario', value: `<@${user.id}>`, inline: true },
            { name: '🆔 ID', value: `\`${user.id}\``, inline: true },
            { name: '📊 Total Owners', value: `${owners.length}`, inline: true }
        )
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
    
    // Notificar al nuevo owner
    try {
        await user.send(`🎉 ¡Ahora eres owner del **EuroMaster League Bot**!\nPuedes usar \`/owner\` para gestionar otros owners.`);
    } catch (error) {
        console.log('No se pudo enviar DM al nuevo owner:', error.message);
    }
}

async function removeOwner(interaction) {
    const user = interaction.options.getUser('user');
    let owners = loadOwners();
    
    // Verificar si es owner
    if (!owners.includes(user.id)) {
        return interaction.reply({
            content: `❌ <@${user.id}> no es owner del bot.`,
            ephemeral: true
        });
    }
    
    // No permitir remover al último owner
    if (owners.length <= 1) {
        return interaction.reply({
            content: '❌ No puedes remover al último owner del bot.',
            ephemeral: true
        });
    }
    
    // Remover owner
    owners = owners.filter(id => id !== user.id);
    saveOwners(owners);
    
    const embed = new EmbedBuilder()
        .setColor(0xFF4444)
        .setTitle('❌ OWNER REMOVIDO')
        .setDescription(`**${user.tag}** ya no es owner del bot.`)
        .addFields(
            { name: '👤 Usuario', value: `<@${user.id}>`, inline: true },
            { name: '📊 Total Owners', value: `${owners.length}`, inline: true }
        )
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
}

async function checkOwner(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const owners = loadOwners();
    const isUserOwner = owners.includes(user.id);
    
    const embed = new EmbedBuilder()
        .setColor(isUserOwner ? 0x00FF88 : 0xFF4444)
        .setTitle('🔍 VERIFICACIÓN DE OWNER')
        .setDescription(`**${user.tag}** ${isUserOwner ? 'ES' : 'NO ES'} owner del bot.`)
        .addFields(
            { name: '👤 Usuario', value: `<@${user.id}>`, inline: true },
            { name: '🆔 ID', value: `\`${user.id}\``, inline: true },
            { name: '📊 Total Owners', value: `${owners.length}`, inline: true }
        )
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed], ephemeral: true });
}