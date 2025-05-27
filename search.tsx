"use client";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LoaderCircle, SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const Search = ({
  name = "q",
  className
}: {
  name?: string;
  className?: string;
}) => {
  const [inputValue, setInputValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const searchRef = useRef<HTMLInputElement>(null);

  const handleSearchParams = useCallback(
    (debouncedValue: any) => {
      const params = new URLSearchParams(window.location.search);
      if (debouncedValue.length > 0) {
        params.set(name, debouncedValue);
      } else {
        params.delete(name);
      }
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`);
      });
    },
    [pathname, router]
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get(name) ?? "";
    setInputValue(searchQuery);
  }, []);

  useEffect(() => {
    if (debouncedValue.length > 0 && !mounted) {
      setMounted(true);
    }
  }, [debouncedValue, mounted]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [inputValue]);

  useEffect(() => {
    if (mounted) handleSearchParams(debouncedValue);
  }, [debouncedValue, handleSearchParams, mounted]);

  return (
    <div className="relative w-full text-primary">
      <input
        value={inputValue || ""}
        onChange={(e) => setInputValue(e.target.value)}
        ref={searchRef}
        className={cn(
          "border-[0.5px] border-[var(--primary)] rounded-md md:rounded !w-full md:h-7 h-9 outline-none pl-6 pr-2 text-xs leading-[18px] placeholder:text-gray-400",
          className
        )}
        type="text"
        placeholder="Search.."
      />
      <div className={`absolute top-1/2 -translate-y-1/2 left-2`}>
        {isPending ? (
          <LoaderCircle className="animate-spin size-3" />
        ) : (
          <button onClick={() => searchRef.current?.focus()}>
            <SearchIcon className="size-3" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Search;
