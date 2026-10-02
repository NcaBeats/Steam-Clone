# Mini-Proyecto (Frontend)

Tienda de videojuegos — frontend **Next.js** que consume el backend Spring Boot
(`Proyecto-Juegos-Monolito`).

## Stack

| | |
|---|---|
| Framework | Next.js **16.3.0** (App Router, Turbopack) |
| UI | React **19.2.8**, TypeScript 5, Tailwind CSS **4** |
| Componentes | shadcn/ui (Base UI), lucide-react |
| Extras | embla-carousel, gsap, react-dropzone, zod |
| Package manager | pnpm 11 |

## Requisitos

- **Node.js 20+**
- **pnpm**
- El **backend corriendo** en `http://localhost:9090` (ver README de Proyecto-Juegos-Monolito)

## Configuración

Creá un `.env` con:

```bash
# Base de la API (una sola: server y client). Evaluada en build time.
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:9090/api/v1
```

Solo hace falta esa variable: el backend ya devuelve URLs absolutas de R2 en
todas las columnas de media, así que el frontend no necesita saber el bucket.

## Comandos

```bash
pnpm install
pnpm dev        # desarrollo (Turbopack, http://localhost:3000)
pnpm build      # build de producción
pnpm start      # servir el build de producción
pnpm lint       # eslint
```

## Estructura

- `app/(main)/` — rutas públicas: home, `catalog`, `games/[id]`, `blog`, `cart`,
  `checkout`, `library`, `search`, `contact`, `about`
- `app/(auth)/` — login/signup
- `app/(admin)/` y `app/(studio)/` — paneles de administración y estudios (vendedores)
- `actions/` — Server Actions (muta datos, define revalidaciones)
- `lib/api/` — `fetchAPI` (maneja JWT, caché, paginación) + tipos por dominio
- `schemas/` — validación Zod
- `components/` — UI compartida (games, cart, blog, admin)

## Notas y decisiones

- **Autenticación**: JWT en cookie `token`; las acciones y lecturas con `auth: true`
  envían `Authorization: Bearer <token>` automáticamente.
- **Caché**: las lecturas públicas de juegos/catálogo usan `noStore` — siempre se
  consultan al backend, por lo que borrar un juego se refleja al instante (404 en su
  detalle) sin depender de invalidaciones de caché.
- **Imágenes y vídeos**: subidos directo a Cloudflare R2 con URL prefirmada desde
  el navegador. El backend guarda la URL pública absoluta que devuelve R2, así que
  el frontend la usa tal cual (imágenes vía `next/image`). `lib/media.ts` solo
  valida que sea absoluta y falla en voz alta si aparece una ruta.
- La API completa (server y client) usa una sola variable, `NEXT_PUBLIC_API_BASE_URL`, evaluada en build time.