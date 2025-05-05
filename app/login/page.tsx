"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        // Only try to parse JSON if we got something useful
        if (!res.ok) {
            alert("Login failed: " + res.status);
            return;
        }

        try {
            const data = await res.json();
            alert(data.message || "Logged in!");
        } catch (err) {
            alert("Login worked, but response had no JSON.");
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
                <Button type="submit" className="w-full">
                    Sign In
                </Button>
            </form>
        </div>
    );
}
