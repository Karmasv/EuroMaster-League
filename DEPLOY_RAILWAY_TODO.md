# TODO - Deploy en Railway

## 🔧 Paso 1: Corregir railway.json

El archivo `railway.json` actual tiene un error: el comando de inicio usa `index.js` en lugar de la ruta correcta dentro de `discord-bot/`.

**Edita `railway.json` y cambia:**

```json
"startCommand": "node discord-bot/index.js"
```

---

## 🔐 Paso 2: Configurar Variables de Entorno en Railway

En Railway Dashboard → Settings → Variables, añade:

```
DISCORD_TOKEN=tu_token_discord_aqui
GITHUB_TOKEN=tu_token_github_aqui
GITHUB_REPO=Karmasv/EuroMaster-League
GITHUB_BRANCH=main
WEB_API_URL=https://euromasterleague.vercel.app/api/data
LOG_CHANNEL_ID=tu_canal_de_logs
```

---

## 🚀 Paso 3: Deploy

1. Ve a [Railway.app](https://railway.app)
2. Click en **"New Project"** → **"Deploy from GitHub repo"**
3. Selecciona este repositorio: `Karmasv/EuroMaster-League`
4. Railway detectará automáticamente el archivo `railway.json`
5. Click en **"Deploy"**

---

## ✅ Paso 4: Verificación

Después del deploy, verifica en los logs:
```
✅ Bot conectado exitosamente
✅ Servidor HTTP escuchando en puerto 8080
```

Health check: `https://tu-proyecto.up.railway.app/health`

---

## 🆘 Si hay problemas

1. **El bot no conecta:** Verifica que `DISCORD_TOKEN` es correcto (72 caracteres)
2. **Error 503:** Verifica que el health check responde
3. **Logs:** Revisa los logs en Railway Dashboard

---

## 📝 Resumen de cambios necesarios

| Archivo | Cambio |
|---------|--------|
| `railway.json` | Corregir `startCommand` a `node discord-bot/index.js` |

El código del bot ya es compatible con Railway:
- ✅ Usa `process.env.PORT` (Railway usa 8080)
- ✅ Endpoints `/health` y `/` funcionan
- ✅ Manejo de errores robusto

