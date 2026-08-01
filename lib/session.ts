import { cookies } from "next/headers";
import { verifySessionToken, getSessionCookieName } from "@/lib/auth";

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
