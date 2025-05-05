// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwtEdge } from "@/lib/auth";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const pathname = req.nextUrl.pathname;

    console.log("🔍 Path:", pathname);
    console.log("🍪 Token:", token?.slice(0, 30) + "...");

    const publicRoutes = ["/", "/login", "/register"];
    if (publicRoutes.includes(pathname)) return NextResponse.next();

    const payload = await verifyJwtEdge(token || "");
    console.log("🧠 Payload:", payload);

    if (!payload || typeof payload !== "object" || !("role" in payload)) {
        console.log("❌ Invalid or missing role — redirecting to /login");
        return NextResponse.redirect(new URL("/login", req.url));
    }

    const role = payload.role;

    if (pathname.startsWith("/dashboard/seller") && role !== "SELLER" && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard/buyer", req.url));
    }

    if (pathname.startsWith("/dashboard/buyer") && role !== "BUYER" && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard/seller", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};
