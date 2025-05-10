"use client";

import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@radix-ui/react-dialog";

interface Props {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    orderTitle?: string;
}

export default function DeleteOrderModal({ open, onClose, onConfirm, orderTitle }: Props) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogTitle>
                    Are you sure you want to delete{" "}{orderTitle}?
                </DialogTitle>

                <DialogFooter className="flex justify-end gap-2 mt-4">
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={onConfirm}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
