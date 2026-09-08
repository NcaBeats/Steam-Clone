"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Input } from "@/components/ui";

type Props = Readonly<{
  placeholder?: string;
  paramName?: string;
}>;

export function SearchInput({
  placeholder = "Search...",
  paramName = "q",
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [value, setValue] = useState(searchParams.get(paramName) ?? "");

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setValue(searchParams.get(paramName) ?? "");
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [searchParams, paramName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set(paramName, value.trim());
    } else {
      params.delete(paramName);
    }
    params.delete("page");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-sm">
      <Search
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A5A5A] pointer-events-none"
      />
      <Input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="rounded-[4px] bg-[#28282C] hover:bg-[#303036] pl-9 pr-3 py-3"
      />
    </form>
  );
}
