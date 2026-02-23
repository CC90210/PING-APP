import { NextResponse } from "next/server";
import { getGoogleTokens } from "@/lib/google/auth";
import { importGoogleContacts } from "@/lib/google/contacts-import";
import { getOrCreateUser } from "@/lib/user";

export async function GET(req: Request) {
    try {
        const user = await getOrCreateUser();
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const code = searchParams.get("code");

        if (!code) {
            return new NextResponse("Code is required", { status: 400 });
        }

        const tokens = await getGoogleTokens(code);

        if (!tokens.access_token) {
            return new NextResponse("Failed to get access token", { status: 400 });
        }

        const results = await importGoogleContacts(user.id, tokens.access_token);

        // Redirect to onboarding or dashboard
        return NextResponse.redirect(new URL("/dashboard/contacts", req.url));
    } catch (error) {
        console.error("[GOOGLE_CALLBACK_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
