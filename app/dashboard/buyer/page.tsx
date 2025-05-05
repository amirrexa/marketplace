"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Product = {
    id: string;
    title: string;
    description: string;
    price: number;
    fileUrl: string;
};

export default function BuyerDashboardPage() {
    const [products, setProducts] = useState<Product[]>([]);

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
                            onClick={async () => {
                                const res = await fetch("/api/orders", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({ productId: product.id }),
                                });

                                const data = await res.json();

                                if (res.ok) {
                                    toast.success("Request submitted ✅");
                                } else {
                                    toast.error(data.message || "Request failed");
                                }
                            }}
                        >
                            Request Product
                        </Button>


                    </Card>
                ))}
            </section>
        </main>
    );
}
