import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyJwt } from "@/lib/auth";
import NavbarClientActions from "./NavbarClientActions";

export default async function Navbar() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const payload = verifyJwt(token || "");

    if (!payload || typeof payload !== "object" || !("id" in payload)) return null;

    const user = await prisma.user.findUnique({
        where: { id: payload.id },
        select: { name: true },
    });

    return (
        <header className="flex items-center justify-between px-6 py-4 border-b bg-white dark:bg-zinc-950 dark:border-zinc-800">
            <h1 className="text-lg font-bold text-foreground max-md:hidden">Digital Marketplace</h1>
            <NavbarClientActions name={user?.name ?? "User"} />
        </header>
    );
}
