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

Creá un `.env.local` con:

```bash
# Base de la API (server-side, usada por lib/api/fetch.ts)
API_BASE_URL=http://127.0.0.1:9090/api/v1

# Base de la API (client-side: búsqueda, media)
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:9090/api/v1

# URL pública de videos subidos a Cloudflare R2
NEXT_PUBLIC_R2_PUBLIC_BASE_URL=
```

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
- **Imágenes**: Cloudinary vía `next/image` con el prop `sizes` seteado; **videos**:
  subidos por el backend a Cloudflare R2 y servidos desde `NEXT_PUBLIC_R2_PUBLIC_BASE_URL`.
- La búsqueda (client) usa `NEXT_PUBLIC_API_BASE_URL`; el resto de la API va server-side.