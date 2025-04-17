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
        itemIds.forEach((id) => {
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
        clearSelections
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
