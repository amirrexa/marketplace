import jwt from "jsonwebtoken"
import { jwtVerify, SignJWT } from "jose";

const secret = process.env.JWT_SECRET!;

export function signJwt(payload: object) {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
}

export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    console.error("❌ Invalid JWT:", err);
    return null;
  }
}

const joseSecret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function verifyJwtEdge(token: string) {
  try {
    const { payload } = await jwtVerify(token, joseSecret);
    return payload;
  } catch (err) {
    console.error("❌ Edge JWT error:", err);
    return null;
  }
}
