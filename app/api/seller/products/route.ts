export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJwtEdge } from "@/lib/auth";
import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Define the internal payload shape for the route
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

// Reusable authorization check
async function authorizeSeller(): Promise<JwtPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const payload = token ? await verifyJwtEdge(token) : null;

    if (
        !payload ||
        typeof payload !== "object" ||
        !("id" in payload) ||
        typeof payload.id !== "string" ||
        !("role" in payload) ||
        typeof payload.role !== "string" ||
        payload.role !== "SELLER"
    ) {
        return null;
    }

    return {
        id: payload.id,
        role: payload.role,
    };
}

export async function GET() {
    const payload = await authorizeSeller();

    if (!payload) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const products = await prisma.product.findMany({
            where: { sellerId: payload.id },
            orderBy: { createdAt: "desc" },
        });

        return Response.json({ products });
    } catch (error) {
        console.error("GET /api/seller/products error:", error);
        return Response.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const payload = await authorizeSeller();

    if (!payload) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const price = formData.get("price") as string;
        const status = formData.get("status") as string;
        const file = formData.get("file");
        if (!(file instanceof File)) {
            return Response.json({ message: "Missing or invalid file" }, { status: 400 });
        }

        if (!title || !description || !price || !status) {
            return Response.json({ message: "Missing required fields" }, { status: 400 });
        }

        // Validate price
        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            return Response.json({ message: "Invalid price" }, { status: 400 });
        }

        // Validate and cast status
        if (!["FOR_SALE", "ON_SALE", "NOT_AVAILABLE"].includes(status)) {
            return Response.json({ message: "Invalid status" }, { status: 400 });
        }
        const productStatus = status as ProductStatus;

        // Initialize Supabase client
        if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
            console.error("Supabase environment variables missing");
            return Response.json({ message: "Server configuration error" }, { status: 500 });
        }

        const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
            auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
        });

        // Debug: confirm the project + permissions at runtime (remove once fixed)
        try {
            const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
            console.log("[storage] SUPABASE_URL:", process.env.SUPABASE_URL);
            console.log("[storage] bucketsError:", bucketsError);
            console.log("[storage] buckets:", buckets?.map((b) => b.name));
        } catch (e) {
            console.log("[storage] listBuckets threw:", e);
        }

        const fileExt = file.name.split(".").pop();
        if (!fileExt) {
            return Response.json({ message: "Invalid file format" }, { status: 400 });
        }

        const fileName = `${Date.now()}.${fileExt}`;
        const path = `public/${fileName}`;
        const bytes = new Uint8Array(await file.arrayBuffer());

        const { error: uploadError } = await supabase.storage
            .from("products")
            .upload(path, bytes, {
                contentType: file.type || "application/octet-stream",
                upsert: false,
            });

        if (uploadError) {
            console.error("Supabase upload error:", uploadError);
            return Response.json({ message: `Failed to upload image: ${uploadError.message}` }, { status: 500 });
        }

        const { data: publicData } = supabase.storage.from("products").getPublicUrl(path);
        const fileUrl = publicData.publicUrl;

        const product = await prisma.product.create({
            data: {
                title,
                description,
                price: parsedPrice,
                fileUrl,
                status: productStatus,
                sellerId: payload.id,
            },
        });

        return Response.json({ message: "Product uploaded successfully", product }, { status: 201 });
    } catch (error) {
        console.error("POST /api/seller/products error:", error);
        return Response.json({ message: "Internal server error" }, { status: 500 });
    }
}