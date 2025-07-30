"use client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState, useTransition } from "react";

export default function GlobalSearch() {
  const [inputValue, setInputValue] = useState<string>("");
  const [debouncedValue, setDebouncedValue] = useState<string>("");
  const [mounted, setMounted] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  console.log(isPending)
  const handleSearchParams = useCallback(
    (debouncedValue: string) => {
      const params = new URLSearchParams(window.location.search);
      if (debouncedValue.length > 0) {
        params.set("q", debouncedValue);
        params.delete("page");
      } else {
        params.delete("search");
      }
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`);
      });
    },
    [pathname, router]
  );

  // EFFECT: Set Initial Params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get("q") ?? "";
    setInputValue(searchQuery);
  }, []);

  // EFFECT: Set Mounted
  useEffect(() => {
    if (debouncedValue.length > 0 && !mounted) {
      setMounted(true);
    }
  }, [debouncedValue, mounted]);

  // EFFECT: Debounce Input Value
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [inputValue]);

  // EFFECT: Search Params
  useEffect(() => {
    if (mounted) handleSearchParams(debouncedValue);
  }, [debouncedValue, handleSearchParams, mounted]);
  return (
    <div className="px-3 py-[9px] border border-border rounded-lg max-w-[369px] w-full flex items-center gap-2">
      <Search className="min-w-6 min-h-6 text-muted-300" size={24} />
      <Input
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
        className="text-sm text-muted-800 border-none p-0 focus-visible:ring-0 !h-6"
        placeholder="Search..."
      />
    </div>
  );
}
