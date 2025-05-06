import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function DELETE(req: NextRequest) {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const payload = token ? await verifyJwt(token) : null;

    if (!id || !payload || typeof payload !== "object" || !("id" in payload)) {
        return Response.json({ message: "Unauthorized or missing ID" }, { status: 401 });
    }

    const product = await prisma.product.findUnique({ where: { id } });

    if (!product || product.sellerId !== payload.id) {
        return Response.json({ message: "Not allowed" }, { status: 403 });
    }

    await prisma.product.delete({ where: { id } });

    return Response.json({ message: "Product deleted" });
}

export async function PATCH(req: NextRequest) {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const payload = token ? await verifyJwt(token) : null;
    if (!id || !payload || typeof payload !== "object" || !("id" in payload)) {
        return Response.json({ message: "Invalid token or missing ID" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, price } = body;

    if (!title || !description || !price) {
        return Response.json({ message: "Missing fields" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id } });

    if (!product || product.sellerId !== payload.id) {
        return Response.json({ message: "Not allowed" }, { status: 403 });
    }

    await prisma.product.update({
        where: { id },
        data: { title, description, price: parseFloat(price) },
    });

    return Response.json({ message: "Product updated" });
}
