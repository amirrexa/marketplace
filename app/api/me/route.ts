import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";

export async function GET() {
    const token = cookies().get("token")?.value;
    const payload = verifyJwt(token || "");

    console.log("🔍 JWT Payload:", payload);

    return Response.json({ user: payload });
}
