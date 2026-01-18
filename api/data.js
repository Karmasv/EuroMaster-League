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
