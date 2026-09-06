"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Input, Select, Textarea } from "@/components/ui";
import { createGameFromFormAction } from "@/actions/admin";
import type { Category } from "@/types";

type Props = Readonly<{
  categories: Category[];
}>;

export function NewGameForm({ categories }: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(async () => {
          await createGameFromFormAction(formData);
        });
      }}
      className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-6 flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-xs text-[#8A8A8A] font-medium">
          Name
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          minLength={1}
          maxLength={50}
          placeholder="Game title"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="originalPrice"
            className="text-xs text-[#8A8A8A] font-medium"
          >
            Price (USD)
          </label>
          <Input
            id="originalPrice"
            name="originalPrice"
            type="number"
            step="0.01"
            min="0"
            required
            placeholder="29.99"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="discountPercent"
            className="text-xs text-[#8A8A8A] font-medium"
          >
            Discount (%)
          </label>
          <Input
            id="discountPercent"
            name="discountPercent"
            type="number"
            min="0"
            max="100"
            placeholder="0"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor="description"
          className="text-xs text-[#8A8A8A] font-medium"
        >
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          required
          rows={4}
          placeholder="Game description..."
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="state" className="text-xs text-[#8A8A8A] font-medium">
            State
          </label>
          <Select id="state" name="state" defaultValue="AVAILABLE">
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="COMING_SOON">COMING_SOON</option>
            <option value="DISCONTINUED">DISCONTINUED</option>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="launchDate"
            className="text-xs text-[#8A8A8A] font-medium"
          >
            Launch date
          </label>
          <Input id="launchDate" name="launchDate" type="date" required />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs text-[#8A8A8A] font-medium">Categories</span>
        <div className="grid grid-cols-3 gap-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-md p-3 max-h-40 overflow-y-auto">
          {categories.map((c) => (
            <label
              key={c.id}
              className="flex items-center gap-2 text-sm text-[#FAFAFA] cursor-pointer"
            >
              <input
                type="checkbox"
                name="categories"
                value={c.name}
                className="accent-[#007AFF]"
              />
              {c.name}
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-[#007AFF] hover:bg-[#1ea4ff] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-md transition-colors"
        >
          {pending ? "Creando..." : "Crear producto"}
        </button>
        <Link
          href="/admin/games"
          className="text-[#8A8A8A] hover:text-white text-sm px-4 py-2.5"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
