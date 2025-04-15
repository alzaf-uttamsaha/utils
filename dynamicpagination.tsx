"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition, Suspense } from "react";
import ReactPaginate from "react-paginate";

export default function DynamicPagination({ meta }: any) {
  return (
    <Suspense fallback={<>Loading</>}>
      <Pagination meta={meta} />
    </Suspense>
  );
}

export function Pagination({ meta }: any) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = searchParams.get("page")
    ? Number(searchParams.get("page")) - 1
    : 0;
  const handlePageClick = (event: any) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", event.selected + 1);

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="flex items-center justify-end">
      {/* <p className="text-xs text-[var(--black-60)] leading-[18px]">
    Showing {meta?.from || 0}-{meta?.to || 0} from {meta?.total_items || 0}
  </p> */}
      <ReactPaginate
        breakLabel={"..."}
        onPageChange={handlePageClick}
        forcePage={currentPage}
        pageRangeDisplayed={2}
        marginPagesDisplayed={1}
        pageCount={3}
        previousLabel={
          <div className="pagination group">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.75 3L2.75 6L5.75 9"
                stroke="#101828"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M9.25 3L6.25 6L9.25 9"
                stroke="#101828"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        }
        nextLabel={
          <div className="pagination group">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.25 3C7.42157 4.17157 9.25 6 9.25 6L6.25 9"
                stroke="#101828"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2.75 3C3.92157 4.17157 5.75 6 5.75 6L2.75003 9"
                stroke="#101828"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        }
        renderOnZeroPageCount={null}
        containerClassName="flex items-center justify-end gap-x-[7.98px] select-none"
        breakLinkClassName="flex font-bold rounded-[1.994px] w-[22px] h-[22px] flex items-center justify-center"
        activeLinkClassName="!bg-primary rounded-[1.994px] size-6 flex !text-white items-center justify-center pointer-events-none"
        pageLinkClassName="text-muted-800 hover:!bg-primary-100 size-6 rounded-[1.994px] hover:!text-primary text-[10px] font-medium leading-[14px] flex items-center justify-center"
        previousLinkClassName="size-6 flex items-center justify-center hover:!bg-primary-100 rounded-[1.994px] group"
        nextLinkClassName="size-6 flex items-center hover:!bg-primary-100 rounded-[1.994px] hover:!text-primary justify-center group"
      />
    </div>
  );
}
