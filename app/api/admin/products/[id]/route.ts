import { NextRequest } from "next/server";
import { verifyJwtEdge } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const payload = await verifyJwtEdge(token || "");

    if (!payload || payload.role !== "ADMIN") {
        return Response.json({ message: "Forbidden" }, { status: 403 });
    }

    const id = req.nextUrl.pathname.split("/").pop(); // ✅ Extract product ID safely

    if (!id) {
        return Response.json({ message: "Missing product ID" }, { status: 400 });
    }

    try {
        await prisma.product.delete({
            where: { id },
        });

        return Response.json({ message: "Product deleted successfully" });
    } catch (err) {
        console.error("❌ Delete error:", err);
        return Response.json({ message: "Delete failed" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const payload = await verifyJwtEdge(token || "");

    if (!payload || payload.role !== "ADMIN") {
        return Response.json({ message: "Forbidden" }, { status: 403 });
    }

    const id = req.nextUrl.pathname.split("/").pop();
    const { title, price, description, status } = await req.json();

    if (!title || !price || !description || !status) {
        return Response.json({ message: "Missing fields" }, { status: 400 });
    }

    await prisma.product.update({
        where: { id },
        data: {
            title,
            price: parseFloat(price),
            description,
            status,
        },
    });

    return Response.json({ message: "Product updated" });
}

