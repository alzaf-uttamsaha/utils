"use client";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { useCallback, useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

export default function Filter({
  placeholder = "Filter",
  allTitle = "All",
  slug = "status",
  options,
  customClass,
}: {
  placeholder?: string;
  allTitle?: string;
  slug?: string;
  options: { label: string; value: string }[];
  customClass?: string;
}) {
  const [debouncedValue, setDebouncedValue] = useState<string>("");
  const [mounted, setMounted] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleSearchParams = useCallback(
    (debouncedValue: string) => {
      const params = new URLSearchParams(window.location.search);
      // Reset page on filter change
      params.delete("page");

      if (debouncedValue != allTitle.toLowerCase()) {
        params.set(slug, debouncedValue);
      } else {
        params.delete(slug);
      }
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`);
      });
    },
    [pathname, router, slug, allTitle]
  );

  // EFFECT: Set Initial Params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get(slug) ?? "";
    setDebouncedValue(searchQuery);
  }, [slug]);

  // EFFECT: Set Mounted
  useEffect(() => {
    if (debouncedValue.length > 0 && !mounted) {
      setMounted(true);
    }
  }, [debouncedValue, mounted]);

  // EFFECT: Search Params
  useEffect(() => {
    if (mounted) handleSearchParams(debouncedValue);
  }, [debouncedValue, handleSearchParams, mounted]);

  return (
    <Select value={debouncedValue} onValueChange={setDebouncedValue}>
      <SelectTrigger className={`${customClass}`}>
        <div className="flex items-center gap-2">
          <SelectValue placeholder={placeholder} />
          {isPending && <LoaderCircle className="animate-spin text-primary size-4" />}
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={allTitle.toLowerCase()}>{allTitle}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
