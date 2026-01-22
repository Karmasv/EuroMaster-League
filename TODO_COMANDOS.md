# TODO - Nuevos Comandos para Bot de Haxball

## 📋 ANÁLISIS DE SINCRONIZACIÓN WEB

### ✅ Comandos que ESCRIBEN en DB (suben a web):
| Comando | Archivo DB | Sincroniza Web | Estado |
|---------|------------|----------------|--------|
| `/crear_equipo` | `teams.json` | ✅ SÍ | ✅ Existe |
| `/fichar` | `transfers.json` | ✅ SÍ | ✅ Existe |
| `/desfichar` | `transfers.json` | ✅ SÍ | ✅ Existe |
| `/resultado` | `matches.json`, `standings.json` | ✅ SÍ | ✅ Existe |
| `/registrar-jugador` | `players.json` | ✅ SÍ | ✅ Existe |
| `/match create` | `matches.json` | ✅ SÍ | ✅ Existe |

### ❌ Comandos que SOLO LEEN (NO suben a web):
| Comando | Función | Prioridad | Estado |
|---------|---------|-----------|--------|
| `/stats` | Ver estadísticas de jugador | ALTA | ✅ Completado |
| `/top` | Top 10 goleadores/asistentes | ALTA | ✅ Completado |
| `/roster` | Ver plantilla de equipo | MEDIA | ✅ Completado |
| `/historial` | Historial de partidos | MEDIA | ✅ Completado |
| `/calendario` | Ver calendario completo | ALTA | ✅ Completado |
| `/jornada` | Partidos por jornada | ALTA | ✅ Completado |
| `/ofertas` | Ver ofertas pendientes | MEDIA | ✅ Completado |
| `/reglas` | Reglas de la liga | BAJA | ✅ Completado |
| `/perfil` | Perfil de jugador | MEDIA | ✅ Completado |

---

## 🎯 FASE 1: Comandos de ESTADÍSTICAS (Solo Lectura) ✅ COMPLETADO

- [x] 1.1 Crear `stats.js` - Ver estadísticas de jugador
- [x] 1.2 Crear `top.js` - Top 10 goleadores/asistentes
- [x] 1.3 Crear `perfil.js` - Perfil completo de jugador

## 🎯 FASE 2: Comandos de EQUIPOS (Lectura) ✅ COMPLETADO

- [x] 2.1 Crear `roster.js` - Ver plantilla de equipo

## 🎯 FASE 3: Comandos de PARTIDOS (Lectura) ✅ COMPLETADO

- [x] 3.1 Crear `historial.js` - Historial de partidos
- [x] 3.2 Crear `calendario.js` - Calendario completo
- [x] 3.3 Crear `jornada.js` - Partidos por jornada

## 🎯 FASE 4: Comandos ADICIONALES ✅ COMPLETADO

- [x] 4.1 Crear `ofertas.js` - Ver ofertas de transferencia
- [x] 4.2 Crear `reglas.js` - Reglas de la liga
- [x] 4.3 Actualizar `ayuda.js` con nuevos comandos

## 🎯 FASE 5: Verificación PENDIENTE

- [ ] 5.1 Verificar todos los comandos funcionan
- [ ] 5.2 Verificar sincronización con API web
- [ ] 5.3 Desplegar cambios

---

## 📁 Archivos Creados:

```
discord-bot/commands/
├── stats.js              # Estadísticas de jugador
├── top.js                # Top 10 goleadores/asistentes
├── perfil.js             # Perfil de jugador
├── roster.js             # Plantilla de equipo
├── historial.js          # Historial de partidos
├── calendario.js         # Calendario completo
├── jornada.js            # Partidos por jornada
├── ofertas.js            # Ofertas pendientes
├── reglas.js             # Reglas de la liga
└── ayuda.js              # Actualizado con todos los comandos
```

## 📝 Resumen de Nuevos Comandos:

### 📊 Comandos de Solo Lectura (NO sincronizan con web):
1. `/stats [jugador]` - Ver estadísticas detalladas
2. `/top [tipo]` - Top 10 goleadores/asistentes
3. `/perfil [jugador]` - Perfil completo de jugador
4. `/roster [equipo]` - Ver plantilla de equipo
5. `/calendario` - Ver partidos programados
6. `/jornada [numero]` - Partidos por jornada
7. `/historial [equipo]` - Historial de partidos
8. `/ofertas [estado]` - Ver ofertas pendientes
9. `/reglas` - Reglas de la liga

### 📝 Comandos de Escritura (SÍ sincronizan con web):
1. `/crear-equipo` - ✅ Ya existente
2. `/fichar` - ✅ Ya existente
3. `/desfichar` - ✅ Ya existente
4. `/resultado` - ✅ Ya existente
5. `/registrar-jugador` - ✅ Ya existente
6. `/match create` - ✅ Ya existente

