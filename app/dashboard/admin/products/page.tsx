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
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { format } from "date-fns";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import DeleteProductModal from "@/components/dashboard/DeleteProductModal";

interface Product {
    id: string;
    title: string;
    price: number;
    fileUrl: string;
    createdAt: string;
    seller: {
        name: string | null;
        email: string;
    };
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const pageSize = 10;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("/api/admin/products");
                const data = await res.json();

                if (res.ok) {
                    setProducts(data.products);
                } else {
                    toast.error(data.message || "Failed to fetch products");
                }
            } catch {
                toast.error("Server error");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const lower = searchTerm.toLowerCase();
        const filtered = products.filter((product) => {
            return (
                product.title.toLowerCase().includes(lower) ||
                product.seller.email.toLowerCase().includes(lower) ||
                product.seller.name?.toLowerCase().includes(lower)
            );
        });
        setFilteredProducts(filtered);
    }, [products, searchTerm]);

    const handleDelete = async () => {
        if (!selectedProduct) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/admin/products/${selectedProduct.id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error();

            setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id));
            toast.success("Product deleted");
        } catch {
            toast.error("Failed to delete product");
        } finally {
            setIsDeleting(false);
            setSelectedProduct(null);
        }
    };

    const paginated = filteredProducts.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );
    const totalPages = Math.ceil(filteredProducts.length / pageSize);

    return (
        <main className="max-w-6xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-6">Products Overview</h1>

            <div className="flex items-center justify-between mb-4 gap-4">
                <Input
                    placeholder="Search by title or seller..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-sm"
                />
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
                ) : filteredProducts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No products found.</p>
                ) : (
                    <>
                        <p className="text-muted-foreground text-sm mb-2">
                            Showing {paginated.length} of {filteredProducts.length} product(s)
                        </p>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Seller</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginated.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            <Image
                                                src={product.fileUrl}
                                                alt={product.title}
                                                width={60}
                                                height={60}
                                                className="rounded-md object-cover"
                                            />
                                        </TableCell>
                                        <TableCell>{product.title}</TableCell>
                                        <TableCell>${product.price.toFixed(2)}</TableCell>
                                        <TableCell>{product.seller.name || "-"}</TableCell>
                                        <TableCell>{product.seller.email}</TableCell>
                                        <TableCell>
                                            {format(new Date(product.createdAt), "yyyy-MM-dd")}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => setSelectedProduct(product)}
                                            >
                                                <Trash2 className="w-4 h-4 mr-1" />
                                                Delete
                                            </Button>
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
                                            onClick={() =>
                                                setCurrentPage((p) => Math.min(p + 1, totalPages))
                                            }
                                            aria-disabled={currentPage === totalPages}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        )}
                    </>
                )}
            </Card>

            <DeleteProductModal
                open={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                onConfirm={handleDelete}
                productTitle={selectedProduct?.title}
            />
        </main>
    );
}
