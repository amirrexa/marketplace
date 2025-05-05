import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";

export async function POST(req: Request) {
    const { email, password } = await req.json();

    if (!email || !password) {
        return Response.json({ message: "Missing fields" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
        return Response.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await hash(password, 10);

    await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
        },
    });

    return Response.json({ message: "Account created ✅" });
}
