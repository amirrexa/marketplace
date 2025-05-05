import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwt } from "@/lib/auth";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const pathname = req.nextUrl.pathname;

    const publicRoutes = ["/", "/login", "/register"];
    if (publicRoutes.includes(pathname)) return NextResponse.next();

    const payload = verifyJwt(token || "");
    if (!payload || typeof payload !== "object" || !("role" in payload)) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    const role = payload.role;

    // 🔐 Restrict SELLER-only area
    if (pathname.startsWith("/dashboard/seller") && role !== "SELLER" && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard/buyer", req.url));
    }

    // 🔐 Restrict BUYER-only area (exclude sellers and admins from restricted pages if needed)
    if (pathname.startsWith("/dashboard/buyer") && role === "BUYER") {
        // Buyer is valid, continue
        return NextResponse.next();
    }

    // ✅ Let SELLER browse buyer dashboard
    if (pathname.startsWith("/dashboard/buyer") && role === "SELLER") {
        return NextResponse.next();
    }

    // ✅ Let ADMIN go everywhere
    if (role === "ADMIN") {
        return NextResponse.next();
    }

    // 🔒 Default fallback
    return NextResponse.redirect(new URL("/login", req.url));
}

export const config = {
    matcher: ["/dashboard/:path*"],
};
