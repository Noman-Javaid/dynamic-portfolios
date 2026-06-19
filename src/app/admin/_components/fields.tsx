import type { ReactNode } from "react";

const inputCls =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[#43e1f0] focus:ring-2 focus:ring-[#43e1f0]/30";

function Label({ label, required }: { label: string; required?: boolean }) {
  return (
    <span className="mb-1 block text-xs font-medium text-zinc-600">
      {label}
      {required && <span className="text-red-500"> *</span>}
    </span>
  );
}

export function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string | number;
}) {
  return (
    <label className="block">
      <Label label={label} required={required} />
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className={inputCls}
      />
    </label>
  );
}

export function Area({
  label,
  name,
  rows = 4,
  required,
  placeholder,
  hint,
  defaultValue,
}: {
  label: string;
  name: string;
  rows?: number;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <Label label={label} required={required} />
      <textarea
        name={name}
        rows={rows}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className={`${inputCls} resize-y`}
      />
      {hint && <span className="mt-1 block text-[11px] text-zinc-400">{hint}</span>}
    </label>
  );
}

export function CheckboxGroup({
  label,
  name,
  options,
  selected = [],
  required,
  hint,
}: {
  label: string;
  name: string;
  options: { id: string; name: string }[];
  selected?: string[];
  required?: boolean;
  hint?: string;
}) {
  return (
    <fieldset className="block">
      <Label label={label} required={required} />
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label
            key={o.id}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 transition-colors hover:border-zinc-400 has-checked:border-[#43e1f0] has-checked:bg-[#43e1f0]/10"
          >
            <input
              type="checkbox"
              name={name}
              value={o.id}
              defaultChecked={selected.includes(o.id)}
              className="accent-[#43e1f0]"
            />
            {o.name}
          </label>
        ))}
      </div>
      {hint && <span className="mt-1 block text-[11px] text-zinc-400">{hint}</span>}
    </fieldset>
  );
}

export function Select({
  label,
  name,
  required,
  defaultValue,
  children,
}: {
  label: string;
  name: string;
  required?: boolean;
  defaultValue?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <Label label={label} required={required} />
      <select
        name={name}
        required={required}
        defaultValue={defaultValue}
        className={inputCls}
      >
        {children}
      </select>
    </label>
  );
}
