export { auth as middleware } from "@/lib/auth";

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/contacts/:path*",
        "/nudges/:path*",
        "/outreach/:path*",
        "/analytics/:path*",
        "/channels/:path*",
        "/settings/:path*",
        "/onboarding/:path*",
        "/import/:path*",
        "/api/contacts/:path*",
        "/api/nudges/:path*",
        "/api/outreach/:path*",
        "/api/dashboard/:path*",
        "/api/analytics/:path*",
        "/api/settings/:path*",
    ],
};
