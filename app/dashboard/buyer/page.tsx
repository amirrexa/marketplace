"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAtom, useSetAtom } from "jotai";
import { cartAtom, addToCartAtom, removeFromCartAtom } from "@/lib/atoms/cart";
import Image from "next/image";


type Product = {
    id: string;
    title: string;
    description: string;
    price: number;
    fileUrl: string;
};

export default function BuyerDashboardPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart] = useAtom(cartAtom);
    const addToCart = useSetAtom(addToCartAtom);
    const removeFromCart = useSetAtom(removeFromCartAtom);



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
            <h1 className="text-3xl font-bold mb-6 text-center">Browse Products</h1>

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => {
                    const isInCart = cart.includes(product.id);

                    return (
                        <Card key={product.id} className="p-4 flex flex-col justify-between">
                            <div className="relative">
                                <Image
                                    width={500}
                                    height={400}
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
                                variant={isInCart ? "secondary" : "default"}
                                onClick={() => {
                                    if (isInCart) {
                                        removeFromCart(product.id);
                                        toast.info("Removed from cart");
                                    } else {
                                        addToCart(product.id);
                                        toast.success("Added to cart");
                                    }
                                }}
                            >
                                {isInCart ? "In Cart" : "Add to Cart"}
                            </Button>
                        </Card>
                    );
                })}

            </section>
        </main>
    );
}
