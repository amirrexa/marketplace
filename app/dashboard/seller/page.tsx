"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import EditProductModal from "@/components/dashboard/EditProductModal";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import DeleteProductModal from "@/components/dashboard/DeleteProductModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Product = {
    id: string;
    title: string;
    description: string;
    price: number;
    fileUrl: string;
    status: string;
};

export default function SellerDashboardPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [status, setStatus] = useState("FOR_SALE");
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);



    const fetchProducts = async () => {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data.products || []);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return alert("Please select an image.");

        setIsLoading(true);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("status", status);
        formData.append("file", file);

        const res = await fetch("/api/products", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        setIsLoading(false);
        toast.success(data.message || "Product uploaded successfully");
        fetchProducts(); // refresh list
    };

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-6 text-center">Seller Dashboard</h1>

            <Card className="shadow-md p-6 space-y-6 mb-10">
                <CardContent className="space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label>Product Title</Label>
                            <Input
                                placeholder="e.g. UI Kit"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Textarea
                                placeholder="Describe your product"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Price (USD)</Label>
                            <Input
                                type="number"
                                placeholder="9.99"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Status</Label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="FOR_SALE">For Sale</SelectItem>
                                    <SelectItem value="ON_SALE">On Sale</SelectItem>
                                    <SelectItem value="NOT_AVAILABLE">Not Available</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Product Image</Label>
                            <Input
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Uploading..." : "Upload Product"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                    <Card key={product.id} className="p-4">
                        <Image
                            width={500}
                            height={400}
                            src={product.fileUrl}
                            alt={product.title}
                            className="rounded-md mb-3 object-cover w-full h-40"
                        />
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">{product.title}</h3>
                            <Badge variant={product.status === "ON_SALE" ? "default" : product.status === "FOR_SALE" ? "secondary" : product.status === "NOT_AVAILABLE" ? "destructive" : 'default'}>{product.status}</Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">${product.price.toFixed(2)}</p>
                        <div className="flex justify-between items-center">
                            <Button
                                variant="secondary"
                                className="mt-2"
                                onClick={() => {
                                    setSelectedProduct(product);
                                    setEditOpen(true);
                                }}
                            >
                                Edit
                            </Button>

                            <Button
                                variant="destructive"
                                className="mt-3"
                                onClick={() => {
                                    setSelectedProduct(product)
                                    setDeleteOpen(true)
                                }}
                            >
                                Delete
                            </Button>
                        </div>

                    </Card>
                ))}
            </section>
            {selectedProduct && (
                <>
                    <DeleteProductModal
                        open={!!selectedProduct && deleteOpen}
                        onClose={() => setSelectedProduct(null)}
                        onConfirm={async () => {
                            const res = await fetch(`/api/products/${selectedProduct.id}`, {
                                method: "DELETE",
                            });

                            if (res.ok) {
                                toast.success("Product deleted");
                                fetchProducts(); // Re-fetch updated list
                            } else {
                                toast.error("Failed to delete product");
                            }
                        }}
                        productTitle={selectedProduct?.title}
                    />
                    <EditProductModal
                        open={editOpen}
                        onClose={() => setEditOpen(false)}
                        product={selectedProduct}
                        onUpdated={fetchProducts}
                    />
                </>
            )}

        </main>
    );
}
