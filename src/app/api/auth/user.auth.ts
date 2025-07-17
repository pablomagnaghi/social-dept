import { auth } from "@clerk/nextjs/server";

export async function getUserIdOrUnauthorized() {
  const { userId } = await auth();
  return userId || null;
}
