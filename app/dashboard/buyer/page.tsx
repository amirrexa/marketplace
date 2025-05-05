"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ConfirmRequestModal } from "@/components/dashboard/ConfirmRequestModal";

type Product = {
    id: string;
    title: string;
    description: string;
    price: number;
    fileUrl: string;
};

export default function BuyerDashboardPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

    const handleRequestProduct = async () => {
        if (!selectedProductId) return;
        setIsLoading(true);

        const res = await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: selectedProductId }),
        });

        const data = await res.json();
        setIsLoading(false);
        setConfirmOpen(false);
        setSelectedProductId(null);

        if (res.ok) {
            toast.success("Product requested successfully");
        } else {
            toast.error(data.message || "Request failed");
        }
    };


    useEffect(() => {
        const fetchProducts = async () => {
            const res = await fetch("/api/products");
            const data = await res.json();
            setProducts(data.products || []);
        };

        fetchProducts();
    }, []);

    return (
        <main className="max-w-5xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-6 text-center">🛍 Browse Products</h1>

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                    <Card key={product.id} className="p-4 flex flex-col justify-between">
                        <div>
                            <img
                                src={product.fileUrl}
                                alt={product.title}
                                className="rounded-md mb-3 object-cover w-full h-40"
                            />
                            <h3 className="text-lg font-semibold">{product.title}</h3>
                            <p className="text-muted-foreground text-sm">
                                ${product.price.toFixed(2)}
                            </p>
                        </div>
                        <Button
                            className="mt-4"
                            onClick={() => {
                                setSelectedProductId(product.id);
                                setConfirmOpen(true);
                            }}
                            disabled={isLoading}
                        >
                            {isLoading && selectedProductId === product.id ? "Requesting..." : "Request Product"}
                        </Button>

                    </Card>
                ))}
            </section>
            <ConfirmRequestModal
                open={confirmOpen}
                onCancel={() => {
                    setConfirmOpen(false);
                    setSelectedProductId(null);
                }}
                onConfirm={handleRequestProduct}
            />

        </main>
    );
}
