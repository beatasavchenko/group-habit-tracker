"use client";

import {
  ArrowLeft,
  EllipsisVertical,
  Pencil,
  Trash2,
  Upload,
  UserPlus,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type SetStateAction } from "react";
import { toast } from "sonner";
import { useGroupRedirect } from "~/app/hooks/useGroupRedirect";
import { AvatarCropper } from "~/components/AvatarCropper";
import ComboboxComponent from "~/components/ComboboxComponent";
import AddGroupMembersDialog from "~/components/settings/dialogs/members/AddGroupMembersDialog";
import DeleteMemberDialog from "~/components/settings/dialogs/members/DeleteMemberDialog";
import { SelectedFriends } from "~/components/SelectedFriends";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { api } from "~/trpc/react";
import GroupInfoForm from "~/components/settings/forms/info/GroupInfoForm";
import { Button } from "~/components/ui/button";
import DeleteGroupDialog from "~/components/settings/dialogs/info/DeleteGroupDialog";
import LeaveGroupDialog from "~/components/settings/dialogs/info/LeaveGroupDialog";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

export default function Settings() {
  const params = useParams<{ id: string }>();
  const groupUsername = params.id;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteGroupDialogOpen, setDeleteGroupDialogOpen] = useState(false);
  const [leaveGroupDialogOpen, setLeaveGroupDialogOpen] = useState(false);
  const [deleteMemberDialogOpen, setDeleteMemberDialogOpen] = useState(false);

  const [memberIdToDelete, setMemberIdToDelete] = useState<number | null>(null);

  const { data: session, status } = useSession();

  const userId = session?.user?.id;

  const router = useRouter();

  const utils = api.useUtils();

  const { group: groupData, isLoading } = useGroupRedirect(groupUsername);

  const updateGroup = api.group.updateGroup.useMutation({
    onMutate: () => {
      toast.loading("Updating group image...");
    },
    onSuccess: async (data) => {
      toast.dismiss();
      toast.success("Group image updated successfully!");
      await utils.group.getGroupByUsername.invalidate({ groupUsername: params.id });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error("Error updating group image.");
    },
  });

  const isUpdating = isLoading || updateGroup.isPending;

  const { data: userData } = useSession();

  const isUserOwner =
    groupData?.groupMembers.find((member) => member.role === "owner")
      ?.userId === userData?.user.id;

  const habits = api.habit.getGroupHabits.useQuery(
    {
      groupId: Number(groupData?.group.id),
    },
    { enabled: !!groupData },
  );

  return (
    <div className="m-10 flex w-full flex-col items-center justify-center">
      <div className="flex w-[80vw] flex-col px-16">
        <div className="mb-16 flex w-full items-center justify-between">
          <div className="flex items-center gap-5">
            <ArrowLeft
              className="h-10 w-10 hover:cursor-pointer"
              onClick={() => router.push(`/app/groups/${groupUsername}`)}
            />
            <h1 className="truncate text-4xl font-bold">Group Settings</h1>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              {groupData && <EllipsisVertical className="items-end" />}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <>
                {(groupData?.groupMembers?.length ?? 0) > 1 && (
                  <DropdownMenuItem
                    onClick={() => setLeaveGroupDialogOpen(true)}
                    className="text-red-500"
                  >
                    Leave group
                  </DropdownMenuItem>
                )}
                {isUserOwner && (
                  <DropdownMenuItem
                    onClick={() => setDeleteGroupDialogOpen(true)}
                    className="text-red-500"
                  >
                    {(groupData?.groupMembers?.length ?? 0) === 1
                      ? "Delete and leave group"
                      : "Delete"}
                  </DropdownMenuItem>
                )}
              </>
            </DropdownMenuContent>
          </DropdownMenu>
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
                @{groupData?.group.groupUsername}
                <div>
                  {groupData?.groupMembers.length}{" "}
                  {groupData?.groupMembers.length === 1 ? "Member" : "Members"}
                </div>
              </>
            )}
          </div>
        </div>

        <Separator className="bg-sidebar-border my-12 w-full" />
        <Tabs defaultValue="info">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="habits">Habits</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="info">
            {groupData && <GroupInfoForm groupData={groupData} />}
          </TabsContent>
          <TabsContent value="members">
            <div className="my-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold">Members</h1>
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
          </TabsContent>
          <TabsContent value="habits">
            <div className="my-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold">Habits</h1>
            </div>
            {habits.data?.map((habit) => (
              <Card
                key={habit.id}
                className="flex items-center justify-between gap-4"
              >
                <CardContent className="flex">
                  <div className="flex">
                    <div
                      className="h-16 w-16 rounded-full"
                      style={{ backgroundColor: habit.color }}
                    />
                    <div>{habit.name}</div>
                  </div>
                  <div className="flex">
                    <Pencil />
                    <Trash2 className="text-red-500" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
      {groupData && (
        <>
          <DeleteGroupDialog
            groupId={groupData?.group.id}
            dialogOpen={deleteGroupDialogOpen}
            setDialogOpen={() =>
              setDeleteGroupDialogOpen(!deleteGroupDialogOpen)
            }
          />
          <LeaveGroupDialog
            groupId={groupData?.group.id}
            dialogOpen={leaveGroupDialogOpen}
            setDialogOpen={() => setLeaveGroupDialogOpen(!leaveGroupDialogOpen)}
          />
          <DeleteMemberDialog
            groupUsername={groupUsername}
            groupData={groupData}
            dialogOpen={deleteMemberDialogOpen}
            setDialogOpen={setDeleteMemberDialogOpen}
            memberIdToDelete={memberIdToDelete}
            setMemberIdToDelete={setMemberIdToDelete}
          />
          <AddGroupMembersDialog
            groupData={groupData}
            groupUsername={groupUsername}
            dialogOpen={dialogOpen}
            setDialogOpen={setDialogOpen}
          />
        </>
      )}
    </div>
  );
}
