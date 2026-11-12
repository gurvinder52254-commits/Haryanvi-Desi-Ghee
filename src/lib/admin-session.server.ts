// Server-only admin session helpers. Import this file only with a dynamic
// `await import(...)` inside a server function handler, never at the top of a file
// that the browser also loads.
import crypto from "node:crypto";
import { deleteCookie, getCookie, getRequestIP, setCookie } from "@tanstack/react-start/server";

// The admin password lives only in the server environment variable ADMIN_PASSWORD
// (set it in Render / your host's dashboard). It is never sent to the browser.
// When ADMIN_PASSWORD is not set, admin login is disabled.

const COOKIE = "hdg_admin";
const SESSION_HOURS = 12;

function hmac(message: string) {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
  return crypto.createHmac("sha256", secret).update(message).digest("hex");
}

function safeEqual(a: string, b: string) {
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

function tokenValid(token: string | undefined) {
  if (!token || !process.env.ADMIN_PASSWORD) return false;
  const [expStr, sig] = token.split(".");
  const expires = Number(expStr);
  if (!expires || !sig || expires < Date.now()) return false;
  return safeEqual(sig, hmac(`admin:${expires}`));
}

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function isAdmin() {
  return tokenValid(getCookie(COOKIE));
}

/** Throws unless the current request carries a valid admin session. */
export function requireAdmin() {
  if (!isAdmin()) throw new Error("Not authorised. Please log in again.");
}

// Slow down password guessing: one failed attempt per IP every 2 seconds, max 10 per 15 minutes.
const attempts = new Map<string, { count: number; first: number; last: number }>();

export function login(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw new Error("Admin login is not set up. Add ADMIN_PASSWORD on the server.");

  const ip = getRequestIP({ xForwardedFor: true }) || "unknown";
  const now = Date.now();
  const old = attempts.get(ip);
  if (old && now - old.first > 15 * 60 * 1000) attempts.delete(ip);
  const cur = attempts.get(ip);
  if (cur && (cur.count >= 10 || now - cur.last < 2000)) {
    throw new Error("Too many attempts. Please wait a few minutes and try again.");
  }

  if (!safeEqual(password, expected)) {
    attempts.set(ip, { count: (cur?.count ?? 0) + 1, first: cur?.first ?? now, last: now });
    throw new Error("Wrong password.");
  }
  attempts.delete(ip);

  const expires = now + SESSION_HOURS * 60 * 60 * 1000;
  setCookie(COOKIE, `${expires}.${hmac(`admin:${expires}`)}`, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_HOURS * 60 * 60,
  });
}

export function logout() {
  deleteCookie(COOKIE, { path: "/" });
}
