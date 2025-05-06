// app/api/admin/users/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { verifyJwtEdge } from "@/lib/auth";

export async function GET(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const payload = await verifyJwtEdge(token || "");

    if (!payload || payload.role !== "ADMIN") {
        return Response.json({ message: "Forbidden" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            name: true,
        },
        orderBy: { createdAt: "desc" },
    });

    return Response.json({ users });
}