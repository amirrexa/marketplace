import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const payload = verifyJwt(token || "");

  if (!payload || typeof payload !== "object" || !("id" in payload) || !("role" in payload)) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const id = req.nextUrl.pathname.split("/").pop();

  if (!id) {
    return Response.json({ message: "Missing product ID" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      price: true,
      status: true,
      fileUrl: true,
      description: true,
      createdAt: true,
    },
  });

  if (!product) {
    return Response.json({ error: "Product not found" }, { status: 404 });
  }

  return Response.json({ product });
}