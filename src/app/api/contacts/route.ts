import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth-guard";
import prisma from "@/lib/prisma";
import { z } from "zod";

const contactSchema = z.object({
    name: z.string().min(1),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional().or(z.literal("")),
    category: z
        .enum(["FAMILY", "FRIEND", "CLIENT", "COLLEAGUE", "MENTOR", "ACQUAINTANCE", "OTHER"])
        .optional()
        .default("FRIEND"),
    priority: z.number().min(0).max(2).optional().default(0),
    desiredFrequencyDays: z.number().min(1).optional().default(14),
    tags: z.array(z.string()).optional().default([]),
    notes: z.string().optional().default(""),
    company: z.string().optional(),
    role: z.string().optional(),
    linkedinUrl: z.string().optional(),
    birthday: z.string().optional(),
    location: z.string().optional(),
});

export const GET = withAuth(async (user, request) => {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const status = url.searchParams.get("status");
    const search = url.searchParams.get("search");
    const sort = url.searchParams.get("sort") || "warmthScore";
    const order = url.searchParams.get("order") || "asc";

    const where: any = { userId: user.id, isArchived: false };

    if (category) where.category = category;
    if (status) where.warmthStatus = status;
    if (search) {
        where.OR = [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { company: { contains: search, mode: "insensitive" } },
        ];
    }

    const contacts = await prisma.contact.findMany({
        where,
        orderBy: { [sort]: order },
        select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            avatarUrl: true,
            category: true,
            priority: true,
            tags: true,
            warmthScore: true,
            warmthStatus: true,
            lastInteractionAt: true,
            lastInteractionChannel: true,
            desiredFrequencyDays: true,
            company: true,
            role: true,
            birthday: true,
        },
    });

    return NextResponse.json({ contacts });
});

export const POST = withAuth(async (user, request) => {
    const body = await request.json();

    try {
        const data = contactSchema.parse(body);

        // Check plan limits
        if (user.plan === "FREE") {
            const contactCount = await prisma.contact.count({
                where: { userId: user.id },
            });
            if (contactCount >= 50) {
                return NextResponse.json(
                    {
                        error:
                            "Free plan limited to 50 contacts. Upgrade to Pro for unlimited.",
                    },
                    { status: 403 }
                );
            }
        }

        const contact = await prisma.contact.create({
            data: {
                userId: user.id,
                name: data.name,
                phone: data.phone || null,
                email: data.email || null,
                category: data.category as any,
                desiredFrequencyDays: data.desiredFrequencyDays,
                priority: data.priority,
                tags: data.tags,
                notes: data.notes || null,
                company: data.company || null,
                role: data.role || null,
                linkedinUrl: data.linkedinUrl || null,
                birthday: data.birthday ? new Date(data.birthday) : null,
                location: data.location || null,
                warmthScore: 50,
                warmthStatus: "YELLOW",
            },
        });

        return NextResponse.json({ contact }, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ errors: error.issues }, { status: 400 });
        }
        throw error; // Let withAuth's error handler catch it
    }
});
