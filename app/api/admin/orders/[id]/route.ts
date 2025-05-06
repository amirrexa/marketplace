import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwtEdge } from "@/lib/auth";

export async function PATCH(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const payload = await verifyJwtEdge(token || "");

    if (!payload || payload.role !== "ADMIN") {
        return Response.json({ message: "Forbidden" }, { status: 403 });
    }

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
        return Response.json({ message: "Missing order ID" }, { status: 400 });
    }

    const { status } = await req.json();

    const validStatuses = ["PENDING", "COMPLETED", "CANCELED"];
    if (!status || !validStatuses.includes(status)) {
        return Response.json({ message: "Invalid status" }, { status: 400 });
    }

    await prisma.order.update({
        where: { id },
        data: { status },
    });

    return Response.json({ message: "Order status updated" });
}
