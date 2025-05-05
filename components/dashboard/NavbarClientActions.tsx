"use client";

import { useRouter } from "next/navigation";
import { LogOut, UserCircle } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function NavbarClientActions({ name }: { name?: string }) {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const handleLogout = async () => {
        await fetch("/api/logout", { method: "POST" });
        setOpen(false);
        router.push("/login");
    };

    return (
        <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{name || "User"}</span>
            <Link href="/dashboard/profile">
                <UserCircle className="w-5 h-5 hover:text-black" />
            </Link>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <button>
                        <LogOut className="w-5 h-5 text-red-500 hover:text-red-700" />
                    </button>
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
