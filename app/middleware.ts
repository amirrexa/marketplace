// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/auth";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const url = req.nextUrl.clone();

    // If no token, redirect to login
    if (!token) {
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    const payload = verifyJwt(token);

    // If token is invalid or role is missing, redirect to login
    if (!payload || typeof payload !== "object" || !("id" in payload) || !("role" in payload)) {
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    const userRole = payload.role;

    // 🔐 Only allow SELLERs on /dashboard/seller
    if (req.nextUrl.pathname.startsWith("/dashboard/seller") && userRole !== "SELLER") {
        url.pathname = "/unauthorized";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};