"use client";

import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { navItemsByRole, type NavItem } from "@/lib/navItems";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function MobileMenu() {
    const [open, setOpen] = useState(false);
    const [role, setRole] = useState<"BUYER" | "SELLER" | "ADMIN" | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        async function fetchProfile() {
            const res = await fetch("/api/me");
            const data = await res.json();
            if (data.user?.role) {
                setRole(data.user.role);
            }
        }
        fetchProfile();
    }, []);

    const allItems =
        role
            ? [
                ...(navItemsByRole[role === "ADMIN" ? "ADMIN" : role] ?? []),
                ...(role === "ADMIN" || role === "SELLER" ? navItemsByRole.SELLER : []),
                ...navItemsByRole.BUYER,
            ]
            : [];


    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-4">
                <SheetHeader className="text-lg font-bold mb-4">
                    Menu
                </SheetHeader>
                <nav className="space-y-1">
                    {allItems.map((item) =>
                        "children" in item ? (
                            <div key={item.label}>
                                <p className="text-muted-foreground text-sm font-semibold mt-3 mb-1">{item.label}</p>
                                <div className="space-y-1 ml-3">
                                    {item.children.map((child) => (
                                        <Link
                                            key={child.href}
                                            href={child.href}
                                            onClick={() => setOpen(false)}
                                            className={cn(
                                                "block text-sm px-2 py-1 rounded-md",
                                                pathname === child.href
                                                    ? "bg-muted text-foreground"
                                                    : "hover:bg-muted/50 text-muted-foreground"
                                            )}
                                        >
                                            {child.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "block text-sm px-2 py-1 rounded-md",
                                    pathname === item.href
                                        ? "bg-muted text-foreground"
                                        : "hover:bg-muted/50 text-muted-foreground"
                                )}
                            >
                                {item.label}
                            </Link>
                        )
                    )}
                </nav>
            </SheetContent>
        </Sheet>
    );
}
