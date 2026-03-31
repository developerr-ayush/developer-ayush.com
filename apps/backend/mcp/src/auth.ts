import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "./db.js";

const JWT_SECRET = process.env.MCP_JWT_SECRET ?? "mcp-dev-secret-change-me";
const JWT_EXPIRY = "4h";

export interface SessionPayload {
  userId: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "USER";
  name: string | null;
}

/**
 * Verifies email/password and returns a signed JWT session token.
 * Returns null if credentials are invalid.
 */
export async function loginUser(
  email: string,
  password: string
): Promise<{ token: string; user: SessionPayload } | { error: string }> {
  const user = await db.user.findUnique({ where: { email } });

  if (!user || !user.password) {
    return { error: "Invalid credentials" };
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return { error: "Invalid credentials" };
  }

  const payload: SessionPayload = {
    userId: user.id,
    email: user.email,
    role: user.role as SessionPayload["role"],
    name: user.name ?? null,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });

  return { token, user: payload };
}

/**
 * Validates a session token and returns the payload or throws.
 */
export function verifySession(token: string): SessionPayload {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as SessionPayload & {
      iat: number;
      exp: number;
    };
    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      name: payload.name,
    };
  } catch {
    throw new Error("Invalid or expired session token. Please login again.");
  }
}
