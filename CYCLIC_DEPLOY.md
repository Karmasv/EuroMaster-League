# Deploy del Bot en Cyclic.sh

## 🚀 Deployment rápido

1. Ve a [Cyclic.sh](https://cyclic.sh) → Regístrate con GitHub
2. Click en **"Connect Repository"**
3. Selecciona este repositorio: `Karmasv/EuroMaster-League`
4. En "Root Directory" selecciona: `discord-bot`
5. Cyclic detectará `package.json` automáticamente

## 🔧 Configuración

### Build Settings:
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Node Version:** 18 o 20

### Variables de Entorno:
En Cyclic Dashboard → Variables:

```
DISCORD_TOKEN=tu_token_discord_aqui
GITHUB_TOKEN=tu_token_github_aqui
GITHUB_REPO=Karmasv/EuroMaster-League
GITHUB_BRANCH=main
WEB_API_URL=https://euromasterleague.vercel.app/api/data
LOG_CHANNEL_ID=tu_canal_de_logs
```

6. Click en **"Deploy"**

## ✅ Verificación

Logs esperados:
```
🚀 Conectando bot a Discord...
✅ Bot conectado exitosamente
✅ Servidor HTTP escuchando en puerto...
```

## 🌐 URLs

- Bot: `https://{tu-app}.cyclic.app`
- Health: `https://{tu-app}.cyclic.app/health`

## ⚠️ Nota importante

Si Cyclic también tiene problemas con WebSockets, la causa puede ser:
1. El token de Discord está en un formato antiguo
2. Hay restricciones en la cuenta de Discord Developer
3. El bot fue deshabilitado temporalmente por Discord

### Verificar token:
1. Ve a https://discord.com/developers/applications
2. Click en tu bot → Bot
3. Asegúrate que el toggle "PRESENCE INTENT" está ACTIVADO
4. Asegúrate que "SERVER MEMBERS INTENT" está ACTIVADO
5. Regenera el token si es necesario

