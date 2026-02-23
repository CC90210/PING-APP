import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/user";
import prisma from "@/lib/prisma";
import { generateVoiceNoteTalkingPoints } from "@/lib/outreach/voice-service";

export async function POST(req: Request) {
    try {
        const user = await getOrCreateUser();
        if (!user) return new NextResponse("Unauthorized", { status: 401 });

        const { contactId } = await req.json();
        if (!contactId) return new NextResponse("Contact ID is required", { status: 400 });

        const talkingPoints = await generateVoiceNoteTalkingPoints(contactId, user.id);

        return NextResponse.json({ talkingPoints });
    } catch (error) {
        console.error("[VOICE_SUGGESTIONS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
