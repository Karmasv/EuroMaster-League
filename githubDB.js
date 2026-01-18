// GITHUB DB UNIFICADO - Para Web (Vercel) y Bot (Discord)

const fs = require('fs');
const path = require('path');

let Octokit;
let axios;

try {
  Octokit = require('@octokit/rest').Octokit;
} catch (error) {
  console.warn('⚠️ @octokit/rest no disponible');
  Octokit = null;
}

try {
  axios = require('axios');
} catch (error) {
  console.warn('⚠️ axios no disponible');
  axios = null;
}

class GitHubDB {
  constructor() {
    this.token = process.env.GITHUB_TOKEN;
    this.repo = process.env.GITHUB_REPO || 'Karmasv/EuroMaster-League';
    this.branch = process.env.GITHUB_BRANCH || 'main';
    this.owner = this.repo.split('/')[0];
    this.repoName = this.repo.split('/')[1];
    
    // Solo crear octokit si el módulo está disponible
    this.octokit = Octokit ? new Octokit({ auth: this.token }) : null;
    this.useLocalDB = !Octokit;
    
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

      // Si no tenemos Octokit, usar base de datos local
      if (this.useLocalDB) {
        return this._getLocal(collection);
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

      // Si no tenemos Octokit, intentar escribir a través de la API web
      if (this.useLocalDB) {
        console.warn('⚠️ Usando API web para guardar datos...');
        return this._setViaWebAPI(collection, data);
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

  // Método para obtener datos de forma local (fallback)
  _getLocal(collection) {
    try {
      const filePath = path.join(__dirname, this.collections[collection]);
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.warn(`⚠️ No se pudo leer ${collection} localmente:`, error.message);
      return [];
    }
  }

  // Método para guardar datos a través de la API web (Vercel)
  async _setViaWebAPI(collection, data) {
    try {
      if (!axios) {
        throw new Error('axios no disponible para realizar la llamada API');
      }

      const apiUrl = process.env.WEB_API_URL || 'https://euromasterleague.vercel.app/api/data';
      
      const response = await axios.post(apiUrl, {
        file: collection,
        data: data
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });

      console.log(`✅ Datos de ${collection} guardados a través de la API web`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error al guardar ${collection} en API web:`, error.message);
      throw error;
    }
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
