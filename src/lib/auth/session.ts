import "server-only";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

/** Returns the signed-in user's id, or `null` for an anonymous request. */
export async function requireUserId() {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}
