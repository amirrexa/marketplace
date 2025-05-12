"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/components/ui/passwordInput";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            setIsLoading(false);

            if (!res.ok) {
                toast.error(data.message || "Registration failed");
                return;
            }

            toast.success(data.message || "Account created!");

            setTimeout(() => {
                router.push("/login");
            }, 500);
        } catch {
            setIsLoading(false);
            toast.error("Server error. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground transition-colors">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm bg-card text-foreground p-6 rounded-xl shadow space-y-4 border border-border"
            >
                <h2 className="text-xl text-muted-foreground font-semibold">Register</h2>
                <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <PasswordInput
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
