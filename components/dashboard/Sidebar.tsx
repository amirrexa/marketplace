"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
    { href: "/dashboard/buyer", label: "Browse" },
    { href: "/dashboard/buyer/cart", label: "Cart" },
    { href: "/dashboard/profile", label: "Profile" },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 border-r h-full p-6 bg-white">
            <h2 className="text-xl font-bold mb-6">🛍 Marketplace</h2>
            <nav className="space-y-2">
                {links.map(({ href, label }) => (
                    <Link
                        key={href}
                        href={href}
                        className={cn(
                            "block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100",
                            pathname === href && "bg-gray-100 font-semibold"
                        )}
                    >
                        {label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
