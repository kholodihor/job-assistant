/* eslint-disable @typescript-eslint/ban-ts-comment */
import { headers } from "next/headers";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/db";
import { findUserByEmail } from "@/resources/user-queries";
import { User } from "@/types/db";
import { verifyPassword } from "../utils/password";

const errorMessages = {
  en: {
    invalidCredentials: "Invalid email or password",
    accountNotLinked: "Please use email/password to sign in",
    useCredentials: "Please use email/password to sign in with this account",
  },
  ua: {
    invalidCredentials: "Невірна електронна пошта або пароль",
    accountNotLinked:
      "Будь ласка, використовуйте електронну пошту/пароль для входу",
    useCredentials:
      "Будь ласка, використовуйте електронну пошту/пароль для входу в цей обліковий запис",
  },
} as const;

async function getLocaleFromHeaders() {
  try {
    const headersList = await headers();
    const pathname = headersList.get("x-invoke-path") || "";
    const locale = pathname.split("/")[1] || "ua";
    return locale as keyof typeof errorMessages;
  } catch (error) {
    console.log(error);
    return "ua" as const;
  }
}

const authOptions = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "email",
          type: "text",
        },
        password: {
          label: "password",
          type: "password",
        },
        remember: {
          label: "remember",
          type: "boolean",
        },
      },
      //@ts-ignore
      async authorize(
        credentials: Record<
          "email" | "password" | "remember",
          string | undefined
        >
      ): Promise<User | null> {
        const locale = await getLocaleFromHeaders();

        if (!credentials?.email || !credentials?.password) {
          throw new Error(errorMessages[locale].invalidCredentials);
        }

        const user = await findUserByEmail(credentials.email);
        if (!user) {
          throw new Error(errorMessages[locale].invalidCredentials);
        }

        if (!user.password) {
          throw new Error(errorMessages[locale].accountNotLinked);
        }

        const isCorrectPassword = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error(errorMessages[locale].invalidCredentials);
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
          image: user.image,
          password: user.password,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!account || !user.email) return false;

      // For credentials login, always allow
      if (account.type === "credentials") {
        return true;
      }

      // Check if user exists with credentials
      const existingUser = await findUserByEmail(user.email);
      if (!existingUser) {
        return true;
      }

      // If user exists with credentials, don't allow OAuth
      if (existingUser.password) {
        const locale = await getLocaleFromHeaders();
        return `/${locale}/signin?error=UseCredentials&email=${encodeURIComponent(user.email)}`;
      }

      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.name = token.name ?? null;
        session.user.email = token.email;
        session.user.image = token.picture ?? null;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session) {
        return { ...token, ...session.user };
      }

      if (user) {
        const typedUser = user as User;
        return {
          ...token,
          id: typedUser.id,
          name: typedUser.name ?? null,
          email: typedUser.email,
          picture: typedUser.image ?? null,
        };
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = authOptions;
