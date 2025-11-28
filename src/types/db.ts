import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { user } from "@/db/schema";

export type User = InferSelectModel<typeof user>;
export type NewUser = InferInsertModel<typeof user>;
