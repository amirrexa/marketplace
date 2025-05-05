import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// 🛒 Automatically synced with localStorage under key "cart"
export const cartAtom = atomWithStorage<string[]>("cart", []);

// ➕ Add product
export const addToCartAtom = atom(
    null,
    (get, set, productId: string) => {
        const cart = get(cartAtom);
        if (!cart.includes(productId)) {
            set(cartAtom, [...cart, productId]);
        }
    }
);

// 🗑 Remove product
export const removeFromCartAtom = atom(
    null,
    (get, set, productId: string) => {
        set(cartAtom, get(cartAtom).filter((id) => id !== productId));
    }
);

// 🧼 Clear cart
export const clearCartAtom = atom(null, (_get, set) => {
    set(cartAtom, []);
});
