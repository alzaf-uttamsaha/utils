"use client";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDownWideNarrow } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function Sort({ label="sort" }: { label?: string }) {
  const [selectedSort, setSelectedSort] = useState("default");
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSelect = (value: string) => {
    setSelectedSort(value);

    const query = new URLSearchParams(params.toString());
    query.set(label, value);
    if (value === "default") {
      query.delete(label);
    }

    startTransition(() => {
      router.replace(`${pathname}?${query.toString()}`);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="flex border-border text-[10px] sm:text-base h-[26px] sm:h-[28px] md:h-[28px] w-[53px] sm:w-[75px] leading-5 sm:leading-6 font-normal gap-1 px-1.5 sm:px-[11px] py-0.5 text-muted-600"
          variant="outline"
        >
          <ArrowDownWideNarrow className="text-sm md:text-base" />
          Sort
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-[155px] w-full">
        <DropdownMenuGroup className="leading-[18px] text-muted-600">
          <DropdownMenuItem
            className={`text-xs px-3.5 py-2.5 focus:bg-primary-100 focus:text-primary ${selectedSort === "default" && "bg-primary-100 text-primary"}`}
            onSelect={() => handleSelect("default")}
          >
            Default
          </DropdownMenuItem>
          <DropdownMenuItem
            className={`text-xs px-3.5 py-2.5 focus:bg-primary-100 focus:text-primary ${selectedSort === "high to low" && "bg-primary-100 text-primary"}`}
            onSelect={() => handleSelect("high to low")}
          >
            Price High to Low
          </DropdownMenuItem>
          <DropdownMenuItem
            className={`text-xs px-3.5 py-2.5 focus:bg-primary-100 focus:text-primary ${selectedSort === "low to high" && "bg-primary-100 text-primary"}`}
            onSelect={() => handleSelect("low to high")}
          >
            Price Low to High
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
