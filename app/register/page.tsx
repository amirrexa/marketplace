"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        setIsLoading(false);

        try {
            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Registration failed");
                return;
            }

            toast.success(data.message || "Registered successfully!");

            // ✅ Optional short delay before redirect
            setTimeout(() => {
                router.push("/login");
            }, 800);
        } catch {
            toast.error("Registration response error");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm bg-white p-6 rounded-xl shadow space-y-4"
            >
                <h2 className="text-xl font-semibold">Register</h2>
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
                    {isLoading ? "Creating..." : "Create Account"}
                </Button>
            </form>
        </div>
    );
}
