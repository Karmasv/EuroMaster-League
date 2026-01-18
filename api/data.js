const { Octokit } = require('@octokit/rest');

// INICIALIZAR Octokit CON TOKEN CORRECTO
const octokit = new Octokit({ 
  auth: process.env.GITHUB_TOKEN  // ← TOKEN aquí, no el repo
});

// OBTENER VARIABLES CORRECTAMENTE
const repoInfo = process.env.GITHUB_REPO || 'Karmasv/EuroMaster-League';
const owner = repoInfo.split('/')[0];      // "Karmasv"
const repo = repoInfo.split('/')[1];       // "EuroMaster-League"
const branch = process.env.GITHUB_BRANCH || 'main';

// COLECCIONES DE DATOS
const collections = {
  teams: 'data/teams.json',
  players: 'data/players.json',
  matches: 'data/matches.json',
  standings: 'data/standings.json'
};

module.exports = async (req, res) => {
  // CONFIGURAR CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // MANEJAR PREFLIGHT
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // --- GET: LEER DATOS ---
    if (req.method === 'GET') {
      const { file } = req.query;
      
      if (!file || !collections[file]) {
        return res.status(400).json({ 
          error: 'Archivo no válido',
          available: Object.keys(collections) 
        });
      }

      try {
        // LEER ARCHIVO DE GITHUB
        const { data } = await octokit.repos.getContent({
          owner,
          repo,
          path: collections[file],
          ref: branch
        });

        // DECODIFICAR BASE64
        const content = Buffer.from(data.content, 'base64').toString('utf8');
        return res.status(200).json(JSON.parse(content));
        
      } catch (error) {
        if (error.status === 404) {
          // ARCHIVO NO EXISTE → DEVOLVER ARRAY VACÍO
          return res.status(200).json([]);
        }
        throw error;
      }
    }
    
    // --- POST: ESCRIBIR DATOS (desde web) ---
    if (req.method === 'POST') {
      const { collection, data } = req.body;
      
      if (!collection || !collections[collection]) {
        return res.status(400).json({ 
          error: 'Colección no válida',
          available: Object.keys(collections) 
        });
      }

      const content = JSON.stringify(data, null, 2);
      const contentEncoded = Buffer.from(content).toString('base64');
      
      // OBTENER SHA SI EXISTE
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
        // Archivo no existe (se creará nuevo)
      }

      // ACTUALIZAR EN GITHUB
      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: collections[collection],
        message: `Update ${collection} from web interface`,
        content: contentEncoded,
        branch,
        sha
      });

      return res.status(200).json({ 
        success: true, 
        message: 'Datos actualizados en GitHub' 
      });
    }

    // MÉTODO NO PERMITIDO
    return res.status(405).json({ error: 'Método no permitido' });

  } catch (error) {
    console.error('❌ API Error:', error.message);
    return res.status(500).json({ 
      error: 'Error del servidor',
      details: error.message 
    });
  }
};
