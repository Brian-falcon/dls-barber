Preparación para producción y despliegue en Vercel

Requisitos de entorno (Vercel/Neon):
- `DATABASE_URL` (Neon/Postgres)
- `AUTH_SECRET` (clave para sesiones)
- `NEXT_PUBLIC_SITE_URL` (URL pública)

Pasos recomendados:
1. Configurar variables de entorno en Vercel: `DATABASE_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL`.
2. Conectar el repositorio GitHub a Vercel (Import Project). Vercel detecta Next.js.
3. Build Command: `npm run build` (por defecto).
4. Output Directory: no aplicar (Next.js App Router).
5. Instalar migraciones/prisma:
   - En local: `npx prisma migrate deploy` (para production) y `npx prisma generate`.
6. Verificar en staging: crear usuario y reservar para comprobar integraciones.

Notas:
- `postinstall` ejecuta `prisma generate` para garantizar cliente generado en Vercel.
- Mantén `AUTH_SECRET` seguro; Vercel's Environment Variables ayudan.
- Para Neon: utiliza la `DATABASE_URL` provista por Neon.
