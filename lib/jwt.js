/* JWT helpers — no Node-only imports so the proxy can use them too. */
import { SignJWT, jwtVerify } from "jose";

export const COOKIE = "hhs_admin";
export const MAX_AGE = 60 * 60 * 10; // 10 hours — one school working day

function key() {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 32) throw new Error("JWT_SECRET must be set (32+ characters)");
  return new TextEncoder().encode(s);
}

export async function signToken(admin) {
  return new SignJWT({ role: admin.role, tv: admin.token_version, email: admin.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(admin.id))
    .setIssuedAt()
    .setIssuer("hhs")
    .setAudience("hhs-admin")
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(key());
}

export async function verifyToken(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key(), {
      issuer: "hhs",
      audience: "hhs-admin",
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    return null;
  }
}
