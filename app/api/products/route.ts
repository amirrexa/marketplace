import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";

export async function GET() {
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;
    const payload = verifyJwt(token || "");

    if (!payload || typeof payload !== "object" || !("id" in payload) || !("role" in payload)) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
    });

    return Response.json({ products });
}