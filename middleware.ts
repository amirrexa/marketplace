import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwt } from "@/lib/auth";

export function middleware(req: NextRequest) {
    console.log("🛡 Middleware triggered for:", req.nextUrl.pathname); // <--

    const token = req.cookies.get("token")?.value;
    const pathname = req.nextUrl.pathname;

    const publicRoutes = ["/", "/login", "/register"];
    if (publicRoutes.includes(pathname)) return NextResponse.next();

    const payload = verifyJwt(token || "");

    if (!payload || typeof payload !== "object" || !("role" in payload)) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    const role = payload.role;

    // ✅ Protect seller dashboard
    if (pathname.startsWith("/dashboard/seller") && role !== "SELLER" && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard/buyer", req.url));
    }

    // ✅ Allow everything else
    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};
