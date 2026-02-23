import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "./prisma";

export async function getOrCreateUser() {
    if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
        return null;
    }
    const { userId: clerkId } = await auth();

    if (!clerkId) {
        return null;
    }

    const user = await prisma.user.findUnique({
        where: { clerkId },
    });

    if (user) {
        return user;
    }

    // If user doesn't exist in our DB, create them
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    return await prisma.user.create({
        data: {
            clerkId,
            email: clerkUser.emailAddresses[0].emailAddress,
            name: `${clerkUser.firstName} ${clerkUser.lastName}`,
            settings: {
                create: {}, // Default settings
            },
        },
    });
}
