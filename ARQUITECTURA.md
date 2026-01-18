# 🏗️ Arquitectura de Persistencia de Datos - EuroMaster League

## 📐 Flujo General

```
┌─────────────────────────────────────────────────────────────────┐
│                    DISCORD BOT (Render)                         │
│  • Procesa comandos                                              │
│  • Gestiona eventos del servidor                                 │
│  • Usa GitHubDB para leer/escribir datos                         │
└─────────────┬───────────────────────────────────────────────────┘
              │
              │ (lee/escribe datos)
              │
        ┌─────┴──────┐
        │             │
        ↓             ↓
   ┌─────────┐    ┌──────────────┐
   │ GitHub  │    │ Vercel API   │
   │ (primario)   │ (fallback)   │
   └─────────┘    └──────────────┘
        │                │
        │                │
        └────────┬───────┘
                 │ (write)
                 ↓
        ┌──────────────────┐
        │ GitHub Repo      │
        │ /data/*.json     │
        │ (Base de datos)  │
        └──────────────────┘
```

## 🔄 Ciclo de Lectura de Datos

```
Bot necesita datos (ej: get('teams'))
        ↓
¿GitHub API disponible?
   ├─ SI → Octokit → GitHub → JSON
   └─ NO → Lee local en memor

a

NO LOCAL STORAGE ✅
```

## 📝 Ciclo de Escritura de Datos

```
Bot necesita guardar datos (ej: set('teams', data))
        ↓
¿Octokit disponible? (GITHUB_TOKEN)
   ├─ SI → GitHub API Directo → ✅ OK
   │
   └─ NO → axios POST a API Web
        ↓
        https://euromasterleague.vercel.app/api/data
        ↓
        API recibe { file, data }
        ↓
        API usa GitHub Token propio
        ↓
        GitHub → Update /data/*.json
        ↓
        ✅ OK (sin almacenamiento local)
```

## 💾 Especificación de Colecciones

```javascript
{
  teams:     'data/teams.json',      // Equipos registrados
  players:   'data/players.json',    // Jugadores registrados
  matches:   'data/matches.json',    // Partidos jugados
  standings: 'data/standings.json',  // Clasificación
  schedule:  'data/schedule.json',   // Próximos partidos
  stats:     'data/stats.json'       // Estadísticas
}
```

## 🔐 Configuración de Tokens

### En Render (discord-bot environment):
```
DISCORD_TOKEN=xxxxx      # Token del Discord Bot
GITHUB_TOKEN=xxxxx       # Token de GitHub (opcional, para rendimiento)
GITHUB_REPO=Karmasv/EuroMaster-League
GITHUB_BRANCH=main
WEB_API_URL=https://euromasterleague.vercel.app/api/data
```

### En Vercel (automático):
- API `/data.js` ya tiene acceso a `process.env.GITHUB_TOKEN`
- Vercel usa el mismo GitHub Token para escribir

## ✅ Ventajas de Esta Arquitectura

| Característica | Resultado |
|---|---|
| **No hay almacenamiento local** | ✅ Compatible con Render free |
| **Base de datos única** | ✅ Un solo source of truth (GitHub) |
| **Redundancia** | ✅ Acceso directo a GitHub + fallback API web |
| **Escalable** | ✅ Múltiples bots pueden usar el mismo repo |
| **Seguro** | ✅ Tokens protegidos, datos en GitHub privado |
| **Gratuito** | ✅ Render free + Vercel free + GitHub free |
| **24/7** | ✅ Express server previene sleep en Render |

## 🛡️ Seguridad

```
Render (Bot)              Vercel (Web)
    ↓                         ↓
    └─ GITHUB_TOKEN ─→ GitHub (privado)
```

**Protecciones:**
- Tokens guardados en variables de entorno (no en código)
- GitHub repo privado
- Acceso solo a rutas necesarias (`/data/*.json`)

## 📊 Flujos de Datos Específicos

### Listar Equipos
```
Discord: /equipos
  ↓
Bot: get('teams')
  ↓
GitHub: fetch data/teams.json
  ↓
Bot: formatea datos
  ↓
Discord: muestra tabla
```

### Fichar Jugador
```
Discord: /fichar @usuario Equipo
  ↓
Bot: valida permisos
  ↓
Bot: get('players') + add() + set('players', data)
  ↓
GitHub API: POST update data/players.json
  ↓
Discord: confirmación
```

### Actualizar Resultado
```
Discord: /resultado Equipo1 5 Equipo2 3
  ↓
Bot: valida equipos
  ↓
Bot: get('matches') + update() + set('matches', data)
  ↓
API Web: recibe POST → GitHub API → update data/matches.json
  ↓
Web: muestra resultado actualizado
```

## 🚀 Performance

| Operación | Tiempo | Notas |
|---|---|---|
| Leer desde GitHub | ~200ms | Directo vía Octokit |
| Leer fallback | ~500ms | Vía API web |
| Escribir a GitHub | ~300ms | Directo vía Octokit |
| Escribir fallback | ~1s | POST a API web + GitHub |

## 🔧 Mantenimiento

**Verificar que está funcionando:**
```bash
# Health check
curl https://euromaster-league-bot.onrender.com/health

# Ver logs
# Render Dashboard → Logs
```

**Regenerar tokens:**
1. GitHub: Settings → Tokens → Generate new
2. Discord: Developer Portal → Bot → Reset Token
3. Actualizar en Render environment

**Migrar a otra plataforma:**
- Cambiar WEB_API_URL
- Bot seguiría funcionando igual
- Solo necesita acceso a la API web

## 📈 Escalabilidad Futura

```
Expandir a múltiples bots:

Bot-1 → \
Bot-2 → → API Web → GitHub (una sola base de datos)
Bot-3 → /

Con control de concurrencia vía GitHub API
```

---

**Estado:** ✅ Producción Ready
**Última actualización:** 2024
**Mantener:** Renovar tokens cada 90 días
