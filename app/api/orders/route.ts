import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";

export async function POST(req: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return Response.json({ message: "Unauthorized" }, { status: 401 });

    const payload = verifyJwt(token);
    if (!payload || typeof payload !== "object" || !("id" in payload)) {
        return Response.json({ message: "Invalid token" }, { status: 401 });
    }

    const { productId } = await req.json();
    if (!productId) {
        return Response.json({ message: "Missing productId" }, { status: 400 });
    }

    // ✅ Prevent duplicates
    const existingOrder = await prisma.order.findFirst({
        where: {
            productId,
            buyerId: payload.id,
        },
    });

    if (existingOrder) {
        return Response.json({ message: "You've already requested this product" }, { status: 409 });
    }

    await prisma.order.create({
        data: {
            productId,
            buyerId: payload.id,
        },
    });

    return Response.json({ message: "Product requested successfully" });
}
