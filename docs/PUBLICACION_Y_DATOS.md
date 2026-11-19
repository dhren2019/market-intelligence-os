# Market Intelligence OS — fuentes, despliegue y límites

## 1. Proyecto original preservado

`src/app/`, `src/db/`, `src/domain/`, `scripts/`, `drizzle/`, `tests/`, `data/imports/seed/` y los archivos ocultos versionables proceden del ZIP original. La web dinámica Next.js 16 usa API y base de datos local; no es compatible con GitHub Pages sin backend remoto.

Las nuevas páginas `src/app/mercados/` y el componente compartido `src/components/market/market-explorer.tsx` están **dentro de Next.js** y reutilizan las variables CSS, tipografía, layout y tokens originales. No se ha sustituido la aplicación por una página HTML independiente.

## 2. Proyección pública en GitHub Pages

`web/` es únicamente un empaquetador **React/Vite del mismo componente de mercado y el mismo diseño CSS**, para poder visitar la investigación sin un backend. No es un producto duplicado escrito a mano en HTML. El workflow `deploy-market-pages.yml` publica `web/dist` en GitHub Pages cuando cambia la rama de desarrollo. Debe estar habilitada la fuente **GitHub Actions** en Settings → Pages y permitidos los permisos de despliegue del repositorio.

La web pública contiene categorías, datos con fuentes, gráficos, imágenes oficiales Open Graph, competidores, catálogo de las 55 ideas, enlaces y exportación CSV. La importación JSON/JSONL del sitio está limitada a la sesión del navegador; no es la API persistente de Next.js.

## 3. Persistencia y automatizaciones

El backend original usa PGlite, por lo que el cron de GitHub Actions y un hosting serverless no comparten automáticamente la base. Para usar la aplicación completa online, migrar a Neon/PostgreSQL hospedado y agregar autenticación. Mantener `MIO_ADMIN_TOKEN`, claves y `DATABASE_URL` fuera del repositorio; no incrustar credenciales en Vite.

Un JSON de evidencias diario puede seguir versionándose en `gh-pages/data/daily-research.json` hasta que exista backend. La web lo recupera de GitHub Raw con caché variable; esta vía no constituye una ingesta completa de Google Trends/Trendshift. Google Trends API Alpha requiere acceso oficial y los índices de Trends son relativos, no volúmenes absolutos. Trendshift representa popularidad de repositorios, no ingresos.

## 4. Calidad de evidencia y propiedad intelectual

- Toda cifra muestra fuente, período, universo, unidad y si es estimación o encuesta.
- El ranking Sensor Tower de octubre 2026 no son estados financieros auditados de cada juego.
- Los gráficos AppMagic H1 2026 excluyen ingresos por publicidad.
- Los precios publicados de herramientas distintas no forman una serie de mercado.
- Todas las imágenes externas usan OG o assets oficiales con atribución específica por ficha. No se copia código, assets ni diseño protegido de competidores.
- Los cuatro criterios de inversión se aplican a hipótesis. Juegos: el uso frecuente se debe probar con retención real D1/D7.

## 5. Rutas

- `/` — Home original + mapa de mercados.
- `/mercados` — Radar visual.
- `/mercados/apps`, `/mercados/games`, `/mercados/saas`, `/mercados/software`, `/mercados/webdev`, `/mercados/tourism` — verticales.
- `/apps`, `/oportunidades`, `/fuentes`, `/empresas`, `/importaciones`, etc. — rutas del proyecto original intactas.

El despliegue público de GitHub Pages no ejecuta las rutas de API de Next. Se implementa en `web/` una vista de lectura/filtrado del catálogo para mantener utilidad inmediata.

## 6. Pruebas

`pnpm install --frozen-lockfile`, `pnpm typecheck`, `pnpm test`, `pnpm build` para Next; `npm install --prefix web`, `npm run build --prefix web` para Pages. Ejecutar tests E2E del repositorio original antes de pasar a producción con backend.
