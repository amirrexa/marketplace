import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";

export async function POST(req: Request) {
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

    if (!token) return Response.json({ message: "Unauthorized" }, { status: 401 });

    const payload = verifyJwt(token);
    if (!payload || typeof payload !== "object" || !("id" in payload)) {
        return Response.json({ message: "Invalid token" }, { status: 401 });
    }

    const { productIds } = await req.json();

    if (!Array.isArray(productIds) || productIds.length === 0) {
        return Response.json({ message: "Missing or invalid productIds" }, { status: 400 });
    }

    // OPTIONAL: Prevent duplicate order creation if you need to
    // You may skip this part if you now treat one order as a group of products

    // Create the grouped order
    await prisma.order.create({
        data: {
            buyerId: payload.id,
            products: {
                connect: productIds.map((id: string) => ({ id })),
            },
        },
    });

    return Response.json({ message: `Requested ${productIds.length} product(s) successfully` });
}
