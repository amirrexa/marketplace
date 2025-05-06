"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ShoppingCart, User, LayoutDashboard, Shield, ShieldCheck, Store } from "lucide-react";

type LinkItem = {
    href: string;
    label: string;
    icon: React.ElementType;
};

export default function Sidebar() {
    const pathname = usePathname();
    const [links, setLinks] = useState<LinkItem[]>([]);
    const [name, setName] = useState<string>("");

    useEffect(() => {
        async function fetchProfile() {
            const res = await fetch("/api/me");
            const data = await res.json();
            if (data.user) {
                const { role, name } = data.user;

                const baseLinks: LinkItem[] = [
                    { href: "/dashboard/buyer", label: "Browse", icon: LayoutDashboard },
                    { href: "/dashboard/buyer/cart", label: "Cart", icon: ShoppingCart },
                    { href: "/dashboard/profile", label: "Profile", icon: User },
                ];

                if (role === "SELLER" || role === "ADMIN") {
                    baseLinks.unshift({
                        href: "/dashboard/seller",
                        label: "Seller Dashboard",
                        icon: Store,
                    });
                }

                if (role === "ADMIN") {
                    baseLinks.unshift({
                        href: "/dashboard/admin",
                        label: "Admin Dashboard",
                        icon: ShieldCheck,
                    });
                }

                setLinks(baseLinks);
                setName(name || "");
            }
        }

        fetchProfile();
    }, []);

    return (
        <aside className="w-64 border-r h-full p-6 bg-white">
            <h2 className="text-lg font-medium mb-6 text-muted-foreground">
                {name ? `Hello, ${name}` : "Welcome!"}
            </h2>
            <nav className="space-y-2">
                {links.map(({ href, label, icon: Icon }) => (
                    <Link
                        key={href}
                        href={href}
                        className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium",
                            pathname === href
                                ? "bg-gray-100 text-black"
                                : "hover:bg-gray-50 text-muted-foreground"
                        )}
                    >
                        <Icon className="w-4 h-4" />
                        {label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
