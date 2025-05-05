import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";

const links = [
    { href: "/dashboard/buyer", label: "Browse" },
    { href: "/dashboard/buyer/cart", label: "Cart" },
    { href: "/dashboard/profile", label: "Profile" },
];

export default async function Sidebar() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const payload = verifyJwt(token || "");
    if (!payload || typeof payload !== "object" || !("id" in payload)) {
        return redirect("/login"); // fallback just in case
    }

    const user = await prisma.user.findUnique({
        where: { id: payload.id },
        select: { name: true },
    });

    return (
        <aside className="w-64 border-r h-full p-6 bg-white">
            <h2 className="text-xl font-bold mb-6">
                👋 {user?.name ? `Hello, ${user.name}` : "Welcome!"}
            </h2>
            <nav className="space-y-2">
                {links.map(({ href, label }) => (
                    <Link
                        key={href}
                        href={href}
                        className={cn(
                            "block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100",
                            href === "/" && "font-semibold"
                        )}
                    >
                        {label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
