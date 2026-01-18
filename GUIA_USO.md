# 🏆 EuroMaster League - Guía de Uso

## 📋 Flujo de Registro

### Paso 1: El jugador se registra
Cuando un jugador entra al servidor Discord, recibe un mensaje de bienvenida. Debe usar:

```
/registrar_jugador nombre:[Tu nombre] id_haxball:[Tu ID]
```

**Ejemplo:**
```
/registrar_jugador nombre:Cristiano id_haxball:CR7_2000
```

### Paso 2: Un manager lo ficha a su equipo
El manager del equipo puede ficharlo con:

```
/fichar_jugador jugador:[Nombre] equipo:[Tu equipo]
```

**Ejemplo:**
```
/fichar_jugador jugador:Cristiano equipo:Real Madrid Ecuador
```

## 🏅 Comandos Disponibles

### 👤 JUGADORES
- `/registrar_jugador` - Registrarse en la liga
- `/jugadores [equipo]` - Ver jugadores (opcional: de un equipo específico)
- `/clasificacion` - Ver tabla de posiciones

### 🏆 EQUIPOS (Manager/Admin)
- `/crear_equipo nombre:[Nombre] ciudad:[Ciudad]` - Crear nuevo equipo
- `/equipos [equipo]` - Ver información de equipos
- `/fichar_jugador jugador:[Nombre] equipo:[Tu equipo]` - Fichar jugador
- `/desfichar_jugador jugador:[Nombre]` - Desfichar jugador

### ⚽ PARTIDOS (Admin)
- `/resultado equipo1:[Equipo] goles1:[Goles] equipo2:[Equipo] goles2:[Goles]` - Registrar resultado
- `/transferencia jugador:[Nombre] equipo_origen:[Equipo] equipo_destino:[Equipo]` - Registrar traspaso
- `/clasificacion` - Ver clasificación

### ❓ OTRO
- `/ping` - Ver latencia del bot
- `/ayuda` - Ver todos los comandos

## 🔄 Sincronización en Vivo

La web se sincroniza automáticamente con el bot cada 30 segundos. Cuando:
- Se registra un jugador ✅
- Se ficha un jugador 🎯
- Se registra un resultado ⚽
- Se transfiere un jugador 🔄

**Todo aparece en tiempo real en la web** en la sección "Traspasos en Vivo"

## 📊 Datos que se Sincronizan

### Tablas JSON
- `teams.json` - Equipos registrados
- `players.json` - Jugadores y sus estadísticas
- `matches.json` - Partidos
- `standings.json` - Clasificación
- `transfers.json` - Historial de traspasos

### API Endpoints
- `GET /api/teams` - Todos los equipos
- `GET /api/players` - Todos los jugadores
- `GET /api/standings` - Clasificación
- `GET /api/matches` - Partidos
- `GET /api/transfers` - Traspasos recientes
- `GET /api/top-scorers` - Goleadores
- `GET /api/top-assists` - Asistentes

## 🛠️ Configuración

### Bot Discord
El bot carga automáticamente:
1. Todos los comandos de `/discord-bot/commands/*.js`
2. Todos los eventos de `/discord-bot/events/*.js`
3. Los datos de `/data/*.json`

### Permisos
- **Admin**: Usuario en `.env` ADMIN_IDS o con rol Administrator
- **Manager**: Usuarios con rol "manager" en el servidor
- **Jugador**: Cualquier usuario registrado

### Traspasos en Vivo
Cuando se ficha a un jugador:
1. Se actualiza en `players.json`
2. Se crea entrada en `transfers.json`
3. Se notifica al servidor Discord
4. Aparece en la web automáticamente

## 📱 Web

La web muestra en tiempo real:
- ✅ Clasificación
- ✅ Resultados recientes
- ✅ Próximos partidos
- ✅ Top jugadores (Goleadores)
- ✅ Equipos
- ✅ **Traspasos en Vivo** ⭐

## 🚀 Próximas Mejoras

- [ ] Sistema de roles por equipo
- [ ] Estadísticas avanzadas
- [ ] Sistema de ranking global
- [ ] Replay de partidos
- [ ] Sistema de apuestas (si lo deseas)
- [ ] Notificaciones en tiempo real

---

**¡Que disfrutes tu experiencia en EuroMaster League!** 🏆⚽
