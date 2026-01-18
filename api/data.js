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
    const { collection, data } = req.body;
    if (!collection || !collections[collection]) {
      return res.status(400).json({ error: 'Invalid collection' });
    }
    
    const content = JSON.stringify(data, null, 2);
    const contentEncoded = Buffer.from(content).toString('base64');
    
    let sha = null;
    try {
      const existing = await octokit.repos.getContent({
        owner, repo, path: collections[collection], ref: branch
      });
      sha = existing.data.sha;
    } catch (e) {}
    
    await octokit.repos.createOrUpdateFileContents({
      owner, repo, path: collections[collection],
      message: `Update ${collection}`,
      content: contentEncoded, branch, sha
    });
    
    return res.status(200).json({ success: true });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
};
