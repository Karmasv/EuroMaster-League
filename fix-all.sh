#!/bin/bash

echo "🔗 CONECTANDO BOT DE DISCORD CON LA WEB VIA GITHUB DB..."

# ============================================
# 1. CENTRALIZAR DATOS EN GITHUB
# ============================================
echo -e "\n📦 Centralizando datos en GitHub..."

# Crear estructura de datos si no existe
mkdir -p data

# Mover/copiar datos del bot si existen
if [ -d "discord-bot/data" ] && [ "$(ls -A discord-bot/data 2>/dev/null)" ]; then
    echo "Moviendo datos del bot a repositorio central..."
    cp -n discord-bot/data/*.json data/ 2>/dev/null
    echo "✅ Datos del bot copiados a /data/"
else
    echo "Creando datos de ejemplo..."
    cat > data/teams.json << 'EOF'
[
  {"id": 1, "name": "Equipo Ejemplo", "points": 0}
]
EOF
    cat > data/players.json << 'EOF'
[
  {"id": 1, "name": "Jugador Ejemplo", "team": "Equipo Ejemplo"}
]
EOF
    cat > data/matches.json << 'EOF'
[]
EOF
    cat > data/standings.json << 'EOF'
[]
EOF
fi

# ============================================
# 2. UNIFICAR githubDB.js (BOT + WEB)
# ============================================
echo -e "\n🤖 Unificando githubDB.js..."

# Crear el githubDB.js centralizado en raíz
cat > githubDB.js << 'EOF'
// GITHUB DB UNIFICADO - Para Web (Vercel) y Bot (Discord)

const fs = require('fs');
const path = require('path');
const { Octokit } = require('@octokit/rest');

class GitHubDB {
  constructor() {
    this.token = process.env.GITHUB_TOKEN;
    this.repo = process.env.GITHUB_REPO || 'Karmasv/EuroMaster-League';
    this.branch = process.env.GITHUB_BRANCH || 'main';
    this.owner = this.repo.split('/')[0];
    this.repoName = this.repo.split('/')[1];
    
    this.octokit = new Octokit({ auth: this.token });
    
    // Mapeo de colecciones a archivos
    this.collections = {
      teams: 'data/teams.json',
      players: 'data/players.json',
      matches: 'data/matches.json',
      standings: 'data/standings.json',
      schedule: 'data/schedule.json',
      stats: 'data/stats.json'
    };
  }

  async get(collection) {
    try {
      if (!this.collections[collection]) {
        throw new Error(`Colección no válida: ${collection}`);
      }

      const filePath = this.collections[collection];
      
      const { data } = await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repoName,
        path: filePath,
        ref: this.branch
      });

      if (data.content) {
        const content = Buffer.from(data.content, 'base64').toString('utf8');
        return JSON.parse(content);
      }
      
      return [];
      
    } catch (error) {
      if (error.status === 404) {
        console.log(`Archivo ${collection} no encontrado, creando vacío...`);
        return [];
      }
      console.error('Error en GitHubDB.get:', error.message);
      throw error;
    }
  }

  async set(collection, data) {
    try {
      if (!this.collections[collection]) {
        throw new Error(`Colección no válida: ${collection}`);
      }

      const filePath = this.collections[collection];
      const content = JSON.stringify(data, null, 2);
      const contentEncoded = Buffer.from(content).toString('base64');
      
      // Primero intentamos obtener el SHA del archivo existente
      let sha = null;
      try {
        const existing = await this.octokit.repos.getContent({
          owner: this.owner,
          repo: this.repoName,
          path: filePath,
          ref: this.branch
        });
        sha = existing.data.sha;
      } catch (e) {
        // Archivo no existe, se creará nuevo
      }

      const response = await this.octokit.repos.createOrUpdateFileContents({
        owner: this.owner,
        repo: this.repoName,
        path: filePath,
        message: `Update ${collection} from ${process.env.VERCEL ? 'web' : 'bot'}`,
        content: contentEncoded,
        branch: this.branch,
        sha: sha
      });

      console.log(`✅ ${collection} actualizado en GitHub`);
      return response.data;

    } catch (error) {
      console.error('Error en GitHubDB.set:', error.message);
      throw error;
    }
  }

  async update(collection, id, updates) {
    const items = await this.get(collection);
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) {
      throw new Error(`${collection} con id ${id} no encontrado`);
    }
    
    items[index] = { ...items[index], ...updates };
    await this.set(collection, items);
    return items[index];
  }

  async add(collection, item) {
    const items = await this.get(collection);
    
    // Generar ID si no existe
    if (!item.id) {
      const maxId = items.length > 0 ? Math.max(...items.map(i => i.id || 0)) : 0;
      item.id = maxId + 1;
    }
    
    items.push(item);
    await this.set(collection, items);
    return item;
  }

  async delete(collection, id) {
    const items = await this.get(collection);
    const filtered = items.filter(item => item.id !== id);
    
    if (filtered.length === items.length) {
      throw new Error(`${collection} con id ${id} no encontrado`);
    }
    
    await this.set(collection, filtered);
    return true;
  }
}

// Para usar en el bot (Node.js)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GitHubDB;
}

// Para usar en el navegador (Web)
if (typeof window !== 'undefined') {
  // Versión simplificada para el navegador que usa la API
  window.GitHubDBWeb = {
    async get(collection) {
      const response = await fetch(`/api/data?file=${collection}`);
      if (!response.ok) throw new Error('Error en API');
      return await response.json();
    },
    
    async set(collection, data) {
      const response = await fetch(`/api/data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection, data })
      });
      return await response.json();
    }
  };
}
EOF

echo "✅ githubDB.js centralizado creado"

# ============================================
# 3. ACTUALIZAR EL BOT DE DISCORD
# ============================================
echo -e "\n🤖 Actualizando bot de Discord..."

# Reemplazar el githubDB.js del bot por el centralizado
cp githubDB.js discord-bot/githubDB.js

# Crear archivo de configuración para el bot
cat > discord-bot/config.js << 'EOF'
// Configuración del Bot de Discord
require('dotenv').config();

module.exports = {
  // Token del Bot de Discord (OBTENER EN: https://discord.com/developers/applications)
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  
  // ID del servidor (Guild) - Opcional para comandos slash
  GUILD_ID: process.env.GUILD_ID,
  
  // Configuración de GitHub DB
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  GITHUB_REPO: process.env.GITHUB_REPO || 'Karmasv/EuroMaster-League',
  GITHUB_BRANCH: process.env.GITHUB_BRANCH || 'main',
  
  // Prefijo de comandos
  PREFIX: process.env.PREFIX || '!',
  
  // IDs de administradores
  ADMIN_IDS: process.env.ADMIN_IDS ? process.env.ADMIN_IDS.split(',') : []
};
EOF

# Crear ejemplo de comando que usa GitHubDB
cat > discord-bot/commands/data-commands.js << 'EOF'
const GitHubDB = require('../githubDB.js');
const config = require('../config.js');

module.exports = {
  name: 'teams',
  description: 'Muestra los equipos de la liga',
  async execute(interaction) {
    try {
      const db = new GitHubDB();
      const teams = await db.get('teams');
      
      if (teams.length === 0) {
        return await interaction.reply('No hay equipos registrados.');
      }
      
      const teamsList = teams.map(t => `• ${t.name} (${t.points || 0} pts)`).join('\n');
      await interaction.reply(`**Equipos de la Liga:**\n${teamsList}`);
      
    } catch (error) {
      console.error('Error en comando teams:', error);
      await interaction.reply('Error al obtener equipos.');
    }
  }
};
EOF

echo "✅ Bot actualizado para usar GitHubDB centralizado"

# ============================================
# 4. ACTUALIZAR API PARA WEB (ESCRITURA)
# ============================================
echo -e "\n🌐 Actualizando API para escritura..."

cat > api/data.js << 'EOF'
const { Octokit } = require('@octokit/rest');

const octokit = new Octokit({ 
  auth: process.env.GITHUB_TOKEN 
});

const owner = process.env.GITHUB_REPO.split('/')[0];
const repo = process.env.GITHUB_REPO.split('/')[1];
const branch = process.env.GITHUB_BRANCH || 'main';

const collections = {
  teams: 'data/teams.json',
  players: 'data/players.json',
  matches: 'data/matches.json',
  standings: 'data/standings.json'
};

module.exports = async (req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Manejar preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET: Leer datos
    if (req.method === 'GET') {
      const { file } = req.query;
      
      if (!file || !collections[file]) {
        return res.status(400).json({ error: 'Archivo no válido' });
      }

      try {
        const { data } = await octokit.repos.getContent({
          owner,
          repo,
          path: collections[file],
          ref: branch
        });

        const content = Buffer.from(data.content, 'base64').toString('utf8');
        return res.status(200).json(JSON.parse(content));
        
      } catch (error) {
        if (error.status === 404) {
          return res.status(200).json([]);
        }
        throw error;
      }
    }
    
    // POST: Escribir datos (desde la web)
    if (req.method === 'POST') {
      const { collection, data } = req.body;
      
      if (!collection || !collections[collection]) {
        return res.status(400).json({ error: 'Colección no válida' });
      }

      const content = JSON.stringify(data, null, 2);
      const contentEncoded = Buffer.from(content).toString('base64');
      
      // Obtener SHA si existe
      let sha = null;
      try {
        const existing = await octokit.repos.getContent({
          owner,
          repo,
          path: collections[collection],
          ref: branch
        });
        sha = existing.data.sha;
      } catch (e) {
        // Archivo no existe
      }

      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: collections[collection],
        message: `Update ${collection} from web interface`,
        content: contentEncoded,
        branch,
        sha
      });

      return res.status(200).json({ success: true, message: 'Datos actualizados' });
    }

    return res.status(405).json({ error: 'Método no permitido' });

  } catch (error) {
    console.error('API Error:', error.message);
    return res.status(500).json({ 
      error: 'Error del servidor',
      details: error.message 
    });
  }
};
EOF

echo "✅ API actualizada con soporte para escritura"

# ============================================
# 5. ACTUALIZAR WEB (main.js) PARA USAR API
# ============================================
echo -e "\n🌍 Actualizando web (main.js)..."

# Crear funciones de ejemplo para la web
cat >> main.js << 'EOF'

// ============================================
// FUNCIONES PARA GITHUB DB (WEB)
// ============================================

class WebDataManager {
  constructor() {
    this.baseURL = window.location.origin;
  }

  async getData(type) {
    try {
      const response = await fetch(`${this.baseURL}/api/data?file=${type}`);
      if (!response.ok) throw new Error('Error en API');
      return await response.json();
    } catch (error) {
      console.error(`Error obteniendo ${type}:`, error);
      return [];
    }
  }

  async saveData(type, data) {
    try {
      const response = await fetch(`${this.baseURL}/api/data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection: type, data })
      });
      
      if (!response.ok) throw new Error('Error guardando datos');
      return await response.json();
    } catch (error) {
      console.error(`Error guardando ${type}:`, error);
      return { error: true, message: error.message };
    }
  }

  // Métodos específicos para la liga
  async getTeams() {
    return await this.getData('teams');
  }

  async getMatches() {
    return await this.getData('matches');
  }

  async getStandings() {
    return await this.getData('standings');
  }

  async addTeam(teamData) {
    const teams = await this.getTeams();
    teamData.id = teams.length > 0 ? Math.max(...teams.map(t => t.id)) + 1 : 1;
    teams.push(teamData);
    return await this.saveData('teams', teams);
  }

  async updateMatch(matchId, result) {
    const matches = await this.getMatches();
    const matchIndex = matches.findIndex(m => m.id === matchId);
    
    if (matchIndex === -1) return { error: true, message: 'Partido no encontrado' };
    
    matches[matchIndex] = { ...matches[matchIndex], ...result };
    return await this.saveData('matches', matches);
  }
}

// Hacer disponible globalmente
window.dataManager = new WebDataManager();

// Ejemplo de uso automático al cargar
document.addEventListener('DOMContentLoaded', async function() {
  console.log('WebDataManager cargado');
  
  // Cargar datos de ejemplo si la página lo necesita
  if (document.getElementById('teams-list')) {
    const teams = await window.dataManager.getTeams();
    console.log('Equipos cargados:', teams);
  }
});
EOF

echo "✅ main.js actualizado con WebDataManager"

# ============================================
# 6. ACTUALIZAR package.json DEL BOT
# ============================================
echo -e "\n📦 Instalando dependencias para el bot..."

cd discord-bot
if [ -f "package.json" ]; then
    npm install @octokit/rest dotenv
    echo "✅ Dependencias del bot instaladas"
else
    cat > package.json << 'EOF'
{
  "name": "euromaster-discord-bot",
  "version": "1.0.0",
  "description": "Bot de Discord para EuroMaster League",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "discord.js": "^14.14.1",
    "@octokit/rest": "^20.0.0",
    "dotenv": "^16.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
EOF
    npm install
    echo "✅ package.json del bot creado e instalado"
fi
cd ..

# ============================================
# 7. CREAR .env COMPLETO
# ============================================
echo -e "\n🔐 Creando archivo .env de ejemplo..."

cat > .env.example << 'EOF'
# ============================================
# TOKENS CRÍTICOS - NO COMPARTIR
# ============================================

# 1. GITHUB (Para DB compartida)
# Crear en: https://github.com/settings/tokens
# Permisos necesarios: repo (todo)
GITHUB_TOKEN=tu_token_de_github_aqui
GITHUB_REPO=Karmasv/EuroMaster-League
GITHUB_BRANCH=main

# 2. DISCORD BOT
# Crear en: https://discord.com/developers/applications
# Token del Bot
DISCORD_TOKEN=tu_token_del_bot_aqui

# ID del servidor (opcional, para desarrollo)
GUILD_ID=tu_server_id_aqui

# Prefijo de comandos
PREFIX=!

# IDs de administradores (separados por comas)
ADMIN_IDS=tu_id_de_discord_aqui

# ============================================
# CONFIGURACIÓN VERCEL (Web)
# ============================================
VERCEL_ENV=production
NODE_ENV=production
EOF

echo "✅ .env.example creado"

# ============================================
# 8. SCRIPT DE SINCRONIZACIÓN
# ============================================
echo -e "\n🔄 Creando script de sincronización..."

cat > sync-data.sh << 'EOF'
#!/bin/bash

echo "🔄 Sincronizando datos entre Bot y Web..."

# 1. Traer datos actuales de GitHub
echo "Descargando datos de GitHub..."
curl -s -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/Karmasv/EuroMaster-League/contents/data/teams.json \
  | jq -r '.content' | base64 --decode > data/teams.json 2>/dev/null

# 2. Mostrar resumen
echo "📊 Estado actual:"
for file in data/*.json; do
  if [ -f "$file" ]; then
    count=$(jq '. | length' "$file" 2>/dev/null || echo "0")
    echo "  $(basename $file): $count registros"
  fi
done

# 3. Instrucciones para el bot
echo ""
echo "🤖 Para ejecutar el bot:"
echo "   cd discord-bot"
echo "   npm start"
echo ""
echo "🌐 La web está en: https://euro-master-league.vercel.app"
echo ""
echo "🔗 Ambos usan la misma base de datos en GitHub"
EOF

chmod +x sync-data.sh

# ============================================
# 9. RESUMEN FINAL
# ============================================
echo -e "\n🎯 ¡CONFIGURACIÓN COMPLETA!"

echo -e "\n📋 ARQUITECTURA FINAL:"
echo "  ┌─────────────────┐    ┌─────────────────┐"
echo "  │   BOT DISCORD   │    │    WEB VERCEL   │"
echo "  │  (githubDB.js)  │    │  (githubDB.js)  │"
echo "  └────────┬────────┘    └────────┬────────┘"
echo "           │                       │"
echo "           └──────────┬────────────┘"
echo "                      ▼"
echo "           ┌─────────────────────┐"
echo "           │   GITHUB REPO DB    │"
echo "           │  (data/*.json)      │"
echo "           └─────────────────────┘"

echo -e "\n🚀 PASOS FINALES:"

echo -e "\n1. 🔑 CONFIGURAR TOKENS (OBLIGATORIO):"
echo "   A) Token de GitHub:"
echo "      • Ve a: https://github.com/settings/tokens"
echo "      • Crea token con permiso 'repo'"
echo "      • Añade a Vercel: GITHUB_TOKEN"
echo "      • Añade al bot: en .env del bot"
echo ""
echo "   B) Token de Discord Bot:"
echo "      • Ve a: https://discord.com/developers/applications"
echo "      • Crea aplicación → Bot → Token"
echo "      • Añade al .env del bot: DISCORD_TOKEN"

echo -e "\n2. 📤 SUBIR CAMBIOS:"
echo "   git add ."
echo "   git commit -m 'feat: Sistema unificado bot+web con GitHub DB'"
echo "   git push"

echo -e "\n3. 🤖 PROBAR BOT:"
echo "   cd discord-bot"
echo "   npm install"
echo "   echo 'DISCORD_TOKEN=tu_token' > .env"
echo "   echo 'GITHUB_TOKEN=tu_token' >> .env"
echo "   npm start"

echo -e "\n4. 🌐 PROBAR WEB:"
echo "   https://euro-master-league.vercel.app/test-vercel.html"
echo "   https://euro-master-league.vercel.app/teams"

echo -e "\n5. 🔄 SINCRONIZAR:"
echo "   ./sync-data.sh"

echo -e "\n⚠️  RECUERDA:"
echo "   • El bot necesita hosting 24/7 (Railway, Heroku, VPS)"
echo "   • La web se actualiza automáticamente con cada cambio"
echo "   • Ambos leen/escriben el MISMO repositorio GitHub"

echo -e "\n✅ ¡Listo! Ahora tu bot y tu web comparten la misma base de datos via GitHub."

