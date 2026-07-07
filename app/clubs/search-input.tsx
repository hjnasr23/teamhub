"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition, useState, useEffect, useRef } from "react";

export function SearchInput({ initialQuery = "", placeholder = "Search clubs..." }: { initialQuery?: string; placeholder?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(initialQuery);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  // Sync state if URL changes externally
  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    if (urlQuery !== query) {
      setQuery(urlQuery);
    }
  }, [searchParams]);

  const handleSearch = (value: string) => {
    setQuery(value);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
          params.set("q", value);
        } else {
          params.delete("q");
        }
        router.replace(`${pathname}?${params.toString()}`);
      });
    }, 300); // 300ms debounce
  };

  return (
    <div className="relative max-w-md">
      <Search className={`absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted transition-opacity ${isPending ? "opacity-50" : "opacity-100"}`} />
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full rounded-xl border border-border-custom bg-neutral-bg py-2.5 pl-10 pr-4 text-sm text-text-dark placeholder:text-text-muted shadow-sm transition-all duration-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 dark:bg-slate-900"
      />
    </div>
  );
}
