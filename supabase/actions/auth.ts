"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "../lib/client";
import { createSession, deleteSession } from "../auth/session";

const LoginSchema = z.object({
  email: z.string().min(3),
  password: z.string().min(1),
});

export type LoginState = { error?: string } | undefined;

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Enter a valid email and password." };
  }

  const email = parsed.data.email.trim().toLowerCase();

  const { data: user, error } = await supabaseAdmin()
    .from("users")
    .select("id, email, password_hash, role")
    .eq("email", email)
    .maybeSingle();

  if (error) return { error: "Something went wrong. Try again." };
  if (!user) return { error: "Invalid credentials." };

  const valid = await bcrypt.compare(parsed.data.password, user.password_hash);
  if (!valid) return { error: "Invalid credentials." };

  await createSession({ id: user.id, email: user.email, role: user.role });
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/admin/login");
}
