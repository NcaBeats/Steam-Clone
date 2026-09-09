"use client";

import { useId, useState } from "react";
import { Input, Textarea } from "@/components/ui";

const SPEC_FIELDS: ReadonlyArray<
  Readonly<{ key: string; label: string; placeholder: string }>
> = [
  {
    key: "os",
    label: "OS",
    placeholder: "e.g. Windows 10",
  },
  {
    key: "processor",
    label: "Processor",
    placeholder: "e.g. Intel Core i5-9600K",
  },
  {
    key: "memory",
    label: "Memory",
    placeholder: "e.g. 8 GB",
  },
  {
    key: "graphics",
    label: "Graphics",
    placeholder: "e.g. NVIDIA GeForce GTX 1060",
  },
  {
    key: "storage",
    label: "Storage",
    placeholder: "e.g. 60 GB",
  },
  {
    key: "directX",
    label: "DirectX",
    placeholder: "e.g. Version 12",
  },
  {
    key: "sound",
    label: "Sound",
    placeholder: "e.g. DirectX compatible",
  },
  {
    key: "rayTracing",
    label: "Ray Tracing",
    placeholder: "e.g. Supported",
  },
];

type Props = Readonly<{
  value: string;
  onChange: (json: string) => void;
}>;

function parseRecord(value: string): Record<string, string> {
  if (!value) return {};
  try {
    const parsed: unknown = JSON.parse(value);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const record: Record<string, string> = {};
      for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
        if (typeof v === "string") record[k] = v;
      }
      return record;
    }
  } catch {
    // Ignore malformed JSON and start empty
  }
  return {};
}

const labelCls = "text-xs text-[#8A8A8A] font-medium";

export function SpecsEditor({ value, onChange }: Props) {
  const [record, setRecord] = useState<Record<string, string>>(() =>
    parseRecord(value),
  );
  const baseId = useId();

  const update = (key: string, next: string) => {
    const updated = { ...record, [key]: next };
    setRecord(updated);
    const hasValue = Object.values(updated).some((v) => v.trim().length > 0);
    onChange(hasValue ? JSON.stringify(updated) : "");
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SPEC_FIELDS.map((field) => (
          <div key={field.key} className="flex flex-col gap-1">
            <label htmlFor={`${baseId}-${field.key}`} className={labelCls}>
              {field.label}
            </label>
            <Input
              id={`${baseId}-${field.key}`}
              value={record[field.key] ?? ""}
              onChange={(e) => update(field.key, e.target.value)}
              placeholder={field.placeholder}
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor={`${baseId}-additional`} className={labelCls}>
          Additional notes
        </label>
        <Textarea
          id={`${baseId}-additional`}
          value={record.additional ?? ""}
          onChange={(e) => update("additional", e.target.value)}
          rows={2}
          placeholder="Optional extra requirements"
        />
      </div>
    </div>
  );
}
