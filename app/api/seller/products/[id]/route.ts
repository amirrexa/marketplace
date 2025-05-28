import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJwtEdge } from "@/lib/auth";
import { NextRequest } from "next/server";

// Define the expected shape of the JWT payload
interface JwtPayload {
    id: string;
    role: string;
}

// Define ProductStatus enum to match Prisma schema
enum ProductStatus {
    FOR_SALE = "FOR_SALE",
    ON_SALE = "ON_SALE",
    NOT_AVAILABLE = "NOT_AVAILABLE",
}

export async function DELETE(req: NextRequest) {
    const id = req.nextUrl.pathname.split("/").pop();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const payload = token ? await verifyJwtEdge(token) : null;

    if (
        !id ||
        !payload ||
        typeof payload !== "object" ||
        !("id" in payload) ||
        typeof payload.id !== "string" ||
        !("role" in payload) ||
        typeof payload.role !== "string" ||
        payload.role !== "SELLER"
    ) {
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
    const id = req.nextUrl.pathname.split("/").pop();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const payload = token ? await verifyJwtEdge(token) : null;

    if (
        !id ||
        !payload ||
        typeof payload !== "object" ||
        !("id" in payload) ||
        typeof payload.id !== "string" ||
        !("role" in payload) ||
        typeof payload.role !== "string" ||
        payload.role !== "SELLER"
    ) {
        return Response.json({ message: "Invalid token or missing ID" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, price, status } = body;

    if (!title || !description || !price || !status) {
        return Response.json({ message: "Missing fields" }, { status: 400 });
    }

    if (!["FOR_SALE", "ON_SALE", "NOT_AVAILABLE"].includes(status)) {
        return Response.json({ message: "Invalid status" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id } });

    if (!product || product.sellerId !== payload.id) {
        return Response.json({ message: "Not allowed" }, { status: 403 });
    }

    await prisma.product.update({
        where: { id },
        data: {
            title,
            description,
            price: parseFloat(price),
            status: status as ProductStatus,
        },
    });

    return Response.json({ message: "Product updated" });
}

export async function GET(req: NextRequest) {
    const id = req.nextUrl.pathname.split("/").pop();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const payload = token ? await verifyJwtEdge(token) : null;

    if (
        !id ||
        !payload ||
        typeof payload !== "object" ||
        !("id" in payload) ||
        typeof payload.id !== "string" ||
        !("role" in payload) ||
        typeof payload.role !== "string" ||
        payload.role !== "SELLER"
    ) {
        return Response.json({ message: "Unauthorized or missing ID" }, { status: 401 });
    }

    const product = await prisma.product.findUnique({
        where: { id },
    });

    if (!product || product.sellerId !== payload.id) {
        return Response.json({ message: "Not allowed" }, { status: 403 });
    }

    return Response.json({ product });
}