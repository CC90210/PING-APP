import { NextResponse } from "next/server";
import { ensureDbUser } from "@/lib/auth/ensure-user";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const user = await ensureDbUser();

        const contacts = await prisma.contact.findMany({
            where: { userId: user.id },
            select: { warmthStatus: true },
        });

        const stats = {
            total: contacts.length,
            green: contacts.filter((c) => c.warmthStatus === "GREEN").length,
            yellow: contacts.filter((c) => c.warmthStatus === "YELLOW").length,
            red: contacts.filter((c) => c.warmthStatus === "RED").length,
            dead: contacts.filter((c) => c.warmthStatus === "DEAD").length,
        };

        return NextResponse.json(stats);
    } catch (error: any) {
        console.error("[DASHBOARD_STATS]", error);
        if (error.message === "Unauthorized") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
