import type { inferRouterOutputs } from "@trpc/server";
import React from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "~/components/ui/dialog";
import type { AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";

export default function DeleteMemberDialog({
  groupUsername,
  groupData,
  dialogOpen,
  setDialogOpen,
  memberIdToDelete,
  setMemberIdToDelete,
}: {
  groupUsername: string;
  groupData: inferRouterOutputs<AppRouter>["group"]["getGroupByUsername"];
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  memberIdToDelete: number | null;
  setMemberIdToDelete: React.Dispatch<React.SetStateAction<number | null>>;
}) {
  const utils = api.useUtils();

  const deleteMember = api.group.deleteGroupMember.useMutation({
    onMutate: () => {
      setDialogOpen(false);
      setMemberIdToDelete(null);
      toast.loading("Deleting group member...");
    },
    onSuccess: (data) => {
      toast.dismiss();
      toast.success("Group member deleted successfully!");
      utils.group.getGroupByUsername.invalidate({ groupUsername });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error("Error deleting group member.");
    },
  });

  return (
    <Dialog open={dialogOpen} onOpenChange={(value) => setDialogOpen(value)}>
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
  );
}
