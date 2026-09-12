# Estudio Aire · Gestión

Sistema de gestión multi-tenant para estudios de pilates: agenda, alumnas, profesoras, servicios, abonos, ventas, compras, reserva online, caja y finanzas.

- **Stack**: Next.js 16 + React + TypeScript + Prisma 7 + PostgreSQL
- **Multi-tenant**: cada estudio tiene sus propios datos, marca y link de reserva
- **Deploy**: Vercel + Neon (Postgres)

---

## Setup para colaboradores (nuevo en el proyecto)

### 1. Requisitos
- Node.js 20.9+ (recomendado 22/24)
- Acceso al repo `vidagamestudio/equa_app` (colaborador)

### 2. Clonar e instalar
```bash
git clone https://github.com/vidagamestudio/equa_app.git
cd equa_app
npm install
```

### 3. Crear tu `.env.local`
Copiá el archivo de ejemplo y completalo:

```bash
cp .env.example .env.local
```

Las variables que necesitás:

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Cadena de conexión a PostgreSQL |
| `SESSION_PASSWORD` | Clave de cifrado de sesiones (32+ caracteres) |

> ⚠️ **Nunca** subas `.env.local` ni lo compartas por chat. Son secretos.

#### Opciones de base de datos para desarrollo
- **Compartida**: usá la misma `DATABASE_URL` que te pase el equipo (rápido, pero pisás datos).
- **Propia (recomendada)**: creá una base gratis en https://neon.tech y usá su connection string. Así no molestás los datos de los demás.

> Si usás una base nueva vacía, creá el esquema y cargá datos demo:
> ```bash
> npx prisma generate
> npm run db:seed
> ```

### 4. Correr el servidor de desarrollo
```bash
npm run dev
```
Abrí [http://localhost:3000](http://localhost:3000)

**Usuarios de demo** (después de `db:seed`):

| Estudio | Email | Contraseña |
|---|---|---|
| Estudio Aire | `admin@estudioaire.com` | `admin123` |
| Pilates Sol | `admin@pilatessol.com` | `admin123` |

Reserva pública: `http://localhost:3000/reservar/estudio-aire`

### 5. Flujo de trabajo (importante)
- Trabajá en una **rama propia**: `git checkout -b tu-rama`
- Nunca pushees directo a `main`.
- Al terminar, creá un **Pull Request** a `main` y describí qué cambiaste.
- Antes de empezar cada tarea: `git pull origin main`
- Vercel genera una **URL de preview** por cada PR para probar sin tocar producción.

### Scripts útiles
```bash
npm run dev          # servidor de desarrollo
npm run build        # build de producción
npm run lint         # linter
npm run db:generate  # regenerar cliente Prisma
npm run db:seed      # recargar datos demo
```

---

## Getting Started

Primero, ejecutá el servidor de desarrollo:

```bash
npm run dev
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
