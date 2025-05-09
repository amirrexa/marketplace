"use client";

import { useRouter } from "next/navigation";
import { LogOut, UserCircle, Sun, Moon, ShoppingCart } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import MobileMenu from "./MobileMenu";
import { useAtom } from "jotai";
import { cartAtom } from "@/lib/atoms/cart";
import { Badge } from "../ui/badge";

export default function NavbarClientActions({ name }: { name?: string }) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const [cart] = useAtom(cartAtom);

    const handleLogout = async () => {
        await fetch("/api/logout", { method: "POST" });
        setOpen(false);
        router.push("/login");
    };

    return (
        <div className="flex items-center gap-4">
            <div className="md:hidden">
                <MobileMenu />
            </div>

            <span className="text-sm text-muted-foreground">{name}</span>

            <Link href="/dashboard/buyer/cart" className="relative">
                <ShoppingCart className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                {cart.length > 0 && (
                    <Badge
                        className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs"
                        variant="secondary"
                    >
                        {cart.length}
                    </Badge>
                )}
            </Link>

            <Link href="/dashboard/profile">
                <UserCircle className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            </Link>

            <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? <Sun className="w-5 h-5 text-muted-foreground hover:text-foreground" /> : <Moon className="w-5 h-5 text-muted-foreground hover:text-foreground" />}
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant={"ghost"} size={"icon"}>
                        <LogOut className="w-5 h-5 text-red-500 hover:text-red-700" />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Log out?</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to log out?</p>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleLogout}>
                            Log out
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
