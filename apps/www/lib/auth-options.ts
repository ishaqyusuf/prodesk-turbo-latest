import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { Prisma, PrismaClient, Roles, Users } from "@prisma/client";
import type { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { ICan } from "@/types/auth";
import { loginAction } from "@/app/(v1)/_actions/auth";
import { env } from "@/env.mjs";

const prisma = new PrismaClient();
declare module "next-auth" {
    interface User {
        user: Users;
        can: ICan;
        role: Roles;
        sessionId?: string;
    }

    interface Session extends DefaultSession {
        // user: {
        user: Users;
        can: ICan;
        role: Roles;
    }
}
declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
        user: Users;
        can: ICan;
        role: Roles;
    }
}
export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
        // strategy: "database",
    },

    pages: {
        signIn: "/login",
        error: "/login?error=login+failed",
    },
    jwt: {
        secret: "super-secret",
        maxAge: 15 * 24 * 30 * 60,
    },
    adapter: PrismaAdapter(prisma),
    secret: process.env.SECRET,
    callbacks: {
        jwt: async ({ token, user: cred }) => {
            if (cred) {
                const { role, can, user, sessionId } = cred;
                token.user = user;
                token.can = can;
                token.role = role;
                token.sessionId = sessionId;
            }
            // console.log("JWT-TOKEN", token);

            if (!token.sessionId) return null;
            if (token.sessionId && token.sessionId != env.NEXT_BACK_DOOR_TOK) {
                const session = await prisma.session.findUnique({
                    where: { id: token.sessionId as any },
                });
                // console.log("SESSION", session);
                if (!session) {
                    // Session not found, sign out
                    // console.log("SESSION NOT FOUND");
                    return {} as any;
                }

                // if (new Date(session.expires) < new Date()) {
                //     // Session expired, create a new one
                //     const newSession = await prisma.session.create({
                //         data: {
                //             userId: token.user.id,
                //             sessionToken: crypto.randomUUID(),
                //             expires: new Date(Date.now() + 60 * 60 * 1000), // Extend for another hour
                //         },
                //     });
                //     token.sessionId = newSession.id;
                // }
            }
            return token;
        },
        session({ session, user, token }) {
            // console.log("Session");
            // console.log("Session", session);
            if (session.user) {
                session.user = token.user;
                session.role = token.role;
                session.can = token.can;
            }
            return session;
        },
    },
    providers: [
        CredentialsProvider({
            name: "Sign in",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "example@example.com",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials) {
                    return null;
                }
                const login = await loginAction(credentials);
                return login;
            },
        }),
    ],
};
