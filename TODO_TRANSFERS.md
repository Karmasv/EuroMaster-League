# PLAN DE IMPLEMENTACIÓN - Sistema de Transferencias EML + Logs Completos

## 📋 RESUMEN DE REQUISITOS

### Imágenes de Referencia
- **TransferEmbed.png**: Muestra transferencias con estado (✅ Aceptado, ⏳ Pendiente, ❌ Rechazado, ⏰ Expirado)
- **TeamsList.png**: Lista de equipos con nombres completos y abreviaturas

### Funcionalidades Requeridas

1. **Comando `/fichar` Mejorado**
   - Envía oferta al jugador
   - Estados: Pendiente (24h), Aceptado, Rechazado, Expirado
   - Botones para aceptar/rechazar
   - Crea rol si no existe
   - Asigna abreviatura al nickname

2. **Comando `/desfichar`**
   - Desvincula jugador del equipo
   - Actualiza nickname (quita abreviatura)
   - Registra en historial

3. **Comando `/crear_equipo` Mejorado**
   - Nombre completo del equipo
   - Rol del equipo (crea automáticamente)
   - Canal del equipo
   - Link del escudo
   - Abreviatura (tag para nicknames)

4. **Sistema de Expiración**
   - 24 horas para responder ofertas
   - Verificación automática de transfers expirados
   - Actualización de estados

5. **Integración con Web**
   - Los transfers aceptados se ven en la página
   - Base de datos actualizada automáticamente

6. **Sistema de Logs Completo (Tipo Koya)**
   - Logs de comandos ejecutados
   - Logs de mensajes eliminados
   - Logs de mensajes editados
   - Logs de miembros (unidos, salió, expulsados)
   - Logs de roles (añadidos, removidos)
   - Logs de canales (creados, eliminados, actualizados)
   - Logs de voz (conexiones, desconexiones)
   - Formato embebido profesional con colores y emojis
   - Sistema de categorías organizadas

---

## 📁 ARCHIVOS A MODIFICAR/CREAR

### 1. **Actualizar** `discord-bot/commands/crear_equipo.js`
- Nuevos parámetros: rol, canal, escudo, abreviatura
- Crear rol automáticamente
- Crear canal del equipo
- Guardar abreviatura en teams.json

### 2. **Crear** `discord-bot/commands/fichar.js` (NUEVO)
- Sistema de ofertas con botones
- Estados: pending, accepted, rejected, expired
- Timer de 24 horas
- Integración con rol y nickname

### 3. **Crear** `discord-bot/commands/desfichar.js` (NUEVO)
- Desvincular jugador
- Actualizar nickname
- Registrar en transfers

### 4. **Crear** `discord-bot/utils/transfers.js` (NUEVO)
- Gestión de transfers pendientes
- Verificación de expiración
- Actualización de estados

### 5. **Actualizar** `discord-bot/utils/embeds.js`
- Métodos para embeds de transfers
- Embeds de ofertas
- Métodos para embeds de logs

### 6. **Actualizar** `discord-bot/utils/database.js`
- Métodos para transfers con estados
- Actualización de nicknames

### 7. **Actualizar** `data/teams.json`
- Añadir campos: `roleId`, `channelId`, `logoUrl`, `abbreviation`

### 8. **Crear** `data/transfers.json`
- Estructura: id, playerName, fromTeam, toTeam, status, date, expiresAt, manager

### 9. **Crear** `discord-bot/events/messageDelete.js` (NUEVO)
- Log de mensajes eliminados

### 10. **Crear** `discord-bot/events/messageUpdate.js` (NUEVO)
- Log de mensajes editados

### 11. **Crear** `discord-bot/events/guildMemberUpdate.js` (NUEVO)
- Log de cambios de roles y apodos

### 12. **Crear** `discord-bot/events/voiceStateUpdate.js` (NUEVO)
- Log de conexiones/desconexiones de voz

### 13. **Crear** `discord-bot/events/guildUpdate.js` (NUEVO)
- Log de cambios del servidor

### 14. **Actualizar** `discord-bot/events/ready.js`
- Logs de inicio del bot

### 15. **Actualizar** `discord-bot/utils/logger.js`
- Mejorar sistema de logs
- Añadir métodos para cada tipo de log

---

## 🔧 DETALLES TÉCNICOS

### Estructura de Transfer
```json
{
  "id": 1,
  "playerName": "Messi",
  "playerId": "123456789",
  "fromTeam": "Barcelona",
  "toTeam": "PSG",
  "status": "pending",
  "date": "2025-08-23T13:00:00Z",
  "expiresAt": "2025-08-24T13:00:00Z",
  "manager": "Admin#1234",
  "managerId": "123456789"
}
```

### Estructura de Team Actualizada
```json
{
  "id": 1,
  "name": "Real Madrid",
  "abbreviation": "RMA",
  "roleId": "123456789",
  "channelId": "123456789",
  "logoUrl": "https://...",
  "managerId": "...",
  "points": 0
}
```

### Comandos Slash

#### `/crear_equipo`
- `nombre` (string, required) - Nombre completo
- `abreviatura` (string, required) - 3 letras (RMA, BAR, MIL)
- `escudo` (string, required) - URL del escudo
- `color` (string, optional) - Color hex del rol

#### `/fichar`
- `jugador` (string, required) - Mención o nombre
- `equipo` (string, required) - Nombre del equipo

#### `/desfichar`
- `jugador` (string, required) - Mención o nombre
- `razon` (string, optional) - Motivo del desfichaje

---

## 🚀 PASOS DE IMPLEMENTACIÓN

1. Actualizar `data/teams.json` con estructura nueva
2. Crear `discord-bot/utils/transfers.js`
3. Actualizar `discord-bot/utils/embeds.js`
4. Actualizar `discord-bot/utils/database.js`
5. Crear/actualizar comando `/crear_equipo`
6. Crear comando `/fichar` con sistema de botones
7. Crear comando `/desfichar`
8. Crear eventos de logs
9. Actualizar `discord-bot/index.js` para manejar botones
10. Probar sistema de transfers y logs
11. Despliegue en producción

---

## ⏰ SISTEMA DE EXPIRACIÓN

```javascript
// Verificar cada hora transfers expirados
cron.schedule('0 * * * *', () => {
    checkExpiredTransfers();
});
```

---

## 📝 ESTRUCTURA DE LOGS TIPO KOYA

### Categorías de Logs:
1. **🔧 Comandos** - `/fichar`, `/desfichar`, `/crear_equipo`, etc.
2. **💬 Mensajes** - Eliminados, editados
3. **👥 Miembros** - Unidos, salió, expulsados
4. **🎭 Roles** - Añadidos, removidos
5. **📁 Canales** - Creados, eliminados, actualizados
6. **🔊 Voz** - Conectado, desconectado, silenciado
7. **⚙️ Servidor** - Cambios de configuración

---

## ✅ ESTADO DEL PLAN

- [x] Plan creado
- [ ] Aprobado por el usuario
- [ ] Implementación de archivos
- [ ] Pruebas del sistema
- [ ] Despliegue en producción

