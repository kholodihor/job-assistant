"server-only";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { NewUser } from "@/types/db";

export async function findUserByEmail(email: string) {
  return db.query.users.findFirst({
    where: eq(users.email, email),
  });
}

export async function createUser(user: NewUser) {
  const [newUser] = await db.insert(users).values(user).returning();
  return newUser;
}
