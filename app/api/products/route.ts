import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import { randomUUID } from "crypto";

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 🔍 GET all products (admins see all, sellers see their own)
export async function GET() {
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

    const payload = verifyJwt(token || "");

    if (!payload || typeof payload !== "object" || !("id" in payload) || !("role" in payload)) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const products = await prisma.product.findMany({
        where: payload.role === "SELLER" ? { sellerId: payload.id } : undefined,
        orderBy: { createdAt: "desc" },
    });

    return Response.json({ products });
}

// 📦 POST a new product with file upload
export async function POST(req: Request) {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get("token")?.value;
        const payload = verifyJwt(token || "");

        if (
            !payload ||
            typeof payload !== "object" ||
            !("id" in payload) ||
            !("role" in payload) ||
            (payload.role !== "SELLER" && payload.role !== "ADMIN")
        ) {
            return Response.json({ message: "Invalid token or insufficient permissions" }, { status: 403 });
        }

        const formData = await req.formData();
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const price = parseFloat(formData.get("price") as string);
        const file = formData.get("file") as File;

        if (!title || !description || !price || !file) {
            return Response.json({ message: "Missing fields" }, { status: 400 });
        }

        const filename = `${Date.now()}-${randomUUID()}-${file.name}`;
        const fileBuffer = Buffer.from(await file.arrayBuffer());

        const { error: uploadError } = await supabase.storage
            .from("products")
            .upload(filename, fileBuffer, {
                contentType: file.type,
                upsert: true,
            });

        if (uploadError) {
            return Response.json({ message: "Upload failed", uploadError }, { status: 500 });
        }

        const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/products/${filename}`;

        await prisma.product.create({
            data: {
                title,
                description,
                price,
                fileUrl: publicUrl,
                sellerId: payload.id,
            },
        });

        return Response.json({ message: "Product uploaded!" });
    } catch (err) {
        console.error("Upload error:", err);
        return Response.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
