import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/user";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { ContactCategory } from "@prisma/client";

const contactSchema = z.object({
    name: z.string().min(1),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional().or(z.literal("")),
    category: z.nativeEnum(ContactCategory).optional().default(ContactCategory.FRIEND),
    priority: z.number().min(1).max(10).optional().default(5),
    desiredFrequencyDays: z.number().min(1).optional().default(14),
    tags: z.array(z.string()).optional().default([]),
    notes: z.string().optional().default(""),
});

export async function GET() {
    try {
        const user = await getOrCreateUser();
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const contacts = await prisma.contact.findMany({
            where: { userId: user.id },
            orderBy: { lastInteractionAt: "desc" },
        });

        return NextResponse.json(contacts);
    } catch (error) {
        console.error("[CONTACTS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const user = await getOrCreateUser();
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const validatedData = contactSchema.parse(body);

        const contact = await prisma.contact.create({
            data: {
                ...validatedData,
                userId: user.id,
                warmthScore: 100,
                warmthStatus: "GREEN",
            },
        });

        return NextResponse.json(contact);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(JSON.stringify(error.errors), { status: 400 });
        }
        console.error("[CONTACTS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
