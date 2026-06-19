import type { Metadata } from "next";
import type { ReactNode } from "react";
import { requireAdmin } from "@server/auth/dal";
import { logout } from "@server/actions/auth";
import { SidebarNav } from "../_components/sidebar-nav";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:gap-8">

        <aside className="lg:w-56 lg:flex-none">
          <div className="lg:sticky lg:top-6">
            <div className="mb-4 px-3">
              <p className="text-sm font-semibold tracking-tight text-zinc-950">
                Portfolio Admin
              </p>
              <p className="truncate text-xs text-zinc-500">{session.email}</p>
            </div>
            <SidebarNav />
            <form action={logout} className="mt-4 px-3">
              <button
                type="submit"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100"
              >
                Sign out
              </button>
            </form>
          </div>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
