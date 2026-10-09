"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, SearchIcon } from "lucide-react";
import { Kbd } from "@/components/ui/kbd";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchGameCard } from "@/components/games/SearchGameCard";
import { searchGamesClient } from "@/lib/api/search";
import type { Game } from "@/types";

export const SearchBar = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = query.trim();
      if (trimmed) {
        router.push(`/search?q=${encodeURIComponent(trimmed)}`);
        setOpen(false);
        inputRef.current?.blur();
      }
    }
  };

  const trimmedQuery = query.trim();
  const showResults = trimmedQuery.length > 0;
  const showHint = !loading && trimmedQuery.length === 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <div className="w-36 sm:flex-1 sm:max-w-64 nav:max-w-56 2xl:max-w-64" />
        }
      >
        <div className="w-full max-w-xs">
          <InputGroup>
            <InputGroupInput
              ref={inputRef}
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setOpen(true)}
              onKeyDown={handleKeyDown}
              aria-expanded={open}
              aria-label="Search games"
            />
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
          </InputGroup>
        </div>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={8}
        className="w-[min(42rem,calc(100vw-2rem))] p-4"
      >
        <div className="space-y-4">
          {showResults && (
            <div className="w-full max-h-[60vh] overflow-y-auto px-1 py-3">
              {!loading && results.length === 0 ? (
                <div className="py-6 text-center text-sm text-[#8A8A8A]">
                  No results for &quot;{trimmedQuery}&quot;
                </div>
              ) : (
                <>
                  <div
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 *:min-w-0"
                    onClick={() => setOpen(false)}
                  >
                    {results.map((game) => (
                      <SearchGameCard
                        key={game.id}
                        id={game.id}
                        name={game.name}
                        price={game.price}
                        originalPrice={game.originalPrice}
                        discountPercent={game.discountPercent}
                        imageUrl={game.imageUrl}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 mt-3 text-xs text-[#007AFF] hover:bg-[#1A1A1A] active:bg-[#1A1A1A] rounded-full cursor-pointer border-t border-[#2A2A2A]"
                    onClick={() => {
                      router.push(
                        `/search?q=${encodeURIComponent(trimmedQuery)}`,
                      );
                      setOpen(false);
                    }}
                  >
                    View all results for &quot;{trimmedQuery}&quot; →
                  </button>
                </>
              )}
            </div>
          )}

          {!showResults && (
            <div className="w-full">
              <h4 className="font-medium text-muted-foreground text-xs uppercase mb-2">
                Quick tips
              </h4>
              <ul className="text-xs text-[#8A8A8A] space-y-1">
                <li>Type at least 1 character to search</li>
                <li>Press Enter to see all results</li>
                <li>Press Esc to close</li>
              </ul>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
