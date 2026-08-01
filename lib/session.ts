import { cookies } from "next/headers";
import { verifySessionToken, getSessionCookieName } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function isAdmin() {
  return (await getCurrentUser())?.rol === "ADMIN";
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  return prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, rol: true, nombre: true, email: true },
  });
}
