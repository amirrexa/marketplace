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
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { format } from "date-fns";

interface User {
    id: string;
    email: string;
    name?: string;
    role: string;
    createdAt: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRole, setSelectedRole] = useState("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

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

    useEffect(() => {
        const lowerSearch = searchTerm.toLowerCase();
        const filtered = users.filter((user) => {
            const matchesName = user.name?.toLowerCase().includes(lowerSearch);
            const matchesEmail = user.email.toLowerCase().includes(lowerSearch);
            const matchesRole = selectedRole === "ALL" || user.role === selectedRole;
            return (matchesName || matchesEmail) && matchesRole;
        });
        setFilteredUsers(filtered);
    }, [users, searchTerm, selectedRole]);

    const handleRoleChange = async (id: string, newRole: string) => {
        try {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: newRole }),
            });

            if (!res.ok) throw new Error("Failed to update role");

            toast.success("Role updated");
            setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
        } catch {
            toast.error("Could not update role");
        }
    };

    const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const totalPages = Math.ceil(filteredUsers.length / pageSize);

    return (
        <main className="max-w-6xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-6">Users Overview</h1>

            <div className="flex items-center justify-between mb-4 gap-4">
                <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-sm"
                />
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Roles</SelectItem>
                        <SelectItem value="BUYER">Buyer</SelectItem>
                        <SelectItem value="SELLER">Seller</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Card className="p-6">
                {isLoading ? (
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center space-x-4">
                                <Skeleton className="h-4 w-1/3" />
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-4 w-1/5" />
                            </div>
                        ))}
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No users found.</p>
                ) : (
                    <>
                        <p className="text-muted-foreground text-sm mb-2">
                            Showing {paginatedUsers.length} of {filteredUsers.length} user(s)
                        </p>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Joined</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.name || "-"}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Select
                                                value={user.role}
                                                onValueChange={(val) => {
                                                    if (val !== user.role) handleRoleChange(user.id, val);
                                                }}
                                                disabled={isLoading}
                                            >
                                                <SelectTrigger className="w-[120px]">
                                                    <SelectValue placeholder="Select role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="BUYER">Buyer</SelectItem>
                                                    <SelectItem value="SELLER">Seller</SelectItem>
                                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>

                                        <TableCell>
                                            {format(new Date(user.createdAt), "yyyy-MM-dd")}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {totalPages > 1 && (
                            <Pagination className="mt-6">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                            aria-disabled={currentPage === 1}
                                        />
                                    </PaginationItem>
                                    <PaginationItem>
                                        Page {currentPage} of {totalPages}
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                            aria-disabled={currentPage === totalPages}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        )}
                    </>
                )}
            </Card>
        </main>
    );
}
