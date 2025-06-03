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
  status: string;
};

export default function CartPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [unavailableProducts, setUnavailableProducts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [cart] = useAtom(cartAtom);
  const removeFromCart = useSetAtom(removeFromCartAtom);
  const clearCart = useSetAtom(clearCartAtom);

  // Fetch and validate cart products
  useEffect(() => {
    const validateCart = async () => {
      setLoading(true);
      const fetchedProducts = await Promise.all(
        cart.map(async (id) => {
          try {
            const res = await fetch(`/api/products/${id}`);
            const data = await res.json();
            if (res.ok && data.product) {
              return data.product;
            }
            return null;
          } catch {
            return null;
          }
        })
      );

      const validProducts = fetchedProducts.filter(
        (p): p is Product => p && ["FOR_SALE", "ON_SALE"].includes(p.status)
      );
      const invalidIds = cart.filter(
        (id) => !fetchedProducts.find((p) => p?.id === id) || 
                fetchedProducts.find((p) => p?.id === id && !["FOR_SALE", "ON_SALE"].includes(p.status))
      );

      setProducts(validProducts);
      setUnavailableProducts(invalidIds);
      if (invalidIds.length > 0) {
        toast.error(`${invalidIds.length} item(s) in your cart are unavailable`);
      }
      setLoading(false);
    };
    validateCart();
  }, [cart]);

  const cartItems = products;
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async () => {
    if (cartItems.length === 0) return toast.error("Your cart is empty.");
    setSubmitting(true);

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productIds: cartItems.map((item) => item.id) }),
    });

    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      toast.error(data.message || "Something went wrong.");
    } else {
      toast.success(data.message || "Order submitted successfully");
      clearCart();
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>

      {loading ? (
        <p className="text-center text-muted-foreground">Loading...</p>
      ) : cartItems.length === 0 && unavailableProducts.length === 0 ? (
        <p className="text-center text-muted-foreground">Your cart is empty.</p>
      ) : (
        <>
          {unavailableProducts.length > 0 && (
            <p className="text-center text-red-500 mb-4">
              Some items are unavailable and have been removed from your cart.
            </p>
          )}
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

          {cartItems.length > 0 && (
            <div className="text-right mb-4">
              <p className="text-lg font-semibold">Total: ${totalPrice.toFixed(2)}</p>
            </div>
          )}

          <Button
            className="w-full"
            onClick={handleCheckout}
            disabled={submitting || cartItems.length === 0}
          >
            {submitting ? "Submitting..." : "Submit Order"}
          </Button>
        </>
      )}
    </main>
  );
}
