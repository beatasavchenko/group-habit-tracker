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
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import type { SelectedValue } from "~/lib/types";

type ComboboxComponentProps<T, V = SelectedValue> = {
  items: T[];
  selectedValues: V[];
  setSelectedValues: React.Dispatch<React.SetStateAction<V[]>>;
  getItemValue: (item: T) => string;
  getItemImage?: (item: T) => string | null;
  getItemLabel: (item: T) => string;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  description?: string;
  placeholder?: string;
  allowCustomInput?: boolean;
  onCustomValueAdd?: (value: string) => V;
  renderItem?: (item: T) => React.ReactNode;
};

export default function ComboboxComponent<T>({
  items,
  selectedValues,
  setSelectedValues,
  getItemValue,
  getItemImage,
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

  const toggleSelection = (value: SelectedValue) => {
    setOpen(false);
    setSelectedValues((prev) => {
      const next = prev ?? [];
      const exists = next.some(
        (v) => v.usernameOrEmail === value.usernameOrEmail,
      );

      return exists
        ? next.filter((v) => v.usernameOrEmail !== value.usernameOrEmail)
        : [...next, value];
    });
  };

  const handleCustomInput = () => {
    const trimmed = inputValue.trim();
    if (!isValidEmail(trimmed)) return;

    if (!selectedValues?.some((v) => v.usernameOrEmail === trimmed)) {
      setSelectedValues((prev) => [
        ...(prev ?? []),
        { usernameOrEmail: trimmed, role: "member" },
      ]);
    }
    setInputValue("");
  };

  return (
    <div className="w-full space-y-1">
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
                    selectedValues?.some(
                      (v) => v.usernameOrEmail === getItemValue(item),
                    ),
                  )
                  .map((item) => getItemLabel(item))
                  .join(", ")
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="popover-content-width-full w-full p-0">
          <Command className="w-full">
            <CommandInput
              className="w-full"
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
                  const image = getItemImage ? getItemImage(item) : null;
                  const label = getItemLabel(item);

                  return (
                    <CommandItem
                      key={value}
                      value={value}
                      onSelect={(selectedValue) => {
                        console.log("selectedValue:", selectedValue);
                        toggleSelection({
                          usernameOrEmail: selectedValue,
                          role: "member",
                        });
                      }}
                    >
                      {/* {renderItem ? renderItem(item) : label} */}
                      {image ? (
                        <div>
                          <Avatar className="h-8 w-8 rounded-full">
                            <AvatarImage src={image ?? undefined} alt={value} />
                            <AvatarFallback className="rounded-full">
                              {label.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="truncate">{label}</span>
                        </div>
                      ) : (
                        <span className="truncate">{label}</span>
                      )}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedValues?.some(
                            (v) => v.usernameOrEmail === value,
                          )
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  );
                })}

                {allowCustomInput &&
                  isValidEmail(inputValue.trim()) &&
                  !selectedValues?.filter(
                    (v) => v.usernameOrEmail === inputValue.trim(),
                  ) &&
                  !items.some(
                    (item) => getItemValue(item) === inputValue.trim(),
                  ) && (
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
