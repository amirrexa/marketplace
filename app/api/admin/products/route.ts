import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwtEdge } from "@/lib/auth";

export async function GET(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const payload = await verifyJwtEdge(token || "");

    if (!payload || payload.role !== "ADMIN") {
        return Response.json({ message: "Forbidden" }, { status: 403 });
    }

    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                seller: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });

        return Response.json({ products });
    } catch (err) {
        console.error("❌ Failed to fetch products:", err);
        return Response.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
