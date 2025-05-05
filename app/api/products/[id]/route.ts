import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        const payload = verifyJwt(token);
        if (!payload || typeof payload !== "object" || !("id" in payload)) {
            return Response.json({ message: "Invalid token" }, { status: 401 });
        }

        const product = await prisma.product.findUnique({ where: { id: params.id } });

        if (!product || product.sellerId !== payload.id) {
            return Response.json({ message: "Not allowed" }, { status: 403 });
        }

        await prisma.product.delete({ where: { id: params.id } });

        return Response.json({ message: "Product deleted" });
    } catch (err) {
        console.error("Delete error:", err);
        return Response.json({ message: "Server error" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return Response.json({ message: "Unauthorized" }, { status: 401 });

    const payload = verifyJwt(token);
    if (!payload || typeof payload !== "object" || !("id" in payload)) {
        return Response.json({ message: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, price } = body;

    if (!title || !description || !price) {
        return Response.json({ message: "Missing fields" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: params.id } });

    if (!product || product.sellerId !== payload.id) {
        return Response.json({ message: "Not allowed" }, { status: 403 });
    }

    await prisma.product.update({
        where: { id: params.id },
        data: { title, description, price: parseFloat(price) },
    });

    return Response.json({ message: "Product updated" });
}