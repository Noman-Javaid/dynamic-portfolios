"use client";

import { useState } from "react";
import { DynamicIcon, iconNames } from "@/lib/icons";

const inputCls =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[#43e1f0] focus:ring-2 focus:ring-[#43e1f0]/30";

export function IconPicker({
  name,
  label = "Icon",
  defaultValue = "Boxes",
}: {
  name: string;
  label?: string;
  defaultValue?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-zinc-600">{label}</span>
      <div className="flex items-center gap-2">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-zinc-300 bg-zinc-50 text-zinc-700">
          <DynamicIcon name={value} className="h-4 w-4" />
        </span>
        <select
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={inputCls}
        >
          {iconNames.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}
