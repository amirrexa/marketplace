import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const cartAtom = atomWithStorage<string[]>("cart", []);

export const addToCartAtom = atom(
  null,
  (get, set, productId: string) => {
    const cart = get(cartAtom);
    if (cart.includes(productId)) return;
    set(cartAtom, [...cart, productId]);
  }
);

export const removeFromCartAtom = atom(
  null,
  (get, set, productId: string) => {
    set(cartAtom, get(cartAtom).filter((id) => id !== productId));
  }
);

export const clearCartAtom = atom(null, (_get, set) => {
  set(cartAtom, []);
});
