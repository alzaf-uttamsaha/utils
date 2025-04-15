"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface PaginationData {
  current_page?: number;
  from?: number;
  per_page?: number;
  to?: number;
  last_page?: number;
}

export default function DynamicPagination({ data }: { data?: PaginationData }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaginationComponenent data={data} />
    </Suspense>
  );
}

function PaginationComponenent({ data }: { data?: PaginationData }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const paginationData = {
    current_page: data?.current_page || Number(searchParams.get("page") || 1),
    from: data?.from || 1,
    per_page: data?.per_page || 10,
    to: data?.to || 1,
    last_page: data?.last_page || 1
  };

  const handlePageChange = (page: number) => {
    const urlsearchParams = new URLSearchParams(window.location.search);
    if (page === 1) {
      urlsearchParams.delete("page");
    } else {
      urlsearchParams.set("page", page.toString());
    }
    const newUrl = `${pathname}?${urlsearchParams.toString()}`;
    router.replace(newUrl);
  };

  const renderPageButton = (pageNumber: number) => (
    <PaginationItem key={pageNumber}>
      <PaginationLink
        href="#"
        onClick={(e) => {
          e.preventDefault();
          handlePageChange(pageNumber);
        }}
        isActive={paginationData.current_page === pageNumber}
        className="size-8"
      >
        {pageNumber}
      </PaginationLink>
    </PaginationItem>
  );

  if (paginationData.current_page === 1 && paginationData.last_page === 1)
    return null;

  return (
    <div className="w-full flex flex-col items-center space-y-2 md:flex-row md:justify-between md:space-y-0">
      <p className="text-sm text-muted-foreground whitespace-nowrap">
        Showing item {paginationData.from} to {paginationData.to}
      </p>
      <Pagination className="md:justify-end">
        <PaginationContent>
          <PaginationItem>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePageChange(1)}
              disabled={paginationData.current_page === 1}
              aria-label="Go to first page"
            >
              {"<<"}
            </Button>
          </PaginationItem>

          {paginationData.current_page > 1 + 1 && renderPageButton(1)}
          {paginationData.current_page > 1 + 2 && <PaginationEllipsis />}

          {paginationData.current_page > 1 &&
            renderPageButton(paginationData.current_page - 1)}
          {renderPageButton(paginationData.current_page)}
          {paginationData.current_page < paginationData.last_page &&
            renderPageButton(paginationData.current_page + 1)}

          {paginationData.current_page < paginationData.last_page - 2 && (
            <PaginationEllipsis />
          )}
          {paginationData.current_page < paginationData.last_page - 1 &&
            renderPageButton(paginationData.last_page)}

          <PaginationItem>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePageChange(paginationData.last_page)}
              disabled={
                paginationData.current_page === paginationData.last_page
              }
              aria-label="Go to last page"
            >
              {">>"}
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
