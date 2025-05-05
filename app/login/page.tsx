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

            // ✅ Decode token from cookie if available
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="))
                ?.split("=")[1];

            if (token) {
                const payload = JSON.parse(atob(token.split(".")[1]));
                const role = payload.role;

                // ✅ Redirect based on user role
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
            } else {
                router.push("/dashboard/buyer"); // fallback
            }
        } catch {
            toast.success("Login worked, but couldn't read role.");
            router.push("/dashboard/buyer");
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
