"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAtom, useSetAtom } from "jotai";
import { cartAtom, addToCartAtom, removeFromCartAtom } from "@/lib/atoms/cart";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  fileUrl: string;
  status: string;
  seller: { name: string | null };
};

export default function BuyerDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart] = useAtom(cartAtom);
  const addToCart = useSetAtom(addToCartAtom);
  const removeFromCart = useSetAtom(removeFromCartAtom);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        const availableProducts = (data.products || []).filter(
          (p: Product) => ["FOR_SALE", "ON_SALE"].includes(p.status)
        );
        setProducts(availableProducts);
      } catch {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-8 text-center">Browse Products</h1>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-muted-foreground text-lg">No products available.</p>
      ) : (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const isInCart = cart.includes(product.id);
            const isOnSale = product.status === "ON_SALE";

            return (
              <Card
                key={product.id}
                className={`p-4 flex flex-col justify-between transition-all duration-300 hover:scale-101 hover:shadow-lg ${
                  isOnSale ? "bg-green-50 dark:bg-green-900/20" : ""
                }`}
              >
                <div>
                  <div className="relative">
                    <Image
                      width={500}
                      height={400}
                      src={product.fileUrl}
                      alt={product.title}
                      className="rounded-md mb-3 object-cover w-full h-48"
                    />
                    {isOnSale ?
                    <Badge
                    className={`absolute top-2 right-2 ${
                      isOnSale
                      ? "bg-green-500 animate-pulse"
                      : "bg-red-500"
                      } text-white`}
                      >
                      {isOnSale ? "On Sale" : "For Sale"}
                    </Badge>
                    : null}
                  </div>
                  <h3 className="text-xl font-semibold">{product.title}</h3>
                  <p
                    className="text-sm text-muted-foreground line-clamp-1 cursor-pointer hover:underline"
                    onClick={() => setSelectedProduct(product)}
                  >
                    {product.description}
                  </p>
                  <p className="text-lg font-medium mt-1">
                    ${product.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Sold by: {product.seller.name || "Unknown"}
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
      )}

      {selectedProduct && (
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedProduct.title}</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {selectedProduct.description}
            </p>
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}