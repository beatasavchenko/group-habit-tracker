import type { inferRouterOutputs } from "@trpc/server";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import ComboboxComponent from "~/components/ComboboxComponent";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { SelectedValue } from "~/lib/types";
import type { AppRouter } from "~/server/api/root";
import type { DB_UserType } from "~/server/db/schema";
import { api } from "~/trpc/react";

export default function AddGroupMembersDialog({
  groupUsername,
  groupData,
  dialogOpen,
  setDialogOpen,
}: {
  groupData: inferRouterOutputs<AppRouter>["group"]["getGroupByUsername"];
  groupUsername: string;
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const utils = api.useUtils();

  const [selectedFriends, setSelectedFriends] = useState<
    { usernameOrEmail: string; role: "admin" | "member" }[]
  >([]);

  const [friendInputValue, setFriendInputValue] = useState("");

  const [debouncedValue, setDebouncedValue] = useState(friendInputValue);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(friendInputValue), 300);
    return () => clearTimeout(timeout);
  }, [friendInputValue]);

  const friendsQuery = api.user.getUsersByUsernameOrEmailForGroup.useQuery(
    { username: debouncedValue, groupId: Number(groupData?.group.id) },
    { enabled: debouncedValue.length > 1 },
  );

  const addGroupMembers = api.group.addGroupMembers.useMutation({
    onMutate: () => {
      toast.loading("Adding group members...");
    },
    onSuccess: (data) => {
      setSelectedFriends([]);
      setDialogOpen(false);
      toast.dismiss();
      toast.success("Group members added successfully!");
      utils.group.getGroupByUsername.invalidate({ groupUsername });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error("Error adding group members.");
    },
  });

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="flex w-full flex-col items-center justify-center">
        <DialogTitle>Add new members</DialogTitle>
        <ScrollArea className="flex h-[40vh] w-full flex-col items-center gap-4">
          <ComboboxComponent
            items={friendsQuery.data ?? []}
            selectedValues={selectedFriends?.map(
              (item) => item as SelectedValue,
            )}
            setSelectedValues={(value) => {
              setSelectedFriends(value);
            }}
            getItemValue={(friend: DB_UserType) => friend.username}
            getItemImage={(friend: DB_UserType) => friend.image}
            getItemLabel={(friend: DB_UserType) => friend.username}
            inputValue={friendInputValue}
            setInputValue={setFriendInputValue}
            placeholder="Search or invite..."
            allowCustomInput
            onCustomValueAdd={(email) => ({
              usernameOrEmail: email,
              role: "member",
            })}
          />
          {(selectedFriends?.length ?? 0) > 0 && (
            <div className="mt-4 w-full">
              <h1 className="mb-2 truncate text-3xl font-bold">
                Members to add
              </h1>
              {/* <SelectedFriends /> */}
              <div className="flex flex-col gap-2">
                {selectedFriends?.map((friend) => (
                  <div
                    className="flex items-center justify-between"
                    key={friend.usernameOrEmail}
                  >
                    {friend.usernameOrEmail}
                    <Select
                      value={friend.role ?? "member"}
                      // value={"member"}
                      onValueChange={(value) => {
                        setSelectedFriends((prev) => {
                          prev.map((v) =>
                            v.usernameOrEmail === friend.usernameOrEmail
                              ? {
                                  usernameOrEmail: v.usernameOrEmail,
                                  role: value as "member" | "admin",
                                }
                              : v,
                          );
                          return prev;
                        });
                      }}
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    {/* <Avatar className="h-8 w-8 rounded-full">
                      <AvatarImage src={image ?? undefined} alt={value} />
                      <AvatarFallback className="rounded-full">
                        {friend.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate">{label}</span> */}
                  </div>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                addGroupMembers.mutate({
                  groupId: Number(groupData?.group.id),
                  groupUsername: String(groupData?.group.groupUsername),
                  members: selectedFriends ?? [],
                })
              }
            >
              Save
            </Button>
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
