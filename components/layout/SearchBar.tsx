"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, SearchIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "cn";
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "@/components/ui/autocomplete";
import { InputGroupAddon } from "@/components/ui/input-group";
import { SearchGameRow } from "@/components/games/SearchGameRow";
import { searchGamesClient } from "@/lib/api/search";
import type { Game } from "@/types";

export const SearchBar = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const highlightedRef = useRef<Game | null>(null);
  const keyboardRef = useRef(false);
  const [kbFocus, setKbFocus] = useState(false);

  useEffect(() => {
    if (open) {
      if (document.activeElement !== inputRef.current) {
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    } else {
      /* eslint-disable react-hooks/set-state-in-effect */
      setQuery("");
      setResults([]);
      /* eslint-enable react-hooks/set-state-in-effect */
    }
  }, [open]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const trimmed = query.trim();
    if (!trimmed) {
      /* eslint-disable react-hooks/set-state-in-effect */
      setResults([]);
      setLoading(false);
      /* eslint-enable react-hooks/set-state-in-effect */
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await searchGamesClient(trimmed);
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") keyboardRef.current = true;
    };
    const onPointerDown = () => {
      keyboardRef.current = false;
      if (document.activeElement === inputRef.current) {
        setKbFocus(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  const goToGame = (id: number) => {
    setOpen(false);
    inputRef.current?.blur();
    router.push(`/games/${id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    // Con resaltado, el commit lo resuelve el Autocomplete.
    if (highlightedRef.current) return;
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/catalog?q=${encodeURIComponent(trimmed)}`);
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const trimmedQuery = query.trim();

  return (
    <div
      ref={anchorRef}
      data-kb={kbFocus}
      className={cn(
        "w-36 sm:flex-1 sm:max-w-64 nav:max-w-56 2xl:max-w-64",
        "data-[kb=false]:[&_[data-slot=input-group]:has([data-slot=input-group-control]:focus-visible)]:border-input",
        "data-[kb=false]:[&_[data-slot=input-group]:has([data-slot=input-group-control]:focus-visible)]:ring-0",
      )}
    >
      <Autocomplete<Game>
        items={results}
        filteredItems={results}
        itemToStringValue={(game) => game.name}
        value={query}
        onValueChange={(value) => {
          setQuery(value);
          setOpen(value.trim().length > 0);
        }}
        open={open}
        onOpenChange={(value) => setOpen(value)}
        onItemHighlighted={(value) => {
          highlightedRef.current = value ?? null;
        }}
      >
        <AutocompleteInput
          ref={inputRef}
          className="w-full"
          placeholder="Search"
          autoComplete="off"
          aria-label="Search games"
          onFocus={() => setKbFocus(keyboardRef.current)}
          onBlur={() => setKbFocus(false)}
          onKeyDown={handleKeyDown}
        >
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            {loading && <Loader2 className="animate-spin" size={16} />}
          </InputGroupAddon>
        </AutocompleteInput>
        <AutocompleteContent
          anchor={anchorRef}
          align="start"
          side="bottom"
          sideOffset={8}
          className="w-(--anchor-width) min-w-60 bg-[#101014]/70 backdrop-blur-xl p-1.5 sm:w-[min(calc(var(--anchor-width)*2),calc(100vw-2rem))]"
        >
          <AutocompleteList>
            {(game: Game, index: number) => (
              <AutocompleteItem
                key={game.id}
                index={index}
                value={game}
                onClick={() => goToGame(game.id)}
                className="duration-150 ease-in-out transition-all cursor-pointer p-2 data-highlighted:bg-[#3F3F43] data-highlighted:text-foreground"
              >
                <SearchGameRow
                  name={game.name}
                  price={game.price}
                  originalPrice={game.originalPrice}
                  discountPercent={game.discountPercent}
                  imageUrl={game.imageUrl}
                />
              </AutocompleteItem>
            )}
          </AutocompleteList>
          <AutocompleteEmpty className="px-2 py-6 text-center text-sm text-[#8A8A8A]">
            {!loading ? `No results for "${trimmedQuery}"` : null}
          </AutocompleteEmpty>
          {!loading && results.length > 0 && (
            <Link
              href={`/catalog?q=${encodeURIComponent(trimmedQuery)}`}
              onClick={() => setOpen(false)}
              className="inline-block text-left px-3 py-2 mt-1 text-sm text-[#A1A1A1] rounded-md cursor-pointer hover:text-white hover:underline"
            >
              View all results for &quot;{trimmedQuery}&quot; →
            </Link>
          )}
        </AutocompleteContent>
      </Autocomplete>
    </div>
  );
};
