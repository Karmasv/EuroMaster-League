require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

// ===== VERIFICACIÓN DE VARIABLES =====
console.log('🔍 Verificando configuración...');

const requiredVars = ['DISCORD_TOKEN', 'DISCORD_CLIENT_ID', 'DISCORD_GUILD_ID'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    console.error('❌ ERROR: Faltan variables en .env');
    missingVars.forEach(varName => {
        console.log(`   - ${varName}`);
    });
    console.log('\n💡 Solución:');
    console.log('   1. Copia .env.example a .env');
    console.log('   2. Edita .env con tus datos de Discord');
    console.log('   3. Obtén los datos en: https://discord.com/developers/applications');
    process.exit(1);
}

// ===== CARGAR COMANDOS =====
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

console.log(`📂 Buscando comandos en ${commandsPath}...`);
console.log(`📄 Archivos encontrados: ${commandFiles.length}`);

for (const file of commandFiles) {
    try {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        
        if ('data' in command) {
            commands.push(command.data.toJSON());
            console.log(`   ✅ ${command.data.name} (${file})`);
        } else {
            console.log(`   ⚠️  ${file} - No tiene propiedad 'data'`);
        }
    } catch (error) {
        console.log(`   ❌ ${file} - Error: ${error.message}`);
    }
}

// ===== REGISTRAR COMANDOS =====
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log(`\n🔄 Registrando ${commands.length} comandos...`);
        console.log(`   Servidor: ${process.env.DISCORD_GUILD_ID}`);
        console.log(`   Bot ID: ${process.env.DISCORD_CLIENT_ID}`);
        
        const startTime = Date.now();
        
        const data = await rest.put(
            Routes.applicationGuildCommands(
                process.env.DISCORD_CLIENT_ID,
                process.env.DISCORD_GUILD_ID
            ),
            { body: commands }
        );
        
        const elapsedTime = Date.now() - startTime;
        
        console.log(`\n🎉 ${data.length} comandos registrados exitosamente en ${elapsedTime}ms!`);
        console.log('\n📋 LISTA DE COMANDOS DISPONIBLES:');
        console.log('='.repeat(50));
        
        // Agrupar comandos por categoría
        const categorized = {};
        data.forEach(cmd => {
            const category = cmd.name.split('_')[0] || 'general';
            if (!categorized[category]) {
                categorized[category] = [];
            }
            categorized[category].push(cmd);
        });
        
        // Mostrar por categorías
        Object.entries(categorized).forEach(([category, cmds]) => {
            console.log(`\n🔹 ${category.toUpperCase()}:`);
            cmds.forEach(cmd => {
                console.log(`   /${cmd.name} - ${cmd.description}`);
                
                // Mostrar opciones si las tiene
                if (cmd.options && cmd.options.length > 0) {
                    cmd.options.forEach(opt => {
                        if (opt.type === 1) { // Subcomando
                            console.log(`     ↳ ${opt.name}: ${opt.description}`);
                            if (opt.options) {
                                opt.options.forEach(subOpt => {
                                    console.log(`       • ${subOpt.name}: ${subOpt.description}`);
                                });
                            }
                        }
                    });
                }
            });
        });
        
        console.log('\n' + '='.repeat(50));
        console.log('\n🚀 Para iniciar el bot ejecuta:');
        console.log('   node index.js');
        console.log('\n🔄 Para desarrollo con auto-recarga:');
        console.log('   npm run dev');
        
        // Verificar owners
        if (process.env.INITIAL_OWNER_ID) {
            console.log(`\n👑 Owner inicial configurado: ${process.env.INITIAL_OWNER_ID}`);
            console.log('   Usa /owner add @usuario para añadir más owners');
        }
        
    } catch (error) {
        console.error('\n❌ ERROR registrando comandos:', error);
        
        // Errores comunes y soluciones
        if (error.code === 50001) {
            console.log('\n💡 SOLUCIÓN: El bot no tiene acceso al servidor.');
            console.log('   1. Invita el bot con este link (reemplaza CLIENT_ID):');
            console.log(`      https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&permissions=8&scope=bot%20applications.commands`);
        } else if (error.code === 50013) {
            console.log('\n💡 SOLUCIÓN: El bot no tiene permisos.');
            console.log('   Asegúrate de que el bot tenga el permiso "Applications Commands"');
        } else if (error.code === 40060) {
            console.log('\n💡 SOLUCIÓN: Demasiados comandos (máximo 100).');
            console.log('   Elimina comandos no usados o usa menos subcomandos.');
        } else if (error.message.includes('ENOENT')) {
            console.log('\n💡 SOLUCIÓN: No se encontró la carpeta commands/');
            console.log('   Crea la carpeta: mkdir commands');
        }
        
        process.exit(1);
    }
})();