# TODO - Implementación Sistema de Transferencias y Logs EML

## Fase 1: Estructura de Datos
- [x] 1.1 Actualizar data/teams.json con nueva estructura
- [x] 1.2 Crear data/transfers.json
- [x] 1.3 Actualizar discord-bot/utils/database.js

## Fase 2: Sistema de Transferencias
- [x] 2.1 Crear discord-bot/utils/transfers.js
- [x] 2.2 Actualizar discord-bot/utils/embeds.js
- [x] 2.3 Actualizar discord-bot/commands/crear_equipo.js
- [x] 2.4 Crear discord-bot/commands/fichar.js
- [x] 2.5 Crear discord-bot/commands/desfichar.js

## Fase 3: Sistema de Logs (Tipo Koya)
- [x] 3.1 Actualizar discord-bot/utils/logger.js (añadidos métodos en embeds.js)
- [x] 3.2 Crear discord-bot/events/messageDelete.js
- [x] 3.3 Crear discord-bot/events/messageUpdate.js
- [x] 3.4 Crear discord-bot/events/guildMemberUpdate.js
- [x] 3.5 Crear discord-bot/events/voiceStateUpdate.js
- [x] 3.6 Crear discord-bot/events/guildUpdate.js
- [x] 3.7 Crear discord-bot/events/guildMemberAdd.js
- [x] 3.8 Crear discord-bot/events/guildMemberRemove.js

## Fase 4: Integración y Configuración
- [x] 4.1 Actualizar discord-bot/index.js
- [x] 4.2 Actualizar discord-bot/events/ready.js (ya tiene logging)

## Fase 5: Pruebas y Deploy
- [x] 5.1 Verificar sintaxis de todos los archivos
- [ ] 5.2 Desplegar en producción

---

## ✅ IMPLEMENTACIÓN COMPLETA

### Archivos Creados/Modificados:

**Sistema de Transferencias:**
- ✅ `discord-bot/commands/crear_equipo.js` - Nuevo con abreviatura, rol, canal, escudo
- ✅ `discord-bot/commands/fichar.js` - Sistema de ofertas con estados
- ✅ `discord-bot/commands/desfichar.js` - Desvinculación de jugadores
- ✅ `discord-bot/utils/transfers.js` - Gestor de transferencias
- ✅ `discord-bot/utils/database.js` - Métodos actualizados
- ✅ `data/teams.json` - Nueva estructura con abbreviation, roleId, channelId, logoUrl
- ✅ `data/transfers.json` - Archivo de transfers vacío (listo para usar)

**Sistema de Logs (Tipo Koya):**
- ✅ `discord-bot/utils/embeds.js` - Métodos para embeds de logs
- ✅ `discord-bot/events/messageDelete.js` - Log de mensajes eliminados
- ✅ `discord-bot/events/messageUpdate.js` - Log de mensajes editados
- ✅ `discord-bot/events/guildMemberUpdate.js` - Log de cambios de roles/apodos
- ✅ `discord-bot/events/voiceStateUpdate.js` - Log de voz
- ✅ `discord-bot/events/guildUpdate.js` - Log de cambios del servidor
- ✅ `discord-bot/events/guildMemberAdd.js` - Log de miembros nuevos
- ✅ `discord-bot/events/guildMemberRemove.js` - Log de miembros que salen

**Integración:**
- ✅ `discord-bot/index.js` - Manejo de botones de transferencias

