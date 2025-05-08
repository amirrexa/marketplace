import {
    LayoutDashboard,
    ShoppingCart,
    User,
    Store,
    ShieldCheck,
    Users,
    Package,
    Receipt,
} from "lucide-react";

export type NavItem = {
    href: string;
    label: string;
    icon: React.ElementType;
};

export type Role = "BUYER" | "SELLER" | "ADMIN";

export const navItemsByRole: Record<Role, NavItem[] | { label: string; icon: React.ElementType; children: NavItem[] }[]> = {
    BUYER: [
        { href: "/dashboard/buyer", label: "Browse", icon: LayoutDashboard },
        { href: "/dashboard/buyer/cart", label: "Cart", icon: ShoppingCart },
        { href: "/dashboard/profile", label: "Profile", icon: User },
    ],
    SELLER: [
        { href: "/dashboard/seller", label: "Seller Dashboard", icon: Store },
    ],
    ADMIN: [
        {
            label: "Admin",
            icon: ShieldCheck,
            children: [
                { href: "/dashboard/admin/users", label: "Users", icon: Users },
                { href: "/dashboard/admin/products", label: "Products", icon: Package },
                { href: "/dashboard/admin/orders", label: "Orders", icon: Receipt },
            ],
        },
    ],
};
