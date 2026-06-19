"use client";

import { useState } from "react";
import { slugify } from "@/lib/utils";

const cls =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[#43e1f0] focus:ring-2 focus:ring-[#43e1f0]/30";

export function NameSlugFields({
  defaultName = "",
  defaultSlug = "",
}: {
  defaultName?: string;
  defaultSlug?: string;
}) {
  const [name, setName] = useState(defaultName);
  const [slug, setSlug] = useState(defaultSlug);

  return (
    <>
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-zinc-600">
          Name <span className="text-red-500">*</span>
        </span>
        <input
          name="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Go / Golang"
          className={cls}
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-zinc-600">
          Slug <span className="text-red-500">*</span>
        </span>
        <input
          name="slug"
          required
          value={slug}
          onChange={(e) => setSlug(slugify(e.target.value))}
          placeholder="auto-generated hash"
          className={cls}
        />
        <span className="mt-1 block text-[11px] text-zinc-400">
          Auto-generated hash — edit to override.
        </span>
      </label>
    </>
  );
}
