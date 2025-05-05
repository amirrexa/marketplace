import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyJwt } from "@/lib/auth";

export async function GET() {
    const token = cookies().get("token")?.value;
    const payload = verifyJwt(token || "");

    if (!payload || typeof payload !== "object" || !("id" in payload)) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: payload.id },
        select: { id: true, name: true, email: true },
    });

    return Response.json({ user });
}

export async function PATCH(req: Request) {
    const token = cookies().get("token")?.value;
    const payload = verifyJwt(token || "");

    if (!payload || typeof payload !== "object" || !("id" in payload)) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name } = await req.json();

    const user = await prisma.user.update({
        where: { id: payload.id },
        data: { name },
        select: { id: true, name: true, email: true },
    });

    return Response.json({ user });
}
