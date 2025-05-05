"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ProfilePage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            const res = await fetch("/api/profile");
            const data = await res.json();
            setName(data.user.name || "");
            setEmail(data.user.email || "");
            setLoading(false);
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        const res = await fetch("/api/profile", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        });
        const data = await res.json();
        setSaving(false);
        if (res.ok) {
            toast.success("Profile updated");
        } else {
            toast.error(data.message || "Error saving profile");
        }
    };

    return (
        <main className="max-w-xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-bold mb-6 text-center">👤 Profile</h1>

            {loading ? (
                <p className="text-muted-foreground text-sm text-center">Loading...</p>
            ) : (
                <div className="space-y-4">
                    <div>
                        <Label>Name</Label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                        <Label>Email</Label>
                        <Input value={email} readOnly className="bg-muted cursor-not-allowed" />
                    </div>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : "Save"}
                    </Button>
                </div>
            )}
        </main>
    );
}
