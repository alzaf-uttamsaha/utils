//table-header.tsx
"use client";
import Search from "@/components/ui/(custom)/search";
import { Button } from "@/components/ui/button";
import { useSelect } from "@/hooks/use-select";
import { Plus, Trash2 } from "lucide-react";
import { DeleteDialog } from "@/components/modals/delete-dialog";
import { BrandsDialog } from "../_dialog";

export default function BrandsHeader() {
  const { getSelectedItems } = useSelect("brands");
  const data = {
    brand_ids: getSelectedItems(),
  };
  return (
    <div className="mb-3 sm:mb-0">
      <div className="mb-4 sm:mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <p className="text-sm leading-5 font-medium text-[var(--secondary)]">
            All Brand
          </p>
          {getSelectedItems().length > 0 && (
            <div className="text-primary flex items-center gap-[15px]">
              <span className="text-xs leading-[18px]">
                {getSelectedItems()?.length}{" "}
                <span className="hidden sm:inline-block">Selected</span>
              </span>
              <DeleteDialog
                title="Delete Brands?"
                sub_title="Are you sure you want to delete these brands! "
                note="This can't be undone and may affect products."
                method="POST"
                apiUrl="/brands/bulk-delete"
                data={data}
                table="brands"
              >
                <Button variant={"delete"} className="h-[26px] !text-red-500">
                  <Trash2 className="size-3 stroke-[var(--danger)]" />
                  {/* <span className=" sm:block text-xs leading-[18px] font-medium !text-red-500 relative z-[999999]">
                    Delete
                  </span> */}
                </Button>
              </DeleteDialog>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <Search />
          </div>
          <BrandsDialog>
            <Button
              variant="primary"
              className="w-[115px] md:h-7 h-[30px] font-normal flex items-center gap-[5px] justify-center"
            >
              <Plus className="size-[18px] stroke-white" /> Add Brand
            </Button>
          </BrandsDialog>
        </div>
      </div>
      <div className="sm:hidden">
        <Search />
      </div>
    </div>
  );
}



//multi-delete-dialog.tsx
"use client";

import type React from "react";

import { ModalDeleteIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { fetcher } from "@/lib/actions/fetcher";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { AlertCircleIcon, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelect } from "@/hooks/use-select";

export function DeleteDialog({
  children,
  apiUrl,
  title,
  sub_title,
  note,
  data = [],
  method = "DELETE",
  table = "category", // Add table prop to identify which table's selections to clear
  itemId, // Single item ID for individual deletions
}: {
  children: React.ReactNode;
  apiUrl: string;
  data?: any;
  table?: string;
  itemId?: string | number;
  method?: "DELETE" | "POST";
  title?: string;
  sub_title?: string;
  note?: string;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { clearSelections, selectItem } = useSelect(table);

  const handleDeleteItem = async () => {
    try {
      setLoading(true);
      const res = await fetcher(apiUrl, {
        method: method,
        body: data,
      });
      if (res.success) {
        // Clear selections after successful deletion
        if (itemId) {
          // If deleting a single item, just remove it from selection
          selectItem(itemId, false);
        } else {
          // If bulk delete or unclear what was deleted, clear all selections
          clearSelections();
        }

        router.refresh();
        toast.success(res.message);
        setOpen(false);
      } else {
        throw new Error(res?.message || "Error deleting item.");
      }
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setOpen(false);
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[320px]">
        <div className="py-5 w-full flex flex-col justify-center items-center max-w-[272px] mx-auto">
          <div className=" flex flex-col gap-1.5 justify-center items-center">
            <div className="w-[46px] h-[46px] rounded-full bg-[#fef2f2]   flex items-center justify-center">
              <ModalDeleteIcon />
            </div>
            <h3 className="text-base leading-6 font-medium text-[var(--sub-title)]">
              {title ? title : "Are you sure?"}
            </h3>
            <p className="text-[11px] leading-4 text-[var(--muted-60)]">
              {sub_title ? (
                sub_title
              ) : (
                <span>You&apos;re going to remove this item!</span>
              )}
            </p>
          </div>

          <div className="my-4 p-1 min-w-full bg-[#FEF3F2] text-danger text-[11px] leading-[18px] rounded flex items-start gap-1">
            <AlertCircleIcon className="size-[14px] text-danger mt-[2px]" />
            {note ? note : "This action cannot be undone."}
          </div>
          <div className="flex sm:gap-[15px] gap-3 justify-center w-full">
            <Button
              variant="secondary"
              className={cn("w-[126px]")}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteItem}
              variant="danger"
              className={"w-[126px] flex items-center gap-1.5"}
            >
              {loading && <LoaderCircle className="animate-spin" />}
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


//provider
//select-provider.tsx
"use client";

import type React from "react";
import { createContext, useContext, useState } from "react";

// Update type to accept string or number IDs
type ItemId = string | number;

type SelectionContextType = {
  selections: Record<string, Record<ItemId, boolean>>;
  selectItem: (tableId: string, itemId: ItemId, selected: boolean) => void;
  selectAll: (tableId: string, itemIds: ItemId[], selected: boolean) => void;
  isSelected: (tableId: string, itemId: ItemId) => boolean;
  isAllSelected: (tableId: string, itemIds: ItemId[]) => boolean;
  getSelectedItems: (tableId: string) => ItemId[];
  clearSelections: (tableId: string) => void;
};

const SelectionContext = createContext<SelectionContextType | undefined>(
  undefined
);

export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const [selections, setSelections] = useState<
    Record<string, Record<ItemId, boolean>>
  >({});

  const selectItem = (tableId: string, itemId: ItemId, selected: boolean) => {
    setSelections((prev) => {
      const tableSelections = { ...(prev[tableId] || {}) };
      if (selected) {
        tableSelections[itemId] = true;
      } else {
        delete tableSelections[itemId];
      }
      return { ...prev, [tableId]: tableSelections };
    });
  };

  const selectAll = (tableId: string, itemIds: ItemId[], selected: boolean) => {
    setSelections((prev) => {
      const tableSelections: Record<ItemId, boolean> = {};

      if (selected) {
        // Select all items
        itemIds?.forEach((id) => {
          tableSelections[id] = true;
        });
      }

      return { ...prev, [tableId]: tableSelections };
    });
  };

  const isSelected = (tableId: string, itemId: ItemId) => {
    return Boolean(selections[tableId]?.[itemId]);
  };

  const getSelectedItems = (tableId: string): ItemId[] => {
    if (!selections[tableId]) return [];
    return Object.keys(selections[tableId] || {}).map((id) => {
      // Convert back to number if it's a numeric string
      return !isNaN(Number(id)) && String(Number(id)) === id ? Number(id) : id;
    });
  };

  const clearSelections = (tableId: string) => {
    setSelections((prev) => {
      const newSelections = { ...prev };
      delete newSelections[tableId];
      return newSelections;
    });
  };

  const isAllSelected = (tableId: string, itemIds: ItemId[]) => {
    return (
      itemIds?.length > 0 && itemIds.every((id) => isSelected(tableId, id))
    );
  };

  return (
    <SelectionContext.Provider
      value={{
        selections,
        selectItem,
        selectAll,
        isSelected,
        isAllSelected,
        getSelectedItems,
        clearSelections,
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
}

export function useTableSelection() {
  const context = useContext(SelectionContext);
  if (context === undefined) {
    throw new Error("useSelection must be used within a SelectionProvider");
  }
  return context;
}


//use select hook.ts
"use client"

import type React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { useTableSelection } from "@/provider/select-provider"
import { useVersion } from "@/provider/theme-provider"

type ItemId = string | number

export function useSelect(tableId: string) {
  const { selectItem, selectAll, isSelected, isAllSelected, getSelectedItems, clearSelections } = useTableSelection()

  return {
    selectItem: (itemId: ItemId, selected: boolean) => selectItem(tableId, itemId, selected),
    selectAll: (itemIds: ItemId[], selected: boolean) => selectAll(tableId, itemIds, selected),
    isSelected: (itemId: ItemId) => isSelected(tableId, itemId),
    isAllSelected: (itemIds: ItemId[]) => isAllSelected(tableId, itemIds),
    getSelectedItems: () => getSelectedItems(tableId),
    clearSelections: () => clearSelections(tableId),
  }
}

export function SelectedRow({
  table,
  id,
  children,
}: {
  table: string
  id: number | string
  children: React.ReactNode
}) {
  const { isSelected } = useSelect(table)
  return <TableRow selected={isSelected(id)}>{children}</TableRow>
}

export function SelectSingleItem({
  table,
  id,
}: {
  table: string
  id: number | string
}) {
  const { isSelected, selectItem } = useSelect(table)
  return (
    <Checkbox
      className=""
      checked={isSelected(id)}
      onCheckedChange={(checked) => {
        selectItem(id, !!checked)
      }}
    />
  )
}

export function SelectAllItem({
  table,
  items,
}: {
  table: string
  items: number[] | string[]
}) {
  const { isAllSelected, selectAll } = useSelect(table)
  const { version } = useVersion()
  return (
    <Checkbox
      className={cn("", {
        "border-white data-[state=checked]:!border-white": version === "v1",
        " data-[state=checked]:!border-transparent": version === "v2",
      })}
      checked={isAllSelected(items)}
      onCheckedChange={(checked) => {
        selectAll(items, !!checked)
      }}
    />
  )
}




//shadcn table.tsx
"use client";
import * as React from "react";

import { cn } from "@/lib/utils";
import { useVersion } from "@/provider/theme-provider";
import { useTheme } from "next-themes";

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto white whitespace-nowrap">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(" bg-table-bg h-[44px] rounded [&_tr]:hover:!bg-transparent", className)}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, selected, ...props }, ref) => {
    const { theme } = useTheme();
    const { version } = useVersion();

    return (
      <tr
        ref={ref}
        data-state={selected ? "selected" : undefined}
        className={cn(
          "transition-colors   text-xs leading-[18px] [&_td:first-child]:rounded-l [&_td:last-child]:rounded-r",
          // Selected state styling
          selected && version === "v1" && "!bg-[#D8E8F2]",
          selected && version === "v2" && "!bg-[#fcf7ef]",
          // Default selected state (fallback)
          "data-[state=selected]:bg-blue-300",
          className,
          {
            "text-[#2E2E2E] [&_td]:even:bg-[#EBF3F8] hover:bg-[#f4f9fe]":
              theme === "v1-light" && version === "v1" && !selected,
            "text-[#142F3F] [&_td]:even:bg-[#FAFAFA] hover:bg-[#f3f2f2]":
              theme === "v2-light" && version === "v2" && !selected,
            "text-white hover:bg-[#0c0c0c]": theme?.includes('dark'),
          }
        )}
        {...props}
      />
    );
  }
);
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => {
  const { version } = useVersion();
  const { theme } = useTheme();
  return (
    <th
      ref={ref}
      className={cn(
        "h-[44px] p-2.5 text-left text-table-header-text align-middle font-medium [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] first:rounded-l last:rounded-r",
        className,
        {
          "border-b border-border": version === "v2" && theme == "v2-dark",
          "border-b border-[#EAEAEA]": version === "v2" && theme == "v2-light",
        },
        `${theme === "v1-dark" ? "border-b border-border" : ""}`
      )}
      {...props}
    />
  );
});
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => {
  const { theme } = useTheme();
  const { version } = useVersion();
  return (
    <td
      ref={ref}
      className={cn(
        "h-[50px] p-2.5 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
        {
          "border-b border-[#EAEAEA]": theme === "v2-light" && version === "v2",
          "border-b !border-border": theme === "v2-dark" && version === "v2",
        },
        `${theme === "v1-dark" ? "border-b border-border" : ""}`
      )}
      {...props}
    />
  );
});
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
