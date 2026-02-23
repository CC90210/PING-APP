import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "./prisma";

/**
 * @deprecated Use ensureDbUser from '@/lib/auth/ensure-user' instead.
 * Kept for backward compatibility with existing server components.
 */
export async function getOrCreateUser() {
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
                create: {},
            },
        },
    });
}
