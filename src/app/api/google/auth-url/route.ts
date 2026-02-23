import { NextResponse } from "next/server";
import { getGoogleAuthUrl } from "@/lib/google/auth";
import { getOrCreateUser } from "@/lib/user";

export async function GET() {
    try {
        const user = await getOrCreateUser();
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const url = getGoogleAuthUrl();
        return NextResponse.json({ url });
    } catch (error) {
        console.error("[GOOGLE_AUTH_URL_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
