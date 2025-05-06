"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

type User = {
    id: string;
    email: string;
    role: string;
    createdAt: string;
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("/api/admin/users");
                const data = await res.json();

                if (res.ok) {
                    setUsers(data.users);
                } else {
                    toast.error(data.message || "Failed to fetch users");
                }
            } catch {
                toast.error("Server error");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <main className="max-w-5xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-6">All Users</h1>

            <Card className="p-6">
                {isLoading ? (
                    <p>Loading...</p>
                ) : users.length === 0 ? (
                    <p>No users found.</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Joined</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Card>
        </main>
    );
}
