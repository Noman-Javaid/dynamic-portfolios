import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@server/auth/dal";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const session = await getSession();
  if (session?.role === "admin") redirect("/admin");
  return <LoginForm />;
}
