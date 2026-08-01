import { PrismaClient } from "@prisma/client";
import crypto from "node:crypto";

const prisma = new PrismaClient();
const email = process.env.SEED_ADMIN_EMAIL;
const password = process.env.SEED_ADMIN_PASSWORD;
const barberEmail = process.env.SEED_BARBER_EMAIL;
const barberPassword = process.env.SEED_BARBER_PASSWORD;

if (!email || !password) {
  throw new Error("Definí SEED_ADMIN_EMAIL y SEED_ADMIN_PASSWORD antes de ejecutar el seed.");
}

function hashPassword(value) {
  const salt = crypto.randomBytes(16).toString("hex");
  const key = crypto.pbkdf2Sync(value, salt, 120000, 64, "sha512").toString("hex");
  return `${salt}:${key}`;
}

async function ensureBarber(nombre, descripcion) {
  const existing = await prisma.barber.findFirst({ where: { nombre } });
  return existing ?? prisma.barber.create({ data: { nombre, descripcion, activo: true } });
}

async function ensureService(nombre, descripcion, precio, duracion) {
  const existing = await prisma.service.findFirst({ where: { nombre } });
  return existing ?? prisma.service.create({ data: { nombre, descripcion, precio, duracion } });
}

async function main() {
  await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: { nombre: "Administrador DLS", password: hashPassword(password), rol: "ADMIN" },
    create: { nombre: "Administrador DLS", email: email.toLowerCase(), password: hashPassword(password), rol: "ADMIN" },
  });

  await Promise.all([
    ensureBarber("Diego López", "Especialista en cortes clásicos y modernos."),
    ensureBarber("Mateo Silva", "Experto en fades, barba y perfilado."),
    ensureBarber("Valentín Ruiz", "Barbero especializado en estilos urbanos."),
    ensureService("Corte clásico", "Corte, lavado y peinado.", 900, 30),
    ensureService("Corte premium", "Corte personalizado con acabado premium.", 1300, 45),
    ensureService("Barba", "Perfilado y arreglo de barba.", 700, 30),
    ensureService("Corte + barba", "Servicio completo de corte y barba.", 1700, 60),
  ]);

  if (barberEmail || barberPassword) {
    if (!barberEmail || !barberPassword) throw new Error("Definí SEED_BARBER_EMAIL y SEED_BARBER_PASSWORD juntos.");
    const barberUser = await prisma.user.upsert({
      where: { email: barberEmail.toLowerCase() },
      update: { nombre: "Diego López", password: hashPassword(barberPassword), rol: "BARBERO" },
      create: { nombre: "Diego López", email: barberEmail.toLowerCase(), password: hashPassword(barberPassword), rol: "BARBERO" },
    });
    const profile = await prisma.barber.findFirst({ where: { nombre: "Diego López" } });
    if (profile) await prisma.barber.update({ where: { id: profile.id }, data: { userId: barberUser.id } });
  }

  console.log("Datos iniciales creados o actualizados.");
}

main().finally(() => prisma.$disconnect());
