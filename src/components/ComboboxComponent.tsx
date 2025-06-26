import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "~/lib/utils";

type ComboboxComponentProps<T> = {
  items: T[];
  selectedValues: string[] | undefined;
  setSelectedValues: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  getItemValue: (item: T) => string;
  getItemLabel: (item: T) => string;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  description?: string;
  placeholder?: string;
  allowCustomInput?: boolean;
  onCustomValueAdd?: (value: string) => void;
  renderItem?: (item: T) => React.ReactNode;
};

export default function ComboboxComponent<T>({
  items,
  selectedValues,
  setSelectedValues,
  getItemValue,
  getItemLabel,
  inputValue,
  setInputValue,
  description,
  placeholder = "Search...",
  allowCustomInput = false,
  onCustomValueAdd,
  renderItem,
}: ComboboxComponentProps<T>) {
  const [open, setOpen] = React.useState(false);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const isValidEmail = (email: string) => {
    const regex =
      /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i;
    return regex.test(email);
  };

  const toggleSelection = (value: string) => {
    if (selectedValues?.includes(value)) {
      setSelectedValues(selectedValues.filter((v) => v !== value));
    } else {
      setSelectedValues([...(selectedValues ?? []), value]);
    }
  };

  const handleCustomInput = () => {
    const trimmed = inputValue.trim();
    if (!isValidEmail(trimmed) || selectedValues?.includes(trimmed)) return;
    if (onCustomValueAdd) {
      onCustomValueAdd(trimmed);
      setInputValue("");
    }
  };

  return (
    <div className="space-y-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {(selectedValues?.length ?? 0) > 0
              ? items
                  .filter((item) =>
                    selectedValues?.includes(getItemValue(item)),
                  )
                  .map((item) => getItemLabel(item))
                  .join(", ")
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput
              ref={inputRef}
              placeholder={placeholder}
              value={inputValue}
              onValueChange={setInputValue}
              onKeyDown={(e) => {
                if (
                  e.key === " " &&
                  allowCustomInput &&
                  isValidEmail(inputValue)
                ) {
                  e.preventDefault();
                  handleCustomInput();
                }
              }}
            />
            <CommandList>
              {/* <CommandEmpty>No results found.</CommandEmpty> */}
              <CommandGroup>
                {items.map((item) => {
                  const value = getItemValue(item);
                  const label = getItemLabel(item);

                  return (
                    <CommandItem
                      key={value}
                      value={value}
                      onSelect={() => toggleSelection(value)}
                    >
                      {/* {renderItem ? renderItem(item) : label} */}
                      <span className="truncate">{label}</span>
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedValues?.includes(value)
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  );
                })}

                {allowCustomInput &&
                  isValidEmail(inputValue.trim()) &&
                  !selectedValues?.includes(inputValue.trim()) && (
                    <CommandItem
                      value="custom"
                      className="text-blue-600"
                      onSelect={handleCustomInput}
                    >
                      Invite “{inputValue.trim()}”
                    </CommandItem>
                  )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {description && (
        <p className="text-muted-foreground text-sm">{description}</p>
      )}
    </div>
  );
}
