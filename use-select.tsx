"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { TableRow } from "@/components/ui/table";
import { useTableSelection } from "@/contexts/select";

type ItemId = string | number;

export function useSelect(tableId: string) {
  const {
    selectItem,
    selectAll,
    isSelected,
    isAllSelected,
    getSelectedItems,
    clearSelections
  } = useTableSelection();

  return {
    selectItem: (itemId: ItemId, selected: boolean) =>
      selectItem(tableId, itemId, selected),
    selectAll: (itemIds: ItemId[], selected: boolean) =>
      selectAll(tableId, itemIds, selected),
    isSelected: (itemId: ItemId) => isSelected(tableId, itemId),
    isAllSelected: (itemIds: ItemId[]) => isAllSelected(tableId, itemIds),
    getSelectedItems: () => getSelectedItems(tableId),
    clearSelections: () => clearSelections(tableId)
  };
}

export function SelectedRow({
  table,
  id,
  children
}: {
  table: string;
  id: number | string;
  children: React.ReactNode;
}) {
  const { isSelected } = useSelect(table);
  return (
    <TableRow
      className={isSelected(id) ? "bg-primary-50 hover:bg-primary-50" : ""}
    >
      {children}
    </TableRow>
  );
}

export function SelectSingleItem({
  table,
  id
}: {
  table: string;
  id: number | string;
}) {
  const { isSelected, selectItem } = useSelect(table);
  return (
    <Checkbox
      checked={isSelected(id)}
      onCheckedChange={(checked) => {
        selectItem(id, !!checked);
      }}
    />
  );
}

export function SelectAllItem({
  table,
  items
}: {
  table: string;
  items: number[] | string[];
}) {
  const { isAllSelected, selectAll } = useSelect(table);
  return (
    <Checkbox
      checked={isAllSelected(items)}
      onCheckedChange={(checked) => {
        selectAll(items, !!checked);
      }}
    />
  );
}
