"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetClose,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Menu } from "lucide-react";
import { navItemsByRole, type NavItem } from "@/lib/navItems";

export default function Sidebar() {
    const pathname = usePathname();
    const [name, setName] = useState<string>("");
    const [role, setRole] = useState<"BUYER" | "SELLER" | "ADMIN" | "">("");
    const [isMounted, setIsMounted] = useState(false);

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
        setIsMounted(true);
    }, []);

    const renderLink = (item: NavItem) => (
        <Link
            key={item.href}
            href={item.href}
            className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium",
                pathname === item.href
                    ? "bg-muted text-foreground"
                    : "hover:bg-muted/60 text-muted-foreground"
            )}
        >
            <item.icon className="w-4 h-4" />
            {item.label}
        </Link>
    );

    if (!isMounted || !role) return null;

    const allItems =
        role === "ADMIN"
            ? [...navItemsByRole.ADMIN, ...navItemsByRole.SELLER, ...navItemsByRole.BUYER]
            : role === "SELLER"
                ? [...navItemsByRole.SELLER, ...navItemsByRole.BUYER]
                : role === "BUYER"
                    ? [...navItemsByRole.BUYER]
                    : [];


    return (
        <aside className="hidden md:block w-64 border-r h-full p-6 bg-white dark:bg-zinc-950">
            <h2 className="text-lg font-medium mb-6 text-muted-foreground">
                {name ? `Hello, ${name}` : "Welcome!"}
            </h2>
            <nav className="space-y-2">
                {allItems.map((item) =>
                    "children" in item ? (
                        <Accordion key={item.label} type="single" collapsible>
                            <AccordionItem value={item.label}>
                                <AccordionTrigger className="px-3 py-2 rounded-md hover:bg-muted/50 text-sm font-medium">
                                    <div className="flex items-center gap-2">
                                        {item.children[0]?.icon && (
                                            (() => {
                                                const Icon = item.children[0].icon;
                                                return <Icon className="w-4 h-4" />;
                                            })()
                                        )}
                                        {item.label}
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="ml-4 mt-1 space-y-1">
                                    {item.children.map(renderLink)}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    ) : (
                        renderLink(item)
                    )
                )}
            </nav>
        </aside>
    );
}
