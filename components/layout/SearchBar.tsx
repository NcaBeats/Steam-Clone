"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, Command } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
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
      setTimeout(() => inputRef.current?.focus(), 100);
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
      }
    }
  };

  const trimmedQuery = query.trim();
  const showResults = trimmedQuery.length > 0;

  return (
    <Drawer swipeDirection="up" open={open} onOpenChange={setOpen}>
      <DrawerTrigger className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#272727] active:bg-[#272727] rounded-md px-3 h-8 text-sm text-[#8A8A8A] transition-colors duration-150 ease-out cursor-pointer w-48 md:w-64">
        <Search className="size-4" />
        <span className="hidden md:inline">Search</span>
        <kbd className="hidden md:inline-flex items-center gap-0.5 ml-auto text-[10px] text-[#5A5A5A] border border-[#2A2A2A] rounded px-1.5 py-0.5">
          <Command className="size-3" />K
        </kbd>
      </DrawerTrigger>
      <DrawerContent>
        <div className="space-y-4 p-4">
          <div className="relative max-w-3xl mx-auto">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 size-5 text-muted-foreground" />
            <Input
              ref={inputRef}
              className="h-12 pl-10 text-base bg-[#1A1A1A] border-[#2A2A2A] hover:bg-[#272727] focus-visible:bg-[#272727] focus-visible:border-[#2A2A2A] text-[#FAFAFA] placeholder:text-[#5A5A5A]"
              placeholder="Search for games..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {loading && (
              <Loader2
                className="-translate-y-1/2 absolute top-1/2 right-3 animate-spin text-muted-foreground"
                size={18}
              />
            )}
          </div>

          {showResults && (
            <div className="max-w-3xl mx-auto max-h-[60vh] overflow-y-auto px-1 py-3">
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
                  <DrawerClose
                    className="w-full text-left px-3 py-2 mt-3 text-xs text-[#007AFF] hover:bg-[#1A1A1A] active:bg-[#1A1A1A] rounded-md cursor-pointer border-t border-[#2A2A2A]"
                    onClick={() => {
                      router.push(
                        `/search?q=${encodeURIComponent(trimmedQuery)}`,
                      );
                    }}
                  >
                    View all results for &quot;{trimmedQuery}&quot; →
                  </DrawerClose>
                </>
              )}
            </div>
          )}

          {!showResults && (
            <div className="max-w-3xl mx-auto">
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
      </DrawerContent>
    </Drawer>
  );
};
