"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type DealFieldOption = {
  code: string;
  title: string;
  type: string;
};

function fieldLabel(f: DealFieldOption) {
  return `${f.title} (${f.code})`;
}

export function SearchableDealFieldSelect({
  id,
  label,
  hint,
  value,
  onChange,
  fields,
  placeholder = "Buscar por nome ou código…",
}: {
  id: string;
  label: string;
  hint: string;
  value: string;
  onChange: (value: string) => void;
  fields: DealFieldOption[];
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");

  const selected = useMemo(
    () => fields.find((f) => f.code === value) ?? null,
    [fields, value],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return fields;
    return fields.filter(
      (f) =>
        f.title.toLowerCase().includes(q) ||
        f.code.toLowerCase().includes(q) ||
        f.type.toLowerCase().includes(q),
    );
  }, [fields, query]);

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>

      {selected && (
        <div className="flex items-center justify-between gap-2 rounded-md border bg-muted/40 px-3 py-2 text-sm">
          <span className="truncate">{fieldLabel(selected)}</span>
          <button
            type="button"
            onClick={() => onChange("")}
            className="shrink-0 text-muted-foreground hover:text-foreground text-xs"
            aria-label="Limpar seleção"
          >
            Limpar
          </button>
        </div>
      )}

      <Input
        id={id}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
      />

      <div className="rounded-md border max-h-52 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="px-3 py-4 text-sm text-muted-foreground text-center">
            Nenhum campo encontrado
          </p>
        ) : (
          <ul role="listbox" aria-labelledby={id} className="divide-y">
            {filtered.map((f) => {
              const isSelected = f.code === value;
              return (
                <li key={f.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(f.code);
                      setQuery("");
                    }}
                    className={cn(
                      "w-full px-3 py-2 text-left text-sm transition-colors hover:bg-muted/60",
                      isSelected && "bg-[var(--bitrix-primary)]/10 font-medium",
                    )}
                  >
                    <span className="block truncate">{f.title}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {f.code} · {f.type}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        {hint}{" "}
        {query.trim()
          ? `· ${filtered.length} de ${fields.length} campo(s)`
          : `· ${fields.length} campo(s) disponíveis`}
      </p>
    </div>
  );
}
