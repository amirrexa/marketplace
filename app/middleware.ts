import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/auth";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const isLoggedIn = !!(token && verifyJwt(token));

    const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard");

    if (isProtectedRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}
