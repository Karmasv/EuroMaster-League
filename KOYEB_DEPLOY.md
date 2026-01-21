 # Deploy del Bot en Koyeb

## 🚀 Deployment rápido

1. Ve a [Koyeb.com](https://koyeb.com) → Regístrate con GitHub
2. Click en **"Create App"**
3. Selecciona **"GitHub"** como fuente
4. Selecciona este repositorio: `Karmasv/EuroMaster-League`
5. En "Root Directory" escribe: `discord-bot`

## 🔧 Configuración

### Environment:
- **Build Command:** `npm install`
- **Run Command:** `node index.js`

### Variables de Entorno (en la sección "Variables"):
```
DISCORD_TOKEN=tu_token_discord
GITHUB_TOKEN=tu_token_github
GITHUB_REPO=Karmasv/EuroMaster-League
GITHUB_BRANCH=main
WEB_API_URL=https://euromasterleague.vercel.app/api/data
LOG_CHANNEL_ID=tu_canal_de_logs
```

6. Click en **"Deploy"**

## ✅ Verificación

Espera ~2-3 minutos al deploy.
Revisa los logs para ver si conecta a Discord.

## 🌐 URLs

- Dashboard: https://app.koyeb.com/apps/{tu-app-name}
- Health: `https://{tu-app-name}.koyeb.app/health`

## ⚠️ Si no funciona

Koyeb puede tener las mismas limitaciones de red que Render. Si falla, la única solución real es usar un VPS con tu propia IP (aunque cueste ~$3-5/mes).
