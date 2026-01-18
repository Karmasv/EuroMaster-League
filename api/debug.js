module.exports = async (req, res) => {
  res.json({
    status: 'API Funcionando',
    env: {
      GITHUB_TOKEN: process.env.GITHUB_TOKEN ? '✅ DEFINIDO' : '❌ FALTANTE',
      GITHUB_REPO: process.env.GITHUB_REPO || '❌ FALTANTE',
      GITHUB_BRANCH: process.env.GITHUB_BRANCH || '❌ FALTANTE',
      NODE_ENV: process.env.NODE_ENV || 'development'
    },
    time: new Date().toISOString(),
    request: {
      method: req.method,
      query: req.query,
      url: req.url
    }
  });
};
