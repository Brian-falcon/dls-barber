import crypto from "crypto";

const AUTH_SECRET = process.env.AUTH_SECRET;
const SESSION_COOKIE_NAME = "dls_session";
const SALT_LENGTH = 16;
const ITERATIONS = 120000;
const KEY_LEN = 64;
const DIGEST = "sha512";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

// AUTH_SECRET may be undefined during build/analysis; validate at runtime where needed.

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(SALT_LENGTH).toString("hex");
  const derivedKey = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LEN, DIGEST).toString("hex");
  return `${salt}:${derivedKey}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, key] = storedHash.split(":");
  if (!salt || !key) return false;

  const derivedKey = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LEN, DIGEST).toString("hex");
  const storedBuffer = Buffer.from(key, "hex");
  const derivedBuffer = Buffer.from(derivedKey, "hex");

  return (
    storedBuffer.length === derivedBuffer.length &&
    crypto.timingSafeEqual(storedBuffer, derivedBuffer)
  );
}

export function validateEmail(email: string) {
  return /^\S+@\S+\.\S+$/.test(email.trim());
}

export function validatePassword(password: string) {
  return password.length >= 8;
}

export function validateName(nombre: string) {
  return nombre.trim().length >= 2;
}

export type SessionPayload = {
  userId: string;
  rol: string;
  exp: number;
};

function sign(payload: string) {
  return crypto.createHmac(DIGEST, AUTH_SECRET!).update(payload).digest("base64url");
}

export function createSessionToken(userId: string, rol: string) {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS;
  const payload = { userId, rol, exp };
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const signature = sign(encoded);
  return `${encoded}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const [encoded, signature] = token.split(".");
    if (!encoded || !signature) return null;

    const expectedSignature = sign(encoded);
    const signatureBuffer = Buffer.from(signature, "utf8");
    const expectedBuffer = Buffer.from(expectedSignature, "utf8");
    if (signatureBuffer.length !== expectedBuffer.length) return null;
    if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) return null;

    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as SessionPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function createSessionCookie(token: string) {
  return {
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE_SECONDS,
  };
}

export function getSessionCookieName() {
  return SESSION_COOKIE_NAME;
}
