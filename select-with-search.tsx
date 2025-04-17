"use client";
import {
  CommandGroup,
  CommandItem,
  CommandList,
  CommandInput
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import {
  useState,
  useRef,
  useCallback,
  type KeyboardEvent,
  useEffect
} from "react";

import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type Option = {
  label: string;
  value: string;
  icon?: string;
  numericOffset?: number;
};

type AutoCompleteProps = {
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
};

export const SelectWithSearch = ({
  options,
  value,
  onChange,
  placeholder
}: AutoCompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setOpen] = useState(false);
  const [selected, setSelected] = useState(value as string);
  const [inputValue, setInputValue] = useState<string>(
    options.find((option) => option.value === value)?.label || ""
  );

  useEffect(() => {
    setInputValue(
      options.find((option) => option.value === value)?.label || ""
    );
  }, [options, value]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (!input) {
        return;
      }

      // Keep the options displayed when the user is typing
      if (!isOpen) {
        setOpen(true);
      }

      // This is not a default behaviour of the <input /> field
      if (event.key === "Enter" && input.value !== "") {
        const optionToSelect = options.find(
          (option) => option.label === input.value
        );
        if (optionToSelect) {
          setSelected(optionToSelect.value);
          onChange?.(optionToSelect.value);
        }
      }

      if (event.key === "Escape") {
        input.blur();
      }
    },
    [isOpen, onChange, options]
  );

  const handleBlur = useCallback(() => {
    setOpen(false);
    setInputValue(
      selected
        ? (options.find((option) => option.value === selected)?.label as string)
        : ""
    );
  }, [selected, options]);

  const handleSelectOption = useCallback(
    (selectedOption: any) => {
      setInputValue(selectedOption?.label as string);

      setSelected(selectedOption?.value);
      onChange?.(selectedOption?.value);

      // This is a hack to prevent the input from being focused after the user selects an option
      // We can call this hack: "The next tick"
      setTimeout(() => {
        inputRef?.current?.blur();
      }, 0);
    },
    [onChange]
  );

  return (
    <CommandPrimitive onKeyDown={handleKeyDown} className="w-full">
      <div className="relative">
        <CommandInput
          ref={inputRef}
          value={inputValue}
          onValueChange={setInputValue}
          onBlur={handleBlur}
          onFocus={() => setOpen(true)}
          placeholder={placeholder || "Select an option"}
          className="w-full"
        />
        <X
          onClick={() => {
            setInputValue("");
            inputRef?.current?.focus();
          }}
          className={cn(
            "absolute size-4 right-2 top-1/2 -translate-y-1/2 cursor-pointer opacity-40 hover:opacity-100",
            inputValue ? "visible" : "invisible"
          )}
        />
      </div>
      <div className="relative mt-1">
        <div
          className={cn(
            "animate-in fade-in-0 zoom-in-95 absolute top-0 z-10 w-full rounded-xl bg-card outline-none",
            isOpen ? "block" : "hidden"
          )}
        >
          <CommandList className="rounded-lg ring-[0.5px]">
            {options.length > 0 ? (
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = value === option.value;
                  return (
                    <CommandItem
                      key={option.value + "-" + option.label}
                      value={option.label}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                      }}
                      onSelect={() => handleSelectOption(option)}
                      className={cn(
                        "flex w-full items-center gap-2",
                        !isSelected ? "pl-8" : null
                      )}
                    >
                      {isSelected ? <Check className="w-4" /> : null}
                      {option.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ) : null}
            <CommandPrimitive.Empty className="select-none rounded-sm px-2 py-3 text-center text-sm">
              No results found.
            </CommandPrimitive.Empty>
          </CommandList>
        </div>
      </div>
    </CommandPrimitive>
  );
};
