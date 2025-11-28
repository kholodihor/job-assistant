"server-only";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { user } from "@/db/schema";
import { NewUser } from "@/types/db";

export async function findUserByEmail(email: string) {
  return db.query.user.findFirst({
    where: eq(user.email, email),
  });
}

export async function createUser(newUserData: NewUser) {
  const [newUser] = await db.insert(user).values(newUserData).returning();
  return newUser;
}
