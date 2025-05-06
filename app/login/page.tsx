"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        setIsLoading(false);

        if (!res.ok) {
            const errorText = await res.text();
            toast.error("Login failed: " + errorText);
            return;
        }

        try {
            const data = await res.json();
            toast.success(data.message || "Logged in!");

            // ✅ Get user role from /api/me
            const meRes = await fetch("/api/me");
            const meData = await meRes.json();

            if (!meData.user) {
                toast.error("Login succeeded, but failed to fetch user info.");
                return;
            }

            const role = meData.user.role;

            switch (role) {
                case "SELLER":
                    router.push("/dashboard/seller");
                    break;
                case "ADMIN":
                    router.push("/dashboard/admin");
                    break;
                default:
                    router.push("/dashboard/buyer");
                    break;
            }
        } catch {
            toast.error("Login succeeded, but response was invalid.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <form
                onSubmit={handleLogin}
                className="w-full max-w-sm bg-white p-6 rounded-xl shadow space-y-4"
            >
                <h2 className="text-xl font-semibold">Login</h2>
                <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                </Button>
            </form>
        </div>
    );
}
