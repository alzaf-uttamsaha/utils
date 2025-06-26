//table
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DynamicPagination from "@/components/ui/(custom)/pagination";
import NotAvailable from "../../../../../components/ui/(custom)/not-available";
import {
  SelectAllItem,
  SelectSingleItem,
  SelectedRow,
} from "@/hooks/use-select";
import { CategoryDialog } from "../_dialog";
import { DeleteDialog } from "@/components/modals/delete-dialog";
import TableActionButton from "@/components/layout/table/table-action";
import { ViewCategoryDialog } from "../_dialog/_view";

export default function CategoriesTable({ data }: any) {
  console.log("ct data", data);
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">
              <div className="flex items-center gap-6 px-2">
                <SelectAllItem
                  table="category"
                  items={data?.resources?.map((item: any) => item.id)}
                />
                <span>SL</span>
              </div>
            </TableHead>
            <TableHead>Category Name</TableHead>
            <TableHead className="">Description</TableHead>
            <TableHead className="w-[100px] text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.resources?.length > 0 ? (
            data?.resources?.map((category: any, index: number) => (
              <SelectedRow key={index} table="category" id={category?.id}>
                <TableCell>
                  <div className="flex items-center gap-6 px-2">
                    <SelectSingleItem table="category" id={category?.id} />
                    <span>
                      {(data?.meta?.current_page - 1) * data?.meta?.per_page +
                        index +
                        1}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{category?.name}</TableCell>
                <TableCell className="whitespace-normal line-clamp-1">
                  {category?.description}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2.5 justify-center">
                    <ViewCategoryDialog id={category?.id}>
                      <TableActionButton variant="view" />
                    </ViewCategoryDialog>
                    <CategoryDialog editData={category}>
                      <TableActionButton variant="edit" />
                    </CategoryDialog>
                    <DeleteDialog
                      apiUrl={`/categories/${category?.id}`}
                      table="category"
                      itemId={category?.id}
                    >
                      <TableActionButton variant="delete" />
                    </DeleteDialog>
                  </div>
                </TableCell>
              </SelectedRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4}>
                <NotAvailable />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="sm:py-[15px] pt-[6px] pb-4">
        <DynamicPagination meta={data?.meta} />
      </div>
    </div>
  );
}

//hooks
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



//use table section
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


//table row
const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(({ className, selected, ...props }, ref) => {
  const { theme } = useTheme()
  const { version } = useVersion()

  return (
    <tr
      ref={ref}
      data-state={selected ? "selected" : undefined}
      className={cn(
        "transition-colors text-xs leading-[18px] [&_td:first-child]:rounded-l [&_td:last-child]:rounded-r",
        // Selected state styling
        selected && "!bg-[#D8E8F2]",
        // Default selected state (fallback)
        "data-[state=selected]:bg-blue-300",
        className,
        {
          "text-[#2E2E2E] [&_td]:even:bg-[#EBF3F8]": theme === "v1-light" && version === "v1" && !selected,
          "text-[#142F3F] [&_td]:even:bg-[#FAFAFA]": theme === "v2-light" && version === "v2" && !selected,
          "text-white": theme === "v2-dark",
        },
      )}
      {...props}
    />
  )
})
TableRow.displayName = "TableRow"


