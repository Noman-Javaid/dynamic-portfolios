import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getStackBySlug, getProfile } from "@server/lib/queries";
import { StackLanding } from "@/components/site/stack-landing";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ stack: string }>;
}): Promise<Metadata> {
  const { stack } = await params;
  const data = await getStackBySlug(stack);
  if (!data) return { title: "Not found" };
  const profile = await getProfile();
  return {
    title: `${profile?.name ?? "Portfolio"} — ${data.name}`,
    description: data.blurb,
  };
}

export default async function StackPage({
  params,
}: {
  params: Promise<{ stack: string }>;
}) {
  const { stack } = await params;
  const [data, profile] = await Promise.all([
    getStackBySlug(stack),
    getProfile(),
  ]);

  if (!data || !profile) notFound();

  return <StackLanding stack={data} person={profile} />;
}
