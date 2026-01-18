module.exports = async (req, res) => {
  console.log('=== DEBUG ENDPOINT CALLED ===');
  
  // Verificar TODAS las variables
  const envVars = {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN ? 
      `✅ DEFINIDO (${process.env.GITHUB_TOKEN.substring(0, 10)}...)` : '❌ NO DEFINIDO',
    GITHUB_REPO: process.env.GITHUB_REPO || '❌ NO DEFINIDO',
    GITHUB_BRANCH: process.env.GITHUB_BRANCH || '❌ NO DEFINIDO',
    VERCEL: process.env.VERCEL || '❌ NO VERCEL',
    NODE_ENV: process.env.NODE_ENV || '❌ NO DEFINIDO'
  };
  
  // Verificar que api/data.js existe
  const fs = require('fs');
  const path = require('path');
  const apiDataExists = fs.existsSync(path.join(__dirname, 'data.js'));
  
  res.json({
    status: 'debug',
    timestamp: new Date().toISOString(),
    environment: envVars,
    files: {
      'api/data.js': apiDataExists ? '✅ EXISTE' : '❌ NO EXISTE',
      'vercel.json': fs.existsSync('vercel.json') ? '✅ EXISTE' : '❌ NO EXISTE'
    },
    request: {
      method: req.method,
      query: req.query,
      url: req.url
    }
  });
};
