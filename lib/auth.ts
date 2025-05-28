import jwt from "jsonwebtoken"
import { jwtVerify } from "jose";

const secret = process.env.JWT_SECRET!;

export function signJwt(payload: object) {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
}

export function verifyJwt(token: string) {
  console.log("Token:", token ? token.slice(0, 10) + "..." : "No token");
  try {
    const payload = jwt.verify(token, secret);
    console.log("Payload:", payload);
    return payload;
  } catch (err) {
    console.error("JWT Error:", err);
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
