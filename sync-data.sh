#!/bin/bash

echo "🔄 Sincronizando datos entre Bot y Web..."

# 1. Traer datos actuales de GitHub
echo "Descargando datos de GitHub..."
curl -s -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/Karmasv/EuroMaster-League/contents/data/teams.json \
  | jq -r '.content' | base64 --decode > data/teams.json 2>/dev/null

# 2. Mostrar resumen
echo "📊 Estado actual:"
for file in data/*.json; do
  if [ -f "$file" ]; then
    count=$(jq '. | length' "$file" 2>/dev/null || echo "0")
    echo "  $(basename $file): $count registros"
  fi
done

# 3. Instrucciones para el bot
echo ""
echo "🤖 Para ejecutar el bot:"
echo "   cd discord-bot"
echo "   npm start"
echo ""
echo "🌐 La web está en: https://euro-master-league.vercel.app"
echo ""
echo "🔗 Ambos usan la misma base de datos en GitHub"
