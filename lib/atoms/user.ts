import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// User atom synced with localStorage under key "user"
export interface User {
    id: string;
    email: string;
    role: "SELLER" | "ADMIN" | "BUYER" | null;
}

export const userAtom = atomWithStorage<User | null>("user", null);

// Clear user (e.g., for logout)
export const clearUserAtom = atom(null, (_get, set) => {
    set(userAtom, null);
});