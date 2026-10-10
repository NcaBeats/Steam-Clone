"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, SearchIcon } from "lucide-react";
import { Kbd } from "@/components/ui/kbd";
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
    const handleKey = (e: KeyboardEvent) => {
      if (
        (e.metaKey || e.ctrlKey) &&
        (e.key === "k" || e.key === "K" || e.key === "ñ" || e.key === "Ñ")
      ) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const goToGame = (id: number) => {
    setOpen(false);
    inputRef.current?.blur();
    router.push(`/games/${id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    // Con item resaltado el Autocomplete resuelve el commit (navega al juego).
    if (highlightedRef.current) return;
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const trimmedQuery = query.trim();
  const showTips = trimmedQuery.length === 0;
  const showHint = !loading && showTips;

  return (
    <div
      ref={anchorRef}
      className="w-36 sm:flex-1 sm:max-w-64 nav:max-w-56 2xl:max-w-64"
    >
      <Autocomplete<Game>
        items={results}
        filteredItems={results}
        itemToStringValue={(game) => game.name}
        value={query}
        onValueChange={(value) => setQuery(value)}
        open={open}
        onOpenChange={(value) => setOpen(value)}
        onItemHighlighted={(value) => {
          highlightedRef.current = value ?? null;
        }}
      >
        <AutocompleteInput
          ref={inputRef}
          className="w-full"
          placeholder="Search..."
          autoComplete="off"
          aria-label="Search games"
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        >
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              showHint && (
                <>
                  <Kbd>⌘</Kbd>
                  <Kbd>K</Kbd>
                </>
              )
            )}
          </InputGroupAddon>
        </AutocompleteInput>
        <AutocompleteContent
          anchor={anchorRef}
          align="start"
          side="bottom"
          sideOffset={8}
          className="w-(--anchor-width) min-w-60 p-1.5 sm:w-[min(calc(var(--anchor-width)*2),calc(100vw-2rem))]"
        >
          {showTips ? (
            <div className="px-2 py-1.5">
              <h4 className="font-medium text-muted-foreground text-xs uppercase mb-2">
                Quick tips
              </h4>
              <ul className="text-xs text-[#8A8A8A] space-y-1">
                <li>Type at least 1 character to search</li>
                <li>Press Enter to see all results</li>
                <li>Press Esc to close</li>
              </ul>
            </div>
          ) : (
            <>
              <AutocompleteList>
                {(game: Game, index: number) => (
                  <AutocompleteItem
                    key={game.id}
                    index={index}
                    value={game}
                    onClick={() => goToGame(game.id)}
                    className="cursor-pointer py-1 pr-2 pl-1 data-highlighted:bg-[#28282C] data-highlighted:text-foreground"
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
                <button
                  type="button"
                  className="w-full text-left px-3 py-2 mt-1 text-xs text-[#007AFF] hover:bg-[#1A1A1A] active:bg-[#1A1A1A] rounded-md cursor-pointer border-t border-[#2A2A2A]"
                  onClick={() => {
                    router.push(
                      `/search?q=${encodeURIComponent(trimmedQuery)}`,
                    );
                    setOpen(false);
                  }}
                >
                  View all results for &quot;{trimmedQuery}&quot; →
                </button>
              )}
            </>
          )}
        </AutocompleteContent>
      </Autocomplete>
    </div>
  );
};
