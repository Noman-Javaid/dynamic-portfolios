import { getStackBySlug, getProfile } from "@server/lib/queries";
import { renderCvPdf } from "./cv-document";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ stack: string }> }
) {
  const { stack: slug } = await ctx.params;
  const [stack, person] = await Promise.all([getStackBySlug(slug), getProfile()]);
  if (!stack || !person) {
    return new Response("Not found", { status: 404 });
  }

  const pdf = await renderCvPdf(stack, person);

  const filename =
    `${person.name} - ${stack.name} CV`
      .replace(/[^a-z0-9 _-]/gi, "")
      .trim()
      .replace(/\s+/g, "_") || "CV";

  return new Response(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
