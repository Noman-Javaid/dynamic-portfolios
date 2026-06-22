import { listThemes, type ThemeRow } from "@server/lib/admin-queries";
import { ThemesManager } from "@/app/admin/_components/themes-manager";

export default async function ThemesPage() {
  let data: { themes: ThemeRow[]; activeId: string | null } | null = null;
  let error: string | null = null;
  try {
    data = await listThemes();
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-950">Themes</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Pick a preset or craft your own — colors, surfaces, borders, roundness and font.
          The active theme restyles every public portfolio instantly.
        </p>
      </header>

      {data ? (
        <ThemesManager themes={data.themes} activeId={data.activeId} />
      ) : (
        <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-4 text-sm text-amber-900">
          <p className="font-semibold">Themes aren’t set up in the database yet.</p>
          <p className="mt-1">
            Run migration{" "}
            <code className="rounded bg-amber-100 px-1">
              supabase/migrations/0004_themes.sql
            </code>{" "}
            on this project’s Supabase database (SQL Editor), then reload this page. If you
            just ran it and still see this, run{" "}
            <code className="rounded bg-amber-100 px-1">notify pgrst, &apos;reload schema&apos;;</code>{" "}
            to refresh the API cache.
          </p>
          {error && (
            <p className="mt-2 text-xs text-amber-700">Details: {error}</p>
          )}
        </div>
      )}
    </div>
  );
}
