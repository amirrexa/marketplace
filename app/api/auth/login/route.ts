// app/api/auth/login/route.ts

import { prisma } from "@/lib/prisma";
import { compare } from "bcrypt";
import { signJwt } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true,
                role: true,
            },
        });

        if (!user || !(await compare(password, user.password))) {
            return Response.json({ message: "Invalid credentials" }, { status: 401 });
        }

        const token = signJwt({
            id: user.id,
            email: user.email,
            role: user.role,
        });

        // ✅ MUST AWAIT in new Next.js
        const cookieStore = await cookies();
        cookieStore.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return Response.json({ message: "Login successful" });
    } catch (error) {
        console.error("Login error:", error);
        return Response.json({ message: "Server error" }, { status: 500 });
    }
}
