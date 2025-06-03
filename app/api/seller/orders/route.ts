import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const payload = verifyJwt(token);
  if (!payload || typeof payload !== "object" || !("id" in payload) || !("role" in payload)) {
    return Response.json({ message: "Invalid token" }, { status: 401 });
  }

  if (payload.role !== "SELLER") {
    return Response.json({ message: "Forbidden" }, { status: 403 });
  }

  const sellerId = payload.id;
  const orders = await prisma.order.findMany({
    where: { products: { some: { sellerId } } },
    include: {
      buyer: { select: { name: true, email: true } },
      products: {
        where: { sellerId },
        select: { id: true, title: true, price: true, fileUrl: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ orders });
}