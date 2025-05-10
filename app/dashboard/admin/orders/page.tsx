"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { format } from "date-fns";
import DeleteOrderModal from "@/components/dashboard/DeleteOrderModal";

type OrderStatus = "PENDING" | "COMPLETED" | "CANCELED";

type GroupedOrder = {
    id: string;
    createdAt: string;
    status: OrderStatus;
    buyer: {
        name: string | null;
        email: string;
    };
    products: {
        id: string;
        title: string;
        price: number;
        fileUrl: string;
    }[];
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<GroupedOrder[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<GroupedOrder | null>(null);
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false)
    const [editOpen, setEditOpen] = useState<boolean>(false)
    const [newStatus, setNewStatus] = useState<OrderStatus | "">("");
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch("/api/admin/orders");
                const data = await res.json();
                if (Array.isArray(data.orders)) {
                    setOrders(data.orders);
                } else {
                    toast.error("Unexpected response format");
                }

            } catch {
                toast.error("Server error");
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const filteredOrders = orders?.filter((order) => {
        const keyword = search.toLowerCase();
        return (
            order.buyer.name?.toLowerCase().includes(keyword) ||
            order.buyer.email.toLowerCase().includes(keyword) ||
            order.products.some((p) => p.title.toLowerCase().includes(keyword))
        );
    });

    const paginated = filteredOrders.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handleStatusUpdate = async () => {
        if (!selectedOrder || !newStatus) return;

        setIsUpdating(true)
        try {
            const res = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) throw new Error();

            toast.success("Order status updated");
            setOrders((prev) =>
                prev.map((o) =>
                    o.id === selectedOrder.id ? { ...o, status: newStatus } : o
                )
            );
            setSelectedOrder(null);
        } catch {
            toast.error("Failed to update order status");
        } finally {
            setIsUpdating(false)
        }
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/admin/orders/${selectedOrder?.id}`, { method: "DELETE" });
            if (!res.ok) throw new Error();
            toast.success("Order deleted");
            setOrders((prev) => prev.filter((o) => o.id !== selectedOrder?.id));
        } catch {
            toast.error("Delete failed");
        }
    };

    return (
        <main className="max-w-6xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-6">Orders Overview</h1>

            <Input
                placeholder="Search by buyer or product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-4 max-w-md"
            />

            <Card className="p-4">
                {isLoading ? (
                    <Skeleton className="h-8 w-1/2" />
                ) : paginated.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No orders found.</p>
                ) : (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Buyer</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Products</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginated.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell>{order.buyer.name || "-"}</TableCell>
                                        <TableCell>{order.buyer.email}</TableCell>
                                        <TableCell>{order.products.length}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{order.status}</Badge>
                                        </TableCell>
                                        <TableCell>{format(new Date(order.createdAt), "yyyy-MM-dd")}</TableCell>
                                        <TableCell className="space-x-2">
                                            <Button
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedOrder(order);
                                                    setEditOpen(true)
                                                    setNewStatus(order.status);
                                                }}
                                            >
                                                View
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => {
                                                    setSelectedOrder(order)
                                                    setDeleteOpen(true)
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {filteredOrders.length > pageSize && (
                            <Pagination className="mt-6">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                            aria-disabled={currentPage === 1}
                                        />
                                    </PaginationItem>
                                    <PaginationItem>
                                        Page {currentPage} of {Math.ceil(filteredOrders.length / pageSize)}
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() =>
                                                setCurrentPage((p) =>
                                                    Math.min(p + 1, Math.ceil(filteredOrders.length / pageSize))
                                                )
                                            }
                                            aria-disabled={currentPage === Math.ceil(filteredOrders.length / pageSize)}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        )}
                    </>
                )}
            </Card>

            {selectedOrder &&
                <DeleteOrderModal
                    open={deleteOpen}
                    orderTitle={selectedOrder.buyer.name ?? ""}
                    onClose={() => {
                        setSelectedOrder(null)
                        setDeleteOpen(false)
                    }}
                    onConfirm={handleDelete}
                />
            }

            {
                selectedOrder && (
                    <Dialog open={editOpen} onOpenChange={() => {
                        setSelectedOrder(null);
                        setEditOpen(false);
                    }}>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Order Details</DialogTitle>
                            </DialogHeader>

                            <div className="mb-4 text-sm">
                                <p>
                                    <strong>Buyer:</strong> {selectedOrder.buyer.name} ({selectedOrder.buyer.email})
                                </p>
                                <p>
                                    <strong>Date:</strong>{" "}
                                    {format(new Date(selectedOrder.createdAt), "yyyy-MM-dd")}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {selectedOrder.products.map((p) => (
                                    <Card key={p.id} className="p-2 flex items-center gap-4">
                                        <Image
                                            src={p.fileUrl}
                                            alt={p.title}
                                            width={60}
                                            height={60}
                                            className="rounded-md object-cover"
                                        />
                                        <div>
                                            <p className="font-medium">{p.title}</p>
                                            <p className="text-muted-foreground text-sm">${p.price.toFixed(2)}</p>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            <div className="mt-4">

                            </div>

                            <DialogFooter className="flex justify-between items-center">
                                <Select value={newStatus} onValueChange={(val) => setNewStatus(val as OrderStatus)}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Change status..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PENDING">Pending</SelectItem>
                                        <SelectItem value="COMPLETED">Completed</SelectItem>
                                        <SelectItem value="CANCELED">Canceled</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button onClick={handleStatusUpdate} disabled={isUpdating}>{!isUpdating ? "Update Status" : "Updating..."}</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )
            }
        </main >
    );
}
