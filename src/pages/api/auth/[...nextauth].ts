import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import invariant from "tiny-invariant";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/db";

invariant(process.env.GITHUB_ID, "GITHUB_ID must be set");
invariant(process.env.GITHUB_SECRET, "GITHUB_SECRET must be set");

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
});
