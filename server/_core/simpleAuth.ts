import type { Express, Request, Response } from "express";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { ENV } from "./env";

// Fixed identifier for the single site admin created by this simplified auth
// flow. There's only ever one admin account, so a constant openId is fine.
export const ADMIN_OPEN_ID = "admin-local";

function getSecretKey() {
  if (!ENV.cookieSecret) {
    throw new Error("JWT_SECRET is not configured — required to sign admin sessions.");
  }
  return new TextEncoder().encode(ENV.cookieSecret);
}

export async function signAdminSessionToken(): Promise<string> {
  return await new SignJWT({ openId: ADMIN_OPEN_ID, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor((Date.now() + ONE_YEAR_MS) / 1000))
    .sign(getSecretKey());
}

export async function verifyAdminSessionToken(token: string): Promise<{ openId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (payload.openId !== ADMIN_OPEN_ID) return null;
    return { openId: ADMIN_OPEN_ID };
  } catch {
    return null;
  }
}

/** Reads and verifies the session cookie on an incoming request, returning
 * the logged-in admin user row (or null if not authenticated). */
export async function authenticateAdminRequest(req: Request) {
  const cookies = parseCookieHeader(req.headers.cookie ?? "");
  const token = cookies[COOKIE_NAME];
  if (!token) return null;

  const verified = await verifyAdminSessionToken(token);
  if (!verified) return null;

  return await db.getUserByOpenId(verified.openId);
}

export function registerSimpleAuthRoutes(app: Express) {
  app.post("/api/admin/login", async (req: Request, res: Response) => {
    if (!ENV.adminPassword) {
      res.status(500).json({ error: "ADMIN_PASSWORD is not configured on the server." });
      return;
    }

    const password = typeof req.body?.password === "string" ? req.body.password : "";
    if (!password || password !== ENV.adminPassword) {
      res.status(401).json({ error: "Incorrect password." });
      return;
    }

    await db.upsertUser({
      openId: ADMIN_OPEN_ID,
      name: "Admin",
      email: null,
      loginMethod: "password",
      role: "admin",
      lastSignedIn: new Date(),
    });

    const sessionToken = await signAdminSessionToken();
    const cookieOptions = getSessionCookieOptions(req);
    res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

    res.json({ success: true });
  });
}
