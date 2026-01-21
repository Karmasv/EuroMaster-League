# TODO - Corrección del Bot Discord

## ✅ Correcciones Completadas

### 1. data-commands.js - Corregido
- **Problema**: Usaba `db.get('teams')` que no existe en GitHubDB
- **Solución**: Cambiado a usar `db.getTeams()` con estructura moderna de SlashCommandBuilder

### 2. interactionCreate.js - Verificado
- **Estado**: Ya estaba correcto, sin código duplicado

### 3. owners.json - Actualizado
- **Problema**: Estaba vacío
- **Solución**: Añadida estructura base (sin owners por defecto)

### 4. Comandos duplicados eliminados
- ❌ `clasificacion-new.js` (duplicado de clasificacion.js)
- ❌ `resultado-new.js` (duplicado de resultado.js)
- ❌ `jugadores-new.js` (duplicado de jugadores.js)
- ❌ `crear-equipo.js` (duplicado de crear_equipo.js)
- ❌ `teams.js` (duplicado de equipos.js)
- ❌ `players.js` (duplicado de jugadores.js)

## 📋 Comandos Activos (sin duplicados)

| Comando | Descripción | Archivo |
|---------|-------------|---------|
| `/ayuda` | Muestra comandos disponibles | ayuda.js |
| `/clasificacion` | Ver tabla de posiciones | clasificacion.js |
| `/crear_equipo` | Crear nuevo equipo | crear_equipo.js |
| `/data-commands` | (Eliminado, funcionalidad en teams.js) | data-commands.js |
| `/desfichar_jugador` | Desfichar jugador | desfichar_jugador.js |
| `/equipos` | Ver equipos | equipos.js |
| `/fichar_jugador` | Fichar jugador | fichar_jugador.js |
| `/jugadores` | Ver jugadores | jugadores.js |
| `/registrar-jugador` | Registrarse en la liga | registrar-jugador.js |
| `/resultado` | Registrar resultado | resultado.js |
| `/result` | Registrar resultado (alternativo) | results.js |
| `/teams` | Equipos (nuevo) | data-commands.js |
| `/transferencia` | Registrar transferencia | transferencias.js |
| `/ping` | Ver latencia | ping.js |
| `/owner` | Gestión de owners | owner.js |

## 🔧 Problemas Potenciales Restantes

1. ** owners.json vacío**: No hay owners configurados. Para añadir owners, usar el comando `/añadir_owner` o editar manualmente el archivo.

2. **Permisos**: Los comandos como `/fichar_jugador`, `/crear_equipo`, etc. requieren permisos de admin/manager que pueden no estar configurados.

## 📝 Notas
- El bot carga comandos desde la carpeta `commands/`
- Cada comando debe tener `data` (SlashCommandBuilder) y `execute`
- GitHubDB usa `getTeams()`, `getPlayers()`, `getMatches()` (no `get('tabla')`)
- Database local usa `loadTeams()`, `loadPlayers()`, etc.

