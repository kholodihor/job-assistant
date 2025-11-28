import { createAuthClient } from "better-auth/react";

// Use same-origin by default; baseURL can be overridden via env if needed
export const authClient = createAuthClient({});

export const { signIn, signUp, signOut, useSession } = authClient;
