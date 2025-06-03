import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const payload = verifyJwt(token || "");
  
    if (!payload || typeof payload !== "object" || !("id" in payload) || !("role" in payload)) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }
  
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        fileUrl: true,
        createdAt: true,
        status: true,
        seller: {
          select: { name: true },
        },
      },
    });
  
    return Response.json({ products });
  }