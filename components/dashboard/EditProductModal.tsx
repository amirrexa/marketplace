"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

export default function EditProductModal({
    open,
    onClose,
    product,
    onUpdated,
}: {
    open: boolean;
    onClose: () => void;
    product: {
        id: string;
        title: string;
        description: string;
        price: number;
        status: string;
    };
    onUpdated: () => void;
}) {
    const [title, setTitle] = useState(product.title);
    const [description, setDescription] = useState(product.description);
    const [price, setPrice] = useState(product.price.toString());
    const [status, setStatus] = useState(product.status);
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        setLoading(true);
        const res = await fetch(`/api/admin/products/${product.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, description, price, status }),
        });

        const data = await res.json();
        setLoading(false);

        if (res.ok) {
            toast.success("Product updated");
            onUpdated();
            onClose();
        } else {
            toast.error(data.message || "Update failed");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label>Title</Label>
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div>
                        <Label>Description</Label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label>Price</Label>
                        <Input
                            type="number"
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
                </div>
                <DialogFooter>
                    <Button onClick={handleUpdate} disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
