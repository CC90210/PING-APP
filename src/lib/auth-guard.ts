import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Get the authenticated user from the session.
 * Throws "Unauthorized" if no session or user not found.
 */
export async function getAuthenticatedUser() {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
    });

    if (!user) {
        throw new Error("User not found");
    }

    return user;
}

/**
 * Higher-order function wrapper for API routes with automatic auth + error handling.
 * Usage:
 *   export const GET = withAuth(async (user, request) => { ... });
 */
export function withAuth(
    handler: (user: any, request: Request) => Promise<NextResponse>
) {
    return async (request: Request) => {
        try {
            const user = await getAuthenticatedUser();
            return await handler(user, request);
        } catch (error: any) {
            if (
                error.message === "Unauthorized" ||
                error.message === "User not found"
            ) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
            console.error("[API Error]", error);
            return NextResponse.json(
                { error: "Internal server error" },
                { status: 500 }
            );
        }
    };
}
