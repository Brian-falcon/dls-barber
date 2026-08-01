# Producción y despliegue

## Variables de entorno

Configurá estas variables en Vercel para **Production**, **Preview** y **Development**:

- `DATABASE_URL`: cadena de conexión de Neon/Postgres.
- `AUTH_SECRET`: valor aleatorio de al menos 32 caracteres. No lo reutilices ni lo publiques.
- `NEXT_PUBLIC_SITE_URL`: URL HTTPS pública y definitiva, por ejemplo `https://tu-dominio.com`.

Usá una base de datos distinta para Preview si el proyecto va a recibir pruebas externas.

## Despliegue

1. Importá el repositorio en Vercel; el framework se detecta como Next.js.
2. Conservá `npm run build` como Build Command y no configures Output Directory.
3. Antes del primer deploy, ejecutá `npx prisma migrate deploy` contra la base de producción. Nunca uses `prisma migrate dev` en producción.
4. Desplegá y verificá `https://tu-dominio.com/api/health`; debe responder `{ "status": "ok" }`.
5. Probá registro, inicio de sesión, reserva, cancelación y el panel administrador.

## Notas

- `postinstall` ejecuta `prisma generate`, por lo que Vercel genera el cliente de Prisma durante la instalación.
- Vercel provee `VERCEL_URL` automáticamente y se usa como respaldo para el metadata. Aun así, configurá `NEXT_PUBLIC_SITE_URL` con el dominio final.
- La URL local `http://localhost:3000` sólo corresponde al archivo `.env` de desarrollo; no la copies a Production.
