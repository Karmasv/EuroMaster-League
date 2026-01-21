# Deploy del Bot en Railway (Free Tier)

## 🚀 Deployment paso a paso

### Paso 1: Crear cuenta en Railway
1. Ve a [Railway.app](https://railway.app) y regístrate con GitHub
2. Verifica tu email (obligatorio)

### Paso 2: Crear el proyecto
1. Click en **"New Project"**
2. Selecciona **"Deploy from GitHub repo"**
3. Busca y selecciona: `Karmasv/EuroMaster-League`

### Paso 3: Configurar variables de entorno
En Railway Dashboard → Settings → Variables, añade estas variables:

#### ⭐ OBLIGATORIAS:

| Variable | Valor |
|----------|-------|
| `DISCORD_TOKEN` | Tu token de Discord Bot (72 caracteres) |
| `GITHUB_TOKEN` | Tu GitHub Token Classic con scope `repo` |
| `GITHUB_REPO` | `Karmasv/EuroMaster-League` |
| `GITHUB_BRANCH` | `main` |

#### ⚙️ OPCIONALES:

| Variable | Valor |
|----------|-------|
| `WEB_API_URL` | `https://euromasterleague.vercel.app/api/data` |
| `LOG_CHANNEL_ID` | ID del canal de logs (legacy) |
| `LOG_WEBHOOK_URL` | Webhook para recibir todos los logs en tu DM/canal |

#### 🔗 Configurar Webhook para Logs en DM:

Para recibir todos los logs directamente en tu Discord:

1. Crea un canal nuevo en tu servidor (puede ser privado)
2. Ve a **Configuración del canal → Integraciones → Webhooks**
3. Crea un webhook nuevo
4. Copia la URL del webhook
5. Añádela como variable `LOG_WEBHOOK_URL` en Railway

**Recibirás logs de:**
- ✅ Inicio del bot
- ✅ Comandos ejecutados
- ✅ Acciones (fichajes, creación de equipos)
- ✅ Resultados de partidos
- ✅ Errores
- ✅ Sincronizaciones de datos

#### 🔧 RAILWAY AUTO-CONFIGURADO:
Las siguientes variables ya están configuradas en `railway.json`:
- `PORT`: 8080 (detectado automáticamente)
- `NODE_ENV`: production

### Paso 4: Deploy
1. Click en **"Deploy"**
2. Espera ~2-3 minutos al build
3. Verifica los logs en "Deployments" tab

---

## ✅ Verificación post-deploy

Railway automáticamente hace health checks en `/health`. Verifica en logs:
```
✅ Servidor HTTP escuchando en puerto 8080
✅ Bot conectado exitosamente
```

---

## 🌐 URLs del bot

- **Health Check**: `https://tu-proyecto.up.railway.app/health`
- **Bot URL**: `https://tu-proyecto.up.railway.app`

---

## 🆘 Solución de problemas

### El bot no conecta a Discord
```
❌ Error en login: Code: DisallowedIntents
```
**Solución**: Ve a Discord Developer Portal → Tu Bot → Bot → Privileged Gateway Intents y habilita:
- ✅ SERVER MEMBERS INTENT
- ✅ MESSAGE CONTENT INTENT

### Error de conexión WebSocket
Railway free soporta WebSockets. Si hay problemas:
1. Revisa los logs en Railway Dashboard
2. Verifica que el token sea correcto

### El health check falla
- Asegúrate que `/health` responde con `200 OK`
- Verifica que el puerto sea 8080

### Cambiar puerto
Railway usa el puerto 8080 por defecto. El bot lo detecta automáticamente con `process.env.PORT`.

---

## 📊 Límites del Free Tier Railway

| Recurso | Límite |
|---------|--------|
| Horas/mes | 500 horas |
| RAM | 512MB - 1GB |
| Disco | 1GB |
| WebSockets | ✅ Soportado |
| Sleep | Se duerme tras 5 min inactivo |

---

## 🔄 Actualizar el bot

1. Haz push a GitHub (rama main)
2. Railway detecta cambios automáticamente
3. Deploy en ~2 minutos

---

## 📁 Archivos de configuración

### railway.json
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd discord-bot && npm install --production"
  },
  "deploy": {
    "startCommand": "node discord-bot/index.js",
    "healthcheckPath": "/health"
  }
}
```

### nixpacks.toml
Para mayor control, se puede usar `nixpacks.toml` en la raíz del proyecto.

---

## 🆚 Comparación con otros servicios

| Característica | Railway Free | Render Free | Cyclic Free |
|----------------|--------------|-------------|-------------|
| WebSockets | ✅ Ilimitado | ⚠️ Limitado | ✅ Soportado |
| Deploy time | ~2 min | ~3-5 min | ~3 min |
| Memoria | 1GB | 512MB | 1GB |
| Sleep | 5 min inactivo | Nunca duerme | 2 semanas inactividad |
| Domains | Personalizado | .onrender.com | .cyclic.sh |

---

## 🔧 Comandos útiles

Verificar que el bot funciona localmente:
```bash
cd discord-bot
npm install
npm start
```

Verificar health check:
```bash
curl http://localhost:10000/health
```

---

## 📝 Notas importantes

1. **Token de Discord**: Debe tener 72 caracteres y los intents habilitados
2. **GitHub Token**: Necesario para escribir en el repo (guardar datos)
3. **Health Checks**: Railway los hace cada 30 segundos
4. **Logs**: Revisa "Deployments" → "Logs" para debug

