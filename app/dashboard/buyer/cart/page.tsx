"use client";

import { useEffect, useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import {
    cartAtom,
    removeFromCartAtom,
    clearCartAtom,
} from "@/lib/atoms/cart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";

type Product = {
    id: string;
    title: string;
    description: string;
    price: number;
    fileUrl: string;
};

export default function CartPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [cart] = useAtom(cartAtom);
    const removeFromCart = useSetAtom(removeFromCartAtom);
    const clearCart = useSetAtom(clearCartAtom);

    // Fetch all products, then filter those in cart
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const res = await fetch("/api/products");
            const data = await res.json();
            setProducts(data.products || []);
            setLoading(false);
        };
        fetchProducts();
    }, []);

    const cartItems = products.filter((p) => cart.includes(p.id));

    const handleCheckout = async () => {
        if (cartItems.length === 0) return toast.error("Your cart is empty.");
        setSubmitting(true);

        const failed: string[] = [];

        for (const item of cartItems) {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: item.id }),
            });

            if (!res.ok) failed.push(item.title);
        }

        setSubmitting(false);

        if (failed.length > 0) {
            toast.error(`Some failed: ${failed.join(", ")}`);
        } else {
            toast.success("All products requested ✅");
            clearCart();
        }
    };

    return (
        <main className="max-w-5xl mx-auto px-4 py-10">

            {loading ? (
                <p className="text-center text-muted-foreground">Loading...</p>
            ) : cartItems.length === 0 ? (
                <p className="text-center text-muted-foreground">Your cart is empty.</p>
            ) : (
                <>
                    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
                        {cartItems.map((product) => (
                            <Card key={product.id} className="p-4 flex flex-col justify-between">
                                <div>
                                    <Image
                                        width={500}
                                        height={400}
                                        src={product.fileUrl}
                                        alt={product.title}
                                        className="rounded-md mb-3 object-cover w-full h-40"
                                    />
                                    <h3 className="text-lg font-semibold">{product.title}</h3>
                                    <p className="text-muted-foreground text-sm">${product.price.toFixed(2)}</p>
                                </div>
                                <Button
                                    className="mt-4"
                                    variant="destructive"
                                    onClick={() => removeFromCart(product.id)}
                                >
                                    Remove
                                </Button>
                            </Card>
                        ))}
                    </section>

                    <Button
                        className="w-full"
                        onClick={handleCheckout}
                        disabled={submitting}
                    >
                        {submitting ? "Submitting..." : "Submit All Requests"}
                    </Button>
                </>
            )}
        </main>
    );
}
