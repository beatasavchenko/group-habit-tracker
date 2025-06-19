import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";
import { Button } from "./ui/button";
import React from "react";
import type { Friend } from "~/lib/types";
import { cn } from "~/lib/utils";

const friends: Friend[] = [
  {
    id: 1,
    name: "Alice",
    image: "https://example.com/images/alice.jpg",
  },
  {
    id: 2,
    name: "Bob",
    image: "https://example.com/images/bob.jpg",
  },
];

type FriendsComboboxProps = {
  openGuests: boolean;
  setOpenGuests: (open: boolean) => void;
  selectedFriends: number[] | undefined;
  setSelectedFriends: React.Dispatch<
    React.SetStateAction<number[] | undefined>
  >;
  setFriendEmails: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  friendEmails: string[] | undefined;
};

export function FriendsCombobox(props: FriendsComboboxProps) {
  const {
    openGuests,
    setOpenGuests,
    selectedFriends,
    setSelectedFriends,
    setFriendEmails,
    friendEmails,
  } = props;

  const [inputValue, setInputValue] = React.useState("");

  const isValidEmail = (email: string) => {
    const regex =
      /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i;
    return regex.test(email);
  };

  function addFriendEmail(email: string) {
    const trimmed = email.trim();
    if (!isValidEmail(trimmed) || friendEmails?.includes(trimmed)) return;
    setFriendEmails([...(friendEmails ?? []), trimmed]);
    setInputValue(""); // Clear input after valid email
  }

  const inputRef = React.useRef<HTMLInputElement>(null);

  function checkValue(value: string, e: React.KeyboardEvent<HTMLInputElement>) {
    setInputValue(value);
    const regex =
      /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i;

    if (!regex.test(value.trim())) return;
    setFriendEmails([...(friendEmails ?? []), value.trim()]);
  }

  return (
    <Popover open={openGuests} onOpenChange={setOpenGuests}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={openGuests}
          className="w-full justify-between"
        >
          {selectedFriends?.length
            ? friends
                .filter((friend) => selectedFriends.includes(friend.id))
                .map((friend) => friend.name)
                .join(", ")
            : "Select friends..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            ref={inputRef}
            value={inputValue}
            onValueChange={(value: string) => setInputValue(value)}
            onKeyDown={(e) => {
              if (e.key === " ") {
                const email = inputValue.trim();
                if (isValidEmail(email)) {
                  e.preventDefault();
                  addFriendEmail(email);
                }
              }
            }}
            placeholder="Search or invite a friend..."
          />
          <CommandList>
            <CommandEmpty className="text-clip">
              Invite a friend by typing their email.
            </CommandEmpty>

            <CommandGroup>
              {/* Friend Suggestions */}
              {friends.map((friend) => (
                <CommandItem
                  key={friend.id}
                  value={friend.id.toString()}
                  onSelect={(currentValue) => {
                    const id = Number(currentValue);
                    if (selectedFriends?.includes(id)) {
                      setSelectedFriends(
                        selectedFriends.filter((f) => f !== id),
                      );
                    } else {
                      setSelectedFriends([...(selectedFriends ?? []), id]);
                    }
                  }}
                >
                  {friend.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedFriends?.includes(friend.id)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}

              {/* Email Option */}
              {isValidEmail(inputValue.trim()) &&
                !friendEmails?.includes(inputValue.trim()) && (
                  <CommandItem
                    value="email"
                    className="text-blue-600"
                    onSelect={() => addFriendEmail(inputValue.trim())}
                  >
                    Invite &quot;{inputValue.trim()}&quot; via email
                  </CommandItem>
                )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
