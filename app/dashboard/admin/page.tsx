"use client";

import { useEffect, useState } from "react";

export default function AdminDashboardPage() {
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        fetch("/api/admin/users")
            .then((res) => res.json())
            .then((data) => setUsers(data.users || []));
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">👑 Admin Dashboard</h1>
            <ul className="space-y-2">
                {users.map((user) => (
                    <li key={user.id} className="border p-2 rounded">
                        <strong>{user.email}</strong> — <span>{user.role}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
