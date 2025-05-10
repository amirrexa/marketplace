import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwtEdge } from "@/lib/auth";

// PATCH - Update order status
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

// DELETE - Delete an order by ID
export async function DELETE(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const payload = await verifyJwtEdge(token || "");

    if (!payload || payload.role !== "ADMIN") {
        return Response.json({ message: "Forbidden" }, { status: 403 });
    }

    const id = req.nextUrl.pathname.split("/").pop();

    if (!id) {
        return Response.json({ message: "Missing order ID" }, { status: 400 });
    }

    try {
        await prisma.order.delete({
            where: { id },
        });

        return Response.json({ message: "Order deleted successfully" });
    } catch (err) {
        console.error("❌ Failed to delete order:", err);
        return Response.json({ message: "Failed to delete order" }, { status: 500 });
    }
}
