"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

type Order = {
    id: string;
    buyer: { email: string; name?: string };
    products: { id: string; title: string; price: number; fileUrl: string }[];
    status: string;
    createdAt: string;
};

export default function SellerOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/seller/orders");
            const data = await res.json();
            if (data.orders) {
                setOrders(data.orders);
            } else {
                toast.error(data.message || "Failed to fetch orders");
            }
        } catch (error) {
            toast.error("Error fetching orders");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-6 text-center">Manage Orders</h1>

            {isLoading ? (
                <p>Loading orders...</p>
            ) : orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {orders.map((order) => (
                        <Card key={order.id} className="p-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">Order #{order.id.slice(0, 8)}</h3>
                                <Badge
                                    variant={
                                        order.status === "COMPLETED"
                                            ? "default"
                                            : order.status === "PENDING"
                                                ? "secondary"
                                                : "destructive"
                                    }
                                >
                                    {order.status}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm">
                                Buyer: {order.buyer.name || order.buyer.email}
                            </p>
                            <p className="text-muted-foreground text-sm">
                                Products: {order.products.length}
                            </p>
                            <p className="text-muted-foreground text-sm">
                                Total: $
                                {order.products
                                    .reduce((sum, p) => sum + p.price, 0)
                                    .toFixed(2)}
                            </p>
                            <Button
                                variant="secondary"
                                className="mt-2 w-full"
                                onClick={() => setSelectedOrder(order)}
                            >
                                View Details
                            </Button>
                        </Card>
                    ))}
                </section>
            )}

            {selectedOrder && (
                <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Order #{selectedOrder.id.slice(0, 8)}</DialogTitle>
                            <DialogDescription>
                                Details for order placed on{" "}
                                {new Date(selectedOrder.createdAt).toLocaleDateString()}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <p>
                                <strong>Buyer:</strong> {selectedOrder.buyer.name || selectedOrder.buyer.email}
                            </p>
                            <p>
                                <strong>Status:</strong> {selectedOrder.status}
                            </p>
                            <p>
                                <strong>Total:</strong> $
                                {selectedOrder.products
                                    .reduce((sum, p) => sum + p.price, 0)
                                    .toFixed(2)}
                            </p>
                            <h3 className="font-semibold">Products</h3>
                            <div className="space-y-2">
                                {selectedOrder.products.map((product) => (
                                    <div key={product.id} className="flex gap-4 items-center">
                                        <Image
                                            src={product.fileUrl}
                                            alt={product.title}
                                            width={80}
                                            height={80}
                                            className="rounded-md object-cover"
                                        />
                                        <div>
                                            <p className="font-medium">{product.title}</p>
                                            <p className="text-muted-foreground">${product.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </main>
    );
}