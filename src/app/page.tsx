import { notFound } from "next/navigation";
import { getStacks, getStackBySlug, getProfile } from "@server/lib/queries";
import { StackLanding } from "@/components/site/stack-landing";

export const dynamic = "force-dynamic";

export default async function Home() {
  const stacks = await getStacks();
  if (stacks.length === 0) notFound();

  const preferred = stacks.find((s) => /portfolio/i.test(s.slug)) ?? stacks[0];

  const [data, profile] = await Promise.all([
    getStackBySlug(preferred.slug),
    getProfile(),
  ]);

  if (!data || !profile) notFound();

  return <StackLanding stack={data} person={profile} />;
}
