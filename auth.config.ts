// app/lib/auth.config.ts
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";
import { sql } from "@/app/lib/db";

export const authConfig: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      const email = user.email.toLowerCase();

      const existing = await sql<{ id: string }[]>`
        SELECT id FROM users WHERE email = ${email}
      `;

      if (!existing.length) {
        await sql`
          INSERT INTO users (email, name, role)
          VALUES (${email}, ${user.name ?? "No Name"}, 'member')
        `;
      }
      return true;
    },

    async session({ session }) {
      if (session.user?.email) {
        const res = await sql<{ role: "admin" | "member" }[]>`
          SELECT role FROM users WHERE email = ${session.user.email}
        `;
        session.user.role = res[0]?.role ?? "member";
      }
      return session;
    },
  },
};
