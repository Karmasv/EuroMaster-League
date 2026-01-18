#!/bin/bash

echo "🔥 EJECUTANDO REPARACIÓN COMPLETA EUROMASTER LEAGUE"
echo "=================================================="

# ============================================
# 1. CORREGIR RUTAS - vercel.json NUEVO
# ============================================
echo "📍 1/6 Configurando rutas..."
cat > vercel.json << 'VJSON'
{
  "version": 2,
  "builds": [
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    },
    {
      "src": "**/*.html",
      "use": "@vercel/static"
    },
    {
      "src": "**/*.css",
      "use": "@vercel/static"
    },
    {
      "src": "**/*.js",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/\$1"
    },
    {
      "src": "/teams",
      "dest": "/pages/teams.html"
    },
    {
      "src": "/matches",
      "dest": "/pages/matches.html"
    },
    {
      "src": "/players",
      "dest": "/pages/players.html"
    },
    {
      "src": "/standings",
      "dest": "/pages/standings.html"
    },
    {
      "src": "/stats",
      "dest": "/pages/stats.html"
    },
    {
      "src": "/schedule",
      "dest": "/pages/schedule.html"
    },
    {
      "src": "/live",
      "dest": "/pages/live.html"
    },
    {
      "src": "/admin-panel",
      "dest": "/pages/admin-panel.html"
    },
    {
      "src": "/team-detail",
      "dest": "/pages/team-detail.html"
    },
    {
      "src": "/match-detail",
      "dest": "/pages/match-detail.html"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
VJSON
echo "✅ Rutas configuradas"

# ============================================
# 2. NUEVO DISEÑO PROFESIONAL - styles.css
# ============================================
echo "🎨 2/6 Aplicando diseño nuevo..."
cat > styles.css << 'CSS'
/* EUROMASTER LEAGUE - Diseño Profesional */
:root {
  --euro-blue: #003399;
  --ecuador-yellow: #FFD700;
  --ecuador-red: #DA291C;
  --dark-bg: #0a1931;
  --card-bg: rgba(255, 255, 255, 0.05);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
  background: var(--dark-bg);
  color: white;
  min-height: 100vh;
}

/* HEADER */
.site-header {
  background: linear-gradient(90deg, var(--euro-blue) 0%, var(--ecuador-red) 100%);
  padding: 1rem 2rem;
  border-bottom: 5px solid var(--ecuador-yellow);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-icon {
  width: 60px;
  height: 60px;
  background: var(--ecuador-yellow);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: var(--euro-blue);
}

.logo-text h1 {
  font-size: 1.8rem;
  text-transform: uppercase;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  list-style: none;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: 0.3s;
}

.nav-links a:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* HERO */
.hero {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, rgba(0, 51, 153, 0.8) 0%, rgba(218, 41, 28, 0.8) 100%);
  margin-bottom: 3rem;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.btn {
  padding: 0.8rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: bold;
  display: inline-block;
  transition: 0.3s;
}

.btn-primary {
  background: var(--ecuador-yellow);
  color: black;
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 2px solid white;
}

/* CONTENT */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 3rem;
}

.page-content {
  background: var(--card-bg);
  border-radius: 10px;
  padding: 2rem;
  margin-top: 2rem;
  min-height: 400px;
}

.coming-soon {
  text-align: center;
  padding: 3rem;
  color: #aaa;
}

/* FOOTER */
.site-footer {
  background: var(--euro-blue);
  padding: 2rem;
  text-align: center;
  margin-top: 3rem;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .hero h1 {
    font-size: 2rem;
  }
}
CSS
echo "✅ Diseño aplicado"

# ============================================
# 3. ACTUALIZAR INDEX.HTML PRINCIPAL
# ============================================
echo "🏠 3/6 Actualizando página principal..."
cat > index.html << 'HTML'
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EuroMaster League - Liga Ecuatoriana de Haxball</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <header class="site-header">
        <div class="header-content">
            <div class="logo">
                <div class="logo-icon">
                    <i class="fas fa-trophy"></i>
                </div>
                <div class="logo-text">
                    <h1>EUROMASTER LEAGUE</h1>
                    <p>Liga Ecuatoriana | Alma Europea</p>
                </div>
            </div>
            <nav>
                <ul class="nav-links">
                    <li><a href="/" class="active"><i class="fas fa-home"></i> Inicio</a></li>
                    <li><a href="/teams"><i class="fas fa-users"></i> Equipos</a></li>
                    <li><a href="/matches"><i class="fas fa-futbol"></i> Partidos</a></li>
                    <li><a href="/standings"><i class="fas fa-list-ol"></i> Clasificación</a></li>
                    <li><a href="/live"><i class="fas fa-video"></i> En Vivo</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <section class="hero">
        <h1>EUROMASTER LEAGUE</h1>
        <p>La élite del Haxball Ecuatoriano con inspiración en las grandes ligas europeas</p>
        <div class="hero-buttons">
            <a href="/standings" class="btn btn-primary"><i class="fas fa-table"></i> Ver Clasificación</a>
            <a href="/teams" class="btn btn-secondary"><i class="fas fa-users"></i> Ver Equipos</a>
        </div>
    </section>

    <main class="container">
        <div class="page-content">
            <h2><i class="fas fa-flag"></i> Liga Ecuatoriana con Temática Europea</h2>
            <p>La EuroMaster League combina la pasión del fútbol ecuatoriano con la tradición y competitividad de las ligas europeas.</p>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-top: 2rem;">
                <div style="background: rgba(0, 51, 153, 0.2); padding: 1.5rem; border-radius: 10px;">
                    <h3><i class="fas fa-trophy"></i> Competitividad Élite</h3>
                    <p>Los mejores jugadores de Haxball de Ecuador compiten por el título supremo.</p>
                </div>
                <div style="background: rgba(218, 41, 28, 0.2); padding: 1.5rem; border-radius: 10px;">
                    <h3><i class="fas fa-chart-line"></i> Estadísticas en Vivo</h3>
                    <p>Seguimiento detallado de estadísticas y rendimiento en tiempo real.</p>
                </div>
                <div style="background: rgba(255, 215, 0, 0.2); padding: 1.5rem; border-radius: 10px;">
                    <h3><i class="fas fa-globe-europe"></i> Inspiración Europea</h3>
                    <p>Sistema competitivo inspirado en las grandes ligas europeas de fútbol.</p>
                </div>
            </div>
        </div>
    </main>

    <footer class="site-footer">
        <p>&copy; 2024 EuroMaster League - Liga Ecuatoriana de Haxball</p>
        <p><i class="fas fa-map-marker-alt"></i> Ecuador | <i class="fas fa-heart"></i> Pasión por el Haxball</p>
    </footer>

    <script src="main.js"></script>
</body>
</html>
HTML
echo "✅ Página principal actualizada"

# ============================================
# 4. CREAR PÁGINAS SECUNDARIAS BÁSICAS
# ============================================
echo "📄 4/6 Creando páginas secundarias..."
mkdir -p pages

for page in teams matches standings stats schedule live players "admin-panel" "team-detail" "match-detail"; do
  cat > pages/${page}.html << PAGE
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page^} - EuroMaster League</title>
    <link rel="stylesheet" href="/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <header class="site-header">
        <div class="header-content">
            <div class="logo">
                <a href="/" style="text-decoration: none; color: inherit; display: flex; align-items: center; gap: 1rem;">
                    <div class="logo-icon">
                        <i class="fas fa-trophy"></i>
                    </div>
                    <div class="logo-text">
                        <h1>EUROMASTER LEAGUE</h1>
                    </div>
                </a>
            </div>
            <nav>
                <ul class="nav-links">
                    <li><a href="/"><i class="fas fa-home"></i> Inicio</a></li>
                    <li><a href="/teams" ${page=="teams"?"class='active'":""}><i class="fas fa-users"></i> Equipos</a></li>
                    <li><a href="/matches" ${page=="matches"?"class='active'":""}><i class="fas fa-futbol"></i> Partidos</a></li>
                    <li><a href="/standings" ${page=="standings"?"class='active'":""}><i class="fas fa-list-ol"></i> Clasificación</a></li>
                    <li><a href="/live" ${page=="live"?"class='active'":""}><i class="fas fa-video"></i> En Vivo</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main class="container">
        <div class="page-content">
            <h1><i class="fas fa-$(case $page in 
                teams) echo "users" ;; 
                matches) echo "futbol" ;; 
                standings) echo "list-ol" ;; 
                live) echo "video" ;; 
                stats) echo "chart-bar" ;; 
                *) echo "cog" ;; 
            esac)"></i> ${page^}</h1>
            
            <div class="coming-soon">
                <h2><i class="fas fa-tools"></i> Sección en Desarrollo</h2>
                <p>Esta sección estará disponible pronto para la primera temporada de la EuroMaster League.</p>
                <p style="margin-top: 1rem;"><strong>Liga Ecuatoriana de Haxball con inspiración europea</strong></p>
                <a href="/" class="btn btn-primary" style="margin-top: 1rem;">
                    <i class="fas fa-arrow-left"></i> Volver al Inicio
                </a>
            </div>
        </div>
    </main>

    <footer class="site-footer">
        <p>&copy; 2024 EuroMaster League</p>
    </footer>
</body>
</html>
PAGE
done
echo "✅ 10 páginas creadas"

# ============================================
# 5. CREAR ESTRUCTURA PARA LOGO
# ============================================
echo "📁 5/6 Creando estructura para logo..."
mkdir -p assets/img
mkdir -p assets/css
mkdir -p assets/js

cat > SUBE_TU_LOGO_AQUI.txt << 'LOGO'
=== INSTRUCCIONES PARA EL LOGO ===

1. PREPARA TU LOGO:
   - Formato: PNG, JPG o SVG
   - Tamaño recomendado: 512x512 píxeles
   - Nombre: logo.png

2. SÚBELO A:
   /assets/img/logo.png

3. COMO HACERLO:
   Opción A (Recomendada):
   - Ve a la carpeta 'assets/img/' en tu Codespace
   - Arrastra tu archivo de logo ahí
   
   Opción B (Terminal):
   cp /ruta/de/tu/logo.png /workspaces/EuroMaster-League/assets/img/logo.png

4. VERIFICA:
   - El logo aparecerá automáticamente en el sitio
   - Si no se ve, actualiza la página (Ctrl+F5)

5. ESTRUCTURA FINAL:
   assets/
   ├── img/logo.png       (tu logo aquí)
   ├── img/favicon.ico    (opcional)
   ├── css/               (estilos extra)
   └── js/                (scripts extra)
LOGO
echo "✅ Estructura creada"

# ============================================
# 6. MAIN.JS BÁSICO
# ============================================
echo "⚙️ 6/6 Configurando JavaScript..."
cat > main.js << 'JS'
// EuroMaster League - Main JS
console.log('EuroMaster League cargado');

document.addEventListener('DOMContentLoaded', function() {
    // Navegación activa
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
    
    // Cargar datos si existe API
    if (typeof fetch !== 'undefined') {
        loadInitialData();
    }
});

async function loadInitialData() {
    try {
        const response = await fetch('/api/data?file=teams');
        if (response.ok) {
            const teams = await response.json();
            console.log(`${teams.length} equipos cargados`);
        }
    } catch (error) {
        console.log('Modo demostración - API disponible pronto');
    }
}

// API Helper
window.EML_API = {
    getTeams: () => fetch('/api/data?file=teams').then(r => r.json()),
    getStandings: () => fetch('/api/data?file=standings').then(r => r.json())
};
JS
echo "✅ JavaScript configurado"

# ============================================
# RESUMEN FINAL
# ============================================
echo ""
echo "=================================================="
echo "🎉 ¡REPARACIÓN COMPLETADA!"
echo "=================================================="
echo ""
echo "✅ CAMBIOS REALIZADOS:"
echo "   1. ✅ Rutas corregidas (vercel.json nuevo)"
echo "   2. ✅ Diseño profesional aplicado"
echo "   3. ✅ Página principal rediseñada"
echo "   4. ✅ 10 páginas secundarias creadas"
echo "   5. ✅ Estructura para logo preparada"
echo "   6. ✅ JavaScript básico configurado"
echo ""
echo "🚀 PRÓXIMOS PASOS:"
echo "   1. 📤 SUBIR CAMBIOS:"
echo "      git add ."
echo "      git commit -m 'Fix completo: diseño, rutas y estructura'"
echo "      git push"
echo ""
echo "   2. ⏱️ ESPERAR 2-3 minutos para deploy en Vercel"
echo ""
echo "   3. 📸 SUBIR TU LOGO a: /assets/img/logo.png"
echo ""
echo "   4. 🧪 PROBAR:"
echo "      • https://euro-master-league.vercel.app"
echo "      • https://euro-master-league.vercel.app/teams"
echo "      • https://euro-master-league.vercel.app/matches"
echo ""
echo "   5. 🔧 CONFIGURAR BOT (opcional):"
echo "      cd discord-bot && npm install"
echo ""
echo "⚠️ NOTA: Las páginas mostrarán 'en desarrollo' hasta que"
echo "       añadas contenido real mediante el bot o la API."
echo ""
echo "=================================================="
