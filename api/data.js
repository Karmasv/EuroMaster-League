const { Octokit } = require('@octokit/rest');

const octokit = new Octokit({ 
  auth: process.env.GITHUB_TOKEN
});

const [owner, repo] = (process.env.GITHUB_REPO || 'Karmasv/EuroMaster-League').split('/');
const branch = process.env.GITHUB_BRANCH || 'main';

const collections = {
  teams: 'data/teams.json',
  players: 'data/players.json',
  matches: 'data/matches.json',
  standings: 'data/standings.json'
};

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // GET
  if (req.method === 'GET') {
    const { file } = req.query;
    if (!file || !collections[file]) {
      return res.status(400).json({ error: 'File parameter required' });
    }
    
    try {
      const { data } = await octokit.repos.getContent({
        owner, repo, path: collections[file], ref: branch
      });
      const content = Buffer.from(data.content, 'base64').toString('utf8');
      return res.status(200).json(JSON.parse(content));
    } catch (error) {
      if (error.status === 404) {
        return res.status(200).json([]);
      }
      return res.status(500).json({ error: error.message });
    }
  }
  
  // POST
  if (req.method === 'POST') {
    // Soporta tanto 'file' como 'collection' para flexibilidad
    const collection = req.body.collection || req.body.file;
    const data = req.body.data;
    
    if (!collection || !collections[collection]) {
      return res.status(400).json({ error: 'Invalid collection' });
    }
    
    if (!data) {
      return res.status(400).json({ error: 'Data is required' });
    }
    
    try {
      const content = JSON.stringify(data, null, 2);
      const contentEncoded = Buffer.from(content).toString('base64');
      
      let sha = null;
      try {
        const existing = await octokit.repos.getContent({
          owner, repo, path: collections[collection], ref: branch
        });
        sha = existing.data.sha;
      } catch (e) {
        // Archivo no existe aún, continuamos sin sha
      }
      
      await octokit.repos.createOrUpdateFileContents({
        owner, repo, path: collections[collection],
        message: `Update ${collection} via API`,
        content: contentEncoded, branch, sha
      });
      
      console.log(`✅ Datos de ${collection} actualizados en GitHub vía API`);
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error(`❌ Error al actualizar ${collection}:`, error.message);
      return res.status(500).json({ error: error.message });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
};
