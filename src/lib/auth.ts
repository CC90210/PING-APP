import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),

    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string },
                });

                if (!user || !user.passwordHash) {
                    return null;
                }

                const isValid = await bcrypt.compare(
                    credentials.password as string,
                    user.passwordHash
                );

                if (!isValid) {
                    return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.avatarUrl,
                };
            },
        }),

        ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
            ? [
                GoogleProvider({
                    clientId: process.env.GOOGLE_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                    authorization: {
                        params: {
                            prompt: "consent",
                            access_type: "offline",
                            response_type: "code",
                            scope:
                                "openid email profile https://www.googleapis.com/auth/contacts.readonly",
                        },
                    },
                }),
            ]
            : []),
    ],

    session: {
        strategy: "jwt",
    },

    pages: {
        signIn: "/login",
        newUser: "/onboarding",
        error: "/login",
    },

    callbacks: {
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
            }
            if (account?.provider === "google") {
                token.googleAccessToken = account.access_token;
                token.googleRefreshToken = account.refresh_token;
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },

        async signIn({ user, account, profile }) {
            if (account?.provider === "google" && profile?.email) {
                const existing = await prisma.user.findUnique({
                    where: { email: profile.email },
                });

                if (!existing) {
                    await prisma.user.create({
                        data: {
                            email: profile.email,
                            name: profile.name || null,
                            avatarUrl: (profile as any).picture || null,
                            timezone: "America/Toronto",
                        },
                    });
                }
            }
            return true;
        },
    },
});
