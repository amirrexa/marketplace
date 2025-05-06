import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwtEdge } from "@/lib/auth";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const pathname = req.nextUrl.pathname;

    // Public pages don't need auth
    const publicRoutes = ["/", "/login", "/register"];
    if (publicRoutes.includes(pathname)) return NextResponse.next();

    // Verify JWT
    const payload = await verifyJwtEdge(token || "");

    if (!payload || typeof payload !== "object" || !("role" in payload)) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    const role = payload.role;

    // 🔒 Restrict BUYERs from accessing /dashboard/seller and /dashboard/admin
    if (role === "BUYER") {
        if (pathname.startsWith("/dashboard/seller") || pathname.startsWith("/dashboard/admin")) {
            return NextResponse.redirect(new URL("/dashboard/buyer", req.url));
        }
    }

    // 🔒 Restrict SELLERs from accessing /dashboard/admin
    if (role === "SELLER") {
        if (pathname.startsWith("/dashboard/admin")) {
            return NextResponse.redirect(new URL("/dashboard/buyer", req.url));
        }
    }

    // ADMIN can access everything ✅

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};
