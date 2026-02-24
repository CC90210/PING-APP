// Re-export getAuthenticatedUser as the primary way to get the current user.
// This file exists for backward compatibility — all pages/routes import from here.
export { getAuthenticatedUser as getOrCreateUser } from "@/lib/auth-guard";
