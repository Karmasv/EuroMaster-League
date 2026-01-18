const { Octokit } = require('@octokit/rest');

// CONFIGURACIÓN
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO || 'Karmasv/EuroMaster-League';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

if (!GITHUB_TOKEN) {
  console.error('❌ GITHUB_TOKEN no está definido en las variables de entorno');
}

// Parsear owner/repo
const [owner, repo] = GITHUB_REPO.split('/');

// Inicializar Octokit
const octokit = new Octokit({ 
  auth: GITHUB_TOKEN
});

// Mapeo de archivos
const FILE_MAP = {
  teams: 'data/teams.json',
  players: 'data/players.json',
  matches: 'data/matches.json',
  standings: 'data/standings.json'
};

module.exports = async (req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PATCH,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Manejar preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // --- GET: Leer datos ---
    if (req.method === 'GET') {
      const { file } = req.query;
      
      if (!file || !FILE_MAP[file]) {
        return res.status(400).json({ 
          error: 'Parámetro "file" requerido o inválido',
          available: Object.keys(FILE_MAP),
          example: '/api/data?file=teams'
        });
      }

      console.log(`📥 GET ${file} desde GitHub...`);

      try {
        const { data } = await octokit.repos.getContent({
          owner,
          repo,
          path: FILE_MAP[file],
          ref: GITHUB_BRANCH
        });

        // Decodificar base64
        const content = Buffer.from(data.content, 'base64').toString('utf8');
        const jsonData = JSON.parse(content);
        
        console.log(`✅ ${file} obtenido: ${jsonData.length || 0} registros`);
        return res.status(200).json(jsonData);

      } catch (error) {
        if (error.status === 404) {
          console.log(`📭 ${file} no encontrado, devolviendo array vacío`);
          return res.status(200).json([]);
        }
        
        console.error(`❌ Error obteniendo ${file}:`, error.message);
        return res.status(500).json({ 
          error: 'Error al obtener datos de GitHub',
          details: error.message 
        });
      }
    }

    // --- POST: Escribir datos ---
    if (req.method === 'POST') {
      const { collection, data } = req.body;
      
      if (!collection || !FILE_MAP[collection]) {
        return res.status(400).json({ 
          error: 'Parámetro "collection" requerido o inválido',
          available: Object.keys(FILE_MAP)
        });
      }

      if (!data) {
        return res.status(400).json({ error: 'Parámetro "data" requerido' });
      }

      console.log(`📤 POST ${collection} a GitHub...`);

      try {
        const content = JSON.stringify(data, null, 2);
        const contentEncoded = Buffer.from(content).toString('base64');

        // Obtener SHA si existe
        let sha = null;
        try {
          const existing = await octokit.repos.getContent({
            owner,
            repo,
            path: FILE_MAP[collection],
            ref: GITHUB_BRANCH
          });
          sha = existing.data.sha;
          console.log(`📝 Actualizando ${collection} existente`);
        } catch (e) {
          console.log(`📄 Creando nuevo archivo ${collection}`);
        }

        // Subir a GitHub
        await octokit.repos.createOrUpdateFileContents({
          owner,
          repo,
          path: FILE_MAP[collection],
          message: `Actualizar ${collection} desde EuroMaster League`,
          content: contentEncoded,
          branch: GITHUB_BRANCH,
          sha: sha,
          committer: {
            name: 'EuroMaster League Bot',
            email: 'bot@euromasterleague.com'
          }
        });

        console.log(`✅ ${collection} actualizado en GitHub`);
        return res.status(200).json({ 
          success: true, 
          message: `Datos de ${collection} actualizados correctamente`,
          records: Array.isArray(data) ? data.length : 1
        });

      } catch (error) {
        console.error(`❌ Error actualizando ${collection}:`, error.message);
        return res.status(500).json({ 
          error: 'Error al actualizar datos en GitHub',
          details: error.message,
          status: error.status
        });
      }
    }

    // Método no soportado
    return res.status(405).json({ 
      error: 'Método no permitido',
      allowed: ['GET', 'POST', 'OPTIONS'] 
    });

  } catch (error) {
    console.error('❌ Error general en API:', error);
    return res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
};
