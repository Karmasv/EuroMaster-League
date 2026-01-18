# Deploy del Bot en Railway

## 🚀 Deployment rápido

1. Ve a [Railway.app](https://railway.app) y regístrate con GitHub
2. Click en **"New Project"** → **"Deploy from GitHub repo"**
3. Selecciona este repositorio: `Karmasv/EuroMaster-League`
4. Railway detectará automáticamente el archivo `railway.json`
5. Añade las variables de entorno:

## 🔧 Variables de Entorno

En Railway Dashboard → Settings → Variables:

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

Después del deploy, verifica en logs:
```
✅ Bot conectado exitosamente
✅ Servidor HTTP escuchando en puerto 8080
```

## 🌐 URLs

- Health check: `https://euromaster-league-bot.up.railway.app/health`
- Dashboard: `https://euromaster-league-bot.up.railway.app`

## 🆘 Troubleshooting

### El bot no conecta
- Verifica que `DISCORD_TOKEN` es correcto (72 caracteres)
- Revisa los logs en Railway Dashboard

### Error de conexión WebSocket
- Railway soporta WebSockets por defecto
- Si hay problemas, contacta soporte de Railway

### Cambiar puerto
- Railway usa el puerto 8080 por defecto
- No necesitas configurar `PORT` manualmente

## 📊 Comparación con Render

| Característica | Railway | Render Free |
|---|---|---|
| WebSockets | ✅ Ilimitado | ⚠️ Limitado |
| Tiempo de deploy | ~2 min | ~3-5 min |
| Memoria | 1GB | 512MB |
|Precio|Gratis|Gratis|

