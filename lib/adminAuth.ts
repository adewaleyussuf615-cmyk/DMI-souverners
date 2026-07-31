import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "gifted_delites_admin_session";

// The cookie is set to SESSION_SECRET (a random string you generate yourself,
// see .env.example) only after the correct ADMIN_PASSWORD is submitted.
// It is httpOnly so client-side JS can never read it, and it is never the
// password itself -- just a session secret you control.

export function checkPassword(candidate: string) {
  return Boolean(process.env.ADMIN_PASSWORD) && candidate === process.env.ADMIN_PASSWORD;
}

export function sessionCookieValue() {
  return process.env.SESSION_SECRET || "";
}

export function isValidSession(): boolean {
  const cookie = cookies().get(ADMIN_COOKIE_NAME)?.value;
  return Boolean(cookie) && cookie === process.env.SESSION_SECRET;
}
