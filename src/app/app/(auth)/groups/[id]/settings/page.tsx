"use client";

import { ArrowLeft, EllipsisVertical, Upload, UserPlus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useGroupRedirect } from "~/app/hooks/useGroupRedirect";
import { AvatarCropper } from "~/components/AvatarCropper";
import ComboboxComponent from "~/components/ComboboxComponent";
import { SelectedFriends } from "~/components/SelectedFriends";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import type { SelectedValue } from "~/lib/types";
import type { DB_UserType } from "~/server/db/schema";
import { api } from "~/trpc/react";

export default function Settings() {
  const params = useParams<{ id: string }>();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteMemberDialogOpen, setDeleteMemberDialogOpen] = useState(false);

  const [memberIdToDelete, setMemberIdToDelete] = useState<number | null>(null);

  const { data: session, status } = useSession();

  const userId = session?.user?.id;

  const deleteMember = api.group.deleteGroupMember.useMutation({
    onMutate: () => {
      setDeleteMemberDialogOpen(false);
      setMemberIdToDelete(null);
      toast.loading("Deleting group member...");
    },
    onSuccess: (data) => {
      toast.dismiss();
      toast.success("Group member deleted successfully!");
      utils.group.getGroupByUsername.invalidate({ groupUsername: params.id });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error("Error deleting group member.");
    },
  });

  const router = useRouter();

  const utils = api.useUtils();

  const { group: groupData, isLoading } = useGroupRedirect(params.id);

  const updateGroup = api.group.updateGroup.useMutation({
    onMutate: () => {
      toast.loading("Updating group image...");
    },
    onSuccess: (data) => {
      toast.dismiss();
      toast.success("Group image updated successfully!");
      utils.group.getGroupByUsername.invalidate({ groupUsername: params.id });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error("Error updating group image.");
    },
  });

  const isUpdating = isLoading || updateGroup.isPending;

  const [selectedFriends, setSelectedFriends] = useState<
    { usernameOrEmail: string; role: "admin" | "member" }[]
  >([]);

  const [friendEmails, setFriendEmails] = useState<string[] | undefined>();

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
      utils.group.getGroupByUsername.invalidate({ groupUsername: params.id });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error("Error adding group members.");
    },
  });

  console.log(selectedFriends);

  const [selectedOption, setSelectedOption] = useState("member");

  return (
    <div className="m-10 flex w-full flex-col items-center justify-center">
      <div className="flex w-[80vw] flex-col px-16">
        <div className="mb-16 flex w-full items-center justify-between">
          <div className="flex items-center gap-5">
            <ArrowLeft
              className="h-10 w-10 hover:cursor-pointer"
              onClick={() => router.back()}
            />
            <h1 className="truncate text-4xl font-bold">Group Settings</h1>
          </div>
          <EllipsisVertical className="items-end" />
        </div>

        <div className="flex w-full items-center gap-6">
          {isLoading ? (
            <Skeleton className="h-24 w-24 rounded-full" />
          ) : groupData ? (
            <AvatarCropper
              isLoading={isUpdating}
              name={groupData.group.name}
              initialImage={groupData.group.image ?? undefined}
              onSave={async (file) => {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("previousImage", groupData.group.image ?? "");

                const res = await fetch("/api/upload", {
                  method: "POST",
                  body: formData,
                });

                const data = await res.json();

                if (!data?.url) {
                  console.error("No URL returned from upload");
                  return;
                }

                updateGroup.mutate({
                  id: groupData.group.id,
                  image: data.url,
                });
              }}
            />
          ) : null}

          <div className="flex flex-col">
            {isLoading ? (
              <Skeleton className="h-[30px] w-[100px]" />
            ) : (
              <>
                <h1 className="truncate text-3xl font-bold">
                  {groupData?.group.name}
                </h1>
                <div>
                  {groupData?.groupMembers.length}{" "}
                  {groupData?.groupMembers.length === 1 ? "Member" : "Members"}
                </div>
              </>
            )}
          </div>
        </div>

        <Separator className="bg-sidebar-border my-12 w-full" />
        <div className="flex w-full items-center justify-between">
          <h1 className="mb-8 truncate text-4xl font-bold">Members</h1>
          <UserPlus onClick={() => setDialogOpen(true)} />
        </div>
        <div className="flex w-full flex-col gap-6">
          {groupData?.groupMembers.map((member) => (
            <div
              key={member.userId}
              className="flex w-full items-center justify-between gap-6"
            >
              <Avatar className="h-24 w-24 rounded-full">
                <AvatarImage
                  src={member.image ?? ""}
                  alt={member.name ?? member.email}
                />
                <AvatarFallback className="rounded-full">
                  {member.name?.charAt(0).toUpperCase() ??
                    member.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="relative flex w-full flex-col">
                <div className="absolute -top-3 right-0 flex">
                  <Badge className="rounded-xl px-6 text-sm">
                    {member.role}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <EllipsisVertical
                        className={
                          member.userId !== userId ? "block" : "hidden"
                        }
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel
                        onClick={() => {
                          setDeleteMemberDialogOpen(true);
                          setMemberIdToDelete(member.userId);
                        }}
                      >
                        Delete a member
                      </DropdownMenuLabel>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex flex-col">
                  <h1 className="truncate text-3xl font-bold">
                    {member.name ?? member.email}
                  </h1>
                  <div>@{member.username}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Dialog
        open={deleteMemberDialogOpen}
        onOpenChange={(value) => setDeleteMemberDialogOpen(value)}
      >
        <DialogContent>
          <DialogTitle>Delete a member</DialogTitle>
          <div>Are you sure? This action is irreversible.</div>
          <DialogFooter>
            <DialogClose>Close</DialogClose>
            <Button
              onClick={() => {
                if (memberIdToDelete)
                  deleteMember.mutate({
                    groupId: Number(groupData?.group.id),
                    groupMemberId: memberIdToDelete,
                  });
              }}
              variant="destructive"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
    </div>
  );
}
