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

  const { productId, action } = await req.json();
  const userId = payload.id;

  if (action === "add") {
    if (!productId) return Response.json({ message: "Missing productId" }, { status: 400 });
    await prisma.cart.upsert({
      where: { userId },
      update: { productIds: { push: productId } },
      create: { userId, productIds: [productId] },
    });
  } else if (action === "remove") {
    if (!productId) return Response.json({ message: "Missing productId" }, { status: 400 });
    await prisma.cart.update({
      where: { userId },
      data: { productIds: { set: (await prisma.cart.findUnique({ where: { userId } }))?.productIds.filter(id => id !== productId) || [] } },
    });
  } else if (action === "clear") {
    await prisma.cart.update({
      where: { userId },
      data: { productIds: { set: [] } },
    });
  } else {
    return Response.json({ message: "Invalid action" }, { status: 400 });
  }

  return Response.json({ message: "Cart updated" });
}