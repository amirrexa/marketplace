"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
    ShoppingCart,
    User,
    LayoutDashboard,
    ShieldCheck,
    Store,
    Users,
    Package,
    Receipt,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Sidebar() {
    const pathname = usePathname();
    const [name, setName] = useState<string>("");
    const [role, setRole] = useState<string>("");

    useEffect(() => {
        async function fetchProfile() {
            const res = await fetch("/api/me");
            const data = await res.json();

            if (data.user) {
                setName(data.user.name || "");
                setRole(data.user.role);
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
                {/* Admin Section */}
                {role === "ADMIN" && (
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="admin">
                            <AccordionTrigger className="px-3 py-2 text-sm font-medium hover:bg-gray-100 rounded-md">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4" />
                                    Admin
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="ml-6 mt-1 space-y-1">
                                <SidebarLink href="/dashboard/admin/users" label="Users" icon={Users} pathname={pathname} />
                                <SidebarLink href="/dashboard/admin/products" label="Products" icon={Package} pathname={pathname} />
                                <SidebarLink href="/dashboard/admin/orders" label="Orders" icon={Receipt} pathname={pathname} />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                )}

                {/* Seller Link */}
                {(role === "SELLER" || role === "ADMIN") && (
                    <SidebarLink href="/dashboard/seller" label="Seller Dashboard" icon={Store} pathname={pathname} />
                )}

                {/* Buyer Links */}
                <SidebarLink href="/dashboard/buyer" label="Browse" icon={LayoutDashboard} pathname={pathname} />
                <SidebarLink href="/dashboard/buyer/cart" label="Cart" icon={ShoppingCart} pathname={pathname} />
                <SidebarLink href="/dashboard/profile" label="Profile" icon={User} pathname={pathname} />
            </nav>
        </aside>
    );
}

type SidebarLinkProps = {
    href: string;
    label: string;
    icon: React.ElementType;
    pathname: string;
};

function SidebarLink({ href, label, icon: Icon, pathname }: SidebarLinkProps) {
    return (
        <Link
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
    );
}
