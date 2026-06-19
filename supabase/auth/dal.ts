import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { decrypt, readSessionCookie, type SessionPayload } from "./session";

export const getSession = cache(async (): Promise<SessionPayload | null> => {
  const cookie = await readSessionCookie();
  const session = await decrypt(cookie);
  if (!session?.userId) return null;
  return session;
});

export const requireAdmin = cache(async (): Promise<SessionPayload> => {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    redirect("/admin/login");
  }
  return session;
});
