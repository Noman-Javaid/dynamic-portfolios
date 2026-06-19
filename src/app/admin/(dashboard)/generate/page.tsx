import { GeneratePanel } from "@/app/admin/_components/generate-panel";

export default function GeneratePage() {
  const configured = Boolean(process.env.GROQ_API_KEY);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-950">
          Generate with AI
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Paste a job description and Grok assembles a tailored portfolio by selecting the
          best-matching projects, experiences and tech categories from your existing
          content. It never invents new entries — the result lands in the{" "}
          <strong>Portfolios</strong> tab to edit.
        </p>
      </header>

      {!configured && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <strong>GROQ_API_KEY is not set.</strong> Add it to{" "}
          <code className="rounded bg-amber-100 px-1">supabase/.env</code> and restart the
          dev server.
        </div>
      )}

      <GeneratePanel />
    </div>
  );
}
