import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = (await cookieStore).get("token")?.value;

  if (!token) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const payload = verifyJwt(token);
  if (!payload || typeof payload !== "object" || !("id" in payload)) {
    return Response.json({ message: "Invalid token" }, { status: 401 });
  }

  const { productIds } = await req.json();

  if (!Array.isArray(productIds) || productIds.length === 0) {
    return Response.json({ message: "Missing or invalid productIds" }, { status: 400 });
  }

  // Check product availability
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, status: { in: ["FOR_SALE", "ON_SALE"] } },
    select: { id: true },
  });
  if (products.length !== productIds.length) {
    return Response.json({ message: "Some products are unavailable" }, { status: 400 });
  }

  // Check for recent duplicate order (last 5 minutes)
  const recentOrder = await prisma.order.findFirst({
    where: {
      buyerId: payload.id,
      createdAt: { gte: new Date(Date.now() - 5 * 60 * 1000) },
      products: { every: { id: { in: productIds } } },
    },
  });
  if (recentOrder) {
    return Response.json({ message: "Duplicate order detected" }, { status: 409 });
  }

  await prisma.order.create({
    data: {
      buyerId: payload.id,
      products: {
        connect: productIds.map((id: string) => ({ id })),
      },
    },
  });

  return Response.json({ message: `Requested ${productIds.length} product(s) successfully` });
}