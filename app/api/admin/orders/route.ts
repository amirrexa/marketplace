import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { verifyJwtEdge } from "@/lib/auth";

export async function GET(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const payload = await verifyJwtEdge(token || "");

    if (!payload || payload.role !== "ADMIN") {
        return Response.json({ message: "Forbidden" }, { status: 403 });
    }

    const orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            products: {
                select: {
                    id: true,
                    title: true,
                    price: true,
                    fileUrl: true,
                },
            },
            buyer: {
                select: {
                    name: true,
                    email: true,
                },
            },
        },
    });

    // Don't group — return each order as-is
    return Response.json({ orders });
}
