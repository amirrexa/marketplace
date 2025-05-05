// app/api/me/route.ts

import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const cookieStore = await cookies(); // ✅ fix
    const token = cookieStore.get("token")?.value;
    const payload = verifyJwt(token || "");

    if (!payload || typeof payload !== "object" || !("id" in payload)) {
        return Response.json({ user: null });
    }

    const user = await prisma.user.findUnique({
        where: { id: payload.id },
        select: {
            id: true,
            email: true,
            role: true,
        },
    });

    return Response.json({ user });
}
