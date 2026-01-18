# Configuración del Bot en Render

## 🎯 Objetivo
Ejecutar el Discord bot 24/7 en Render sin necesidad de almacenamiento local, usando GitHub como base de datos única.

## 📋 Requisitos
- Cuenta en [Render.com](https://render.com) (gratis)
- Discord Bot Token
- GitHub Token (para acceso a la API)
- GitHub Repository con el código

## 🔧 Pasos de Configuración

### 1. Crear el servicio en Render

1. Ve a [Render Dashboard](https://dashboard.render.com)
2. Click en **"New +"** → **"Web Service"**
3. Conecta tu repositorio de GitHub
4. Selecciona la rama **`main`**

### 2. Configuración del Web Service

**General:**
- Name: `euromaster-league-bot`
- Region: `Virginia (US)` o la más cercana a ti

**Build & Deploy:**
- Root Directory: `discord-bot`
- Build Command: `npm install --force`
- Start Command: `node index.js`
- Plan: **Free** ✅

### 3. Variables de Entorno

En la sección **"Environment"** del Render Dashboard, añade:

```
DISCORD_TOKEN=tu_token_discord_aqui
GITHUB_TOKEN=tu_token_github_aqui
GITHUB_REPO=Karmasv/EuroMaster-League
GITHUB_BRANCH=main
WEB_API_URL=https://euromasterleague.vercel.app/api/data
NODE_ENV=production
```

**Donde obtener los tokens:**

#### Discord Token
1. Ve a [Discord Developer Portal](https://discord.com/developers/applications)
2. Click en tu aplicación → **"Bot"**
3. Copy el token (regenera si es necesario)
4. Asegúrate que tu bot tiene estos permisos (Scopes):
   - `bot` 
   - `applications.commands`
5. Permisos del Bot:
   - Message Content Intent ✅
   - Server Members Intent ✅
   - Send Messages ✅
   - Embed Links ✅
   - Read Message History ✅

#### GitHub Token
1. Ve a [GitHub Settings → Tokens](https://github.com/settings/tokens)
2. Click en **"Generate new token (classic)"**
3. Dale nombre: `EuroMaster-League-Bot`
4. Permisos necesarios:
   - ✅ `repo` (acceso completo a repositorios)
   - ✅ `workflow` (si usas GitHub Actions)
5. Copy y guarda en lugar seguro

### 4. Verificar el Despliegue

- Render desplegará automáticamente
- Verifica los logs en Render Dashboard
- El bot debería conectarse a Discord en pocos minutos

### 5. Test del Bot

En tu servidor Discord:
```
/ping
```

Debería responder con `Pong!`

## 🗂️ Estructura de Persistencia de Datos

```
Bot (Render)
    ↓ (intenta escribir datos)
    ↓
GitHub API (GITHUB_TOKEN)
    ↓ (fallback si no disponible)
    ↓
Vercel API Web (/api/data)
    ↓ (escribe a través de)
    ↓
GitHub (archivo JSON en data/)
```

**Sin almacenamiento local en Render** ✅

## ⚙️ Funcionamiento

### Lectura de Datos
```
Bot → GitHub (get: teams, players, matches, standings)
```

### Escritura de Datos
```
Bot → GitHub API (directo si GITHUB_TOKEN disponible)
   OR
Bot → API Web → GitHub (fallback sin token)
```

## 📊 Monitoreo

### Verificar que el bot está activo:
```
https://euromaster-league-bot.onrender.com/health
```
Debería retornar: `{"status":"ok"}`

### Logs en Render:
- Ve a tu servicio en Render Dashboard
- Tab **"Logs"** para ver actividad del bot
- Busca: `✅` (éxito) y `❌` (errores)

## 🐛 Troubleshooting

### El bot no se conecta
- Verifica que `DISCORD_TOKEN` es correcto
- Mira los logs en Render para errores
- Asegúrate que el bot tiene permisos en el servidor Discord

### Errores de GitHub API
- Verifica que `GITHUB_TOKEN` es válido
- Mira que el token no ha expirado
- Asegúrate que el repositorio es accesible

### Datos no se guardan
- Verifica logs en Render para errores en API
- Comprueba que `WEB_API_URL` es correcto
- Mira que la API web está funcionando (status 200)

### El bot se reinicia constantemente
- Puede ser que haya error en el código
- Mira los logs en Render
- Verifica variables de entorno

## 🚀 Próximos Pasos

1. Configura variables en Render
2. Verifica los logs
3. Prueba el bot en Discord
4. Monitorea los datos en GitHub

## 📞 Soporte

Si tienes problemas:
1. Mira los logs en Render Dashboard
2. Verifica que todas las variables de entorno están correctas
3. Comprueba los permisos del GitHub Token
4. Verifica los permisos del Discord Bot

---

**Última actualización:** 2024
**Status:** ✅ Funcional sin almacenamiento local
