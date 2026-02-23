import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function ensureDbUser() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    let dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });

    if (!dbUser) {
        const clerkUser = await currentUser();
        dbUser = await prisma.user.create({
            data: {
                clerkId: userId,
                email: clerkUser?.emailAddresses?.[0]?.emailAddress || "",
                name:
                    `${clerkUser?.firstName || ""} ${clerkUser?.lastName || ""}`.trim() ||
                    null,
                timezone: "America/Toronto",
                settings: {
                    create: {},
                },
            },
        });
    }

    return dbUser;
}
