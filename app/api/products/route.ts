import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import { randomUUID } from "crypto";

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 🔍 GET all products (can be filtered later by sellerId)
export async function GET() {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
    });

    return Response.json({ products });
}

// 📦 POST a new product with file upload
export async function POST(req: Request) {
    try {
        // ✅ Extract and verify JWT
        const cookieStore = cookies();
        const token = (await cookieStore).get("token")?.value;

        if (!token) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        const payload = verifyJwt(token);

        if (!payload || typeof payload !== "object" || !("id" in payload) || !("role" in payload)) {
            return Response.json({ message: "Invalid token or insufficient permissions" }, { status: 401 });
        }

        if (payload.role !== "SELLER" && payload.role !== "ADMIN") {
            return Response.json({ message: "Forbidden" }, { status: 403 });
        }


        if (!payload || typeof payload !== "object" || !("id" in payload)) {
            return Response.json({ message: "Invalid token" }, { status: 401 });
        }

        const userId = (payload as { id: string }).id;


        // ✅ Handle form data
        const formData = await req.formData();
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const price = parseFloat(formData.get("price") as string);
        const file = formData.get("file") as File;

        if (!title || !description || !price || !file) {
            return Response.json({ message: "Missing fields" }, { status: 400 });
        }

        // ✅ Upload file to Supabase Storage
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

        // ✅ Save product with real sellerId
        await prisma.product.create({
            data: {
                title,
                description,
                price,
                fileUrl: publicUrl,
                sellerId: userId,
            },
        });

        return Response.json({ message: "Product uploaded!" });
    } catch (err) {
        console.error("Upload error:", err);
        return Response.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
