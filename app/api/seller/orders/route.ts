import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJwtEdge } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const payload = token ? await verifyJwtEdge(token) : null;

    if (!payload || typeof payload !== "object" || !("id" in payload) || !("role" in payload) || payload.role !== "SELLER") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
        where: {
            products: {
                some: {
                    sellerId: payload.id as string,
                },
            },
        },
        include: {
            buyer: {
                select: {
                    email: true,
                    name: true,
                },
            },
            products: {
                select: {
                    id: true,
                    title: true,
                    price: true,
                    fileUrl: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
}