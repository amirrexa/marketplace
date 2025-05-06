import { verifyJwtEdge } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function PATCH(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const payload = await verifyJwtEdge(token || "");

    if (!payload || payload.role !== "ADMIN") {
        return Response.json({ message: "Forbidden" }, { status: 403 });
    }

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    const { role: newRole } = await req.json();

    if (!id || !newRole || !["BUYER", "SELLER", "ADMIN"].includes(newRole)) {
        return Response.json({ message: "Invalid data" }, { status: 400 });
    }

    await prisma.user.update({
        where: { id },
        data: { role: newRole },
    });

    return Response.json({ message: "Role updated successfully" });
}
