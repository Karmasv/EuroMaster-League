# Deploy del Bot en Replit

## 🚀 Pasos:

1. Ve a [replit.com](https://replit.com) → Regístrate con GitHub

2. Click en **"Create"** → **"New Repl"**
   - Template: **Node.js**
   - Name: `euromaster-league-bot`

3. Sube los archivos de `discord-bot/`:
   - Borra los archivos por defecto
   - Arrastra y suelta todos los archivos del folder discord-bot

4. Crea un archivo `.env` con:
   ```
   DISCORD_TOKEN=tu_token_de_discord
   GITHUB_TOKEN=tu_token_de_github
   GITHUB_REPO=Karmasv/EuroMaster-League
   GITHUB_BRANCH=main
   WEB_API_URL=https://euromasterleague.vercel.app/api/data
   LOG_CHANNEL_ID=tu_canal
   ```

5. Click en **"Run"** (botón verde ▶️)

## ⚠️ Importante - Para 24/7

Replit free "duerme" después de inactividad. Para mantenerlo despierto:

### GitHub Actions (Recomendado - Ya configurado ✅)
Se ha creado un workflow en `.github/workflows/keep-alive.yml` que hace ping automáticamente cada 5 minutos.

**Configuración requerida:**
1. Ve a tu repositorio GitHub → Settings → Secrets and variables → Actions
2. Añade un nuevo secreto:
   - **Name:** `REPLIT_URL`
   - **Value:** Tu URL de Replit (ej: `https://euromaster-league-bot.yourusername.repl.co`)
3. El workflow se ejecutará automáticamente cada 5 minutos

### Verificar que funciona:
1. Ve a Actions → Keep Replit Alive
2. Deberías ver ejecuciones cada 5 minutos con ✅

## 🔧 Configuración Inicial del Bot en Replit

### Variables de Entorno en Replit:
1. Click en el icono de 🔒 (Secrets) en la barra lateral
2. Añade las siguientes variables:

```
DISCORD_TOKEN=tu_token_de_discord
GITHUB_TOKEN=tu_token_de_github
GITHUB_REPO=Karmasv/EuroMaster-League
GITHUB_BRANCH=main
WEB_API_URL=https://euromasterleague.vercel.app/api/data
LOG_CHANNEL_ID=tu_canal
REPLIT_URL=https://tu-bot.tu-usuario.repl.co  # Tu URL pública
```

### Obtener URLs:
1. Una vez deployado, busca la URL en:
   - Main preview window → Los 3 puntitos → **"Open in new tab"**
   - Copia esa URL (será algo como `https://bot-name.username.repl.co`)

## ✅ Verificar

Logs esperados:
```
🚀 Conectando bot a Discord...
✅ Bot conectado exitosamente
🌐 Servidor HTTP escuchando...
