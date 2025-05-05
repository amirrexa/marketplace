"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ConfirmRequestModal({
    open,
    onConfirm,
    onCancel,
}: {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    return (
        <Dialog open={open} onOpenChange={onCancel}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Request</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground mb-4">
                    Are you sure you want to request this product?
                </p>
                <DialogFooter>
                    <Button variant="ghost" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button onClick={onConfirm}>Yes, Request</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
