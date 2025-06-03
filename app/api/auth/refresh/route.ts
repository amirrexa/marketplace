import { prisma } from "@/lib/prisma";
import { signJwt, verifyJwt } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return Response.json({ message: "No token provided" }, { status: 401 });

    const payload = verifyJwt(token);
    if (!payload || typeof payload !== "object" || !("id" in payload)) {
      return Response.json({ message: "Invalid or expired token" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, email: true, role: true },
    });

    if (!user) return Response.json({ message: "User not found" }, { status: 404 });

    const newToken = signJwt({ id: user.id, email: user.email, role: user.role });
    cookieStore.set("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return Response.json({ message: "Token refreshed" });
  } catch (error) {
    console.error("Refresh error:", error);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}