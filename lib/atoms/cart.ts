import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { toast } from "sonner";

export const cartAtom = atomWithStorage<string[]>("cart", []);

export const addToCartAtom = atom(
  null,
  async (get, set, productId: string) => {
    const cart = get(cartAtom);
    if (cart.includes(productId)) return;

    // Validate product availability
    const res = await fetch(`/api/products/${productId}`);
    const data = await res.json();
    if (!res.ok || !data.product || !["FOR_SALE", "ON_SALE"].includes(data.product.status)) {
      toast.error("Product is unavailable");
      return;
    }

    set(cartAtom, [...cart, productId]);
    // Sync to server (requires new API route)
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, action: "add" }),
      });
    } catch {
      toast.error("Failed to sync cart");
    }
  }
);

export const removeFromCartAtom = atom(
  null,
  async (get, set, productId: string) => {
    set(cartAtom, get(cartAtom).filter((id) => id !== productId));
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, action: "remove" }),
      });
    } catch {
      toast.error("Failed to sync cart");
    }
  }
);

export const clearCartAtom = atom(null, async (_get, set) => {
  set(cartAtom, []);
  try {
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "clear" }),
    });
  } catch {
    toast.error("Failed to sync cart");
  }
});