# Discord Bot Fixes Plan

## Problemas identificados:

### 1. `data-commands.js`
- Path incorrecto: `../githubDB.js` → `../utils/githubDB.js`

### 2. `githubDB.js`
- Tiene código mezclado de `results.js` y `teams.js` al final (error de merge)

### 3. `matches.js`, `players.js`, `results.js`, `teams.js`
- Estos archivos tienen código corrupto/mezclado
- Necesitan ser regenerados o corregidos

## Acciones:
- [ ] Corregir `data-commands.js` path
- [ ] Limpiar `githubDB.js` (eliminar código mezclado)
- [ ] Regenerar `results.js` 
- [ ] Regenerar `teams.js`

