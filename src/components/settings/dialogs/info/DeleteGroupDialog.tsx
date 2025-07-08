import { useRouter } from "next/navigation";
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
import { api } from "~/trpc/react";

export default function DeleteGroupDialog({
  groupId,
  dialogOpen,
  setDialogOpen,
}: {
  groupId: number;
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const utils = api.useUtils();
  const router = useRouter();

  const deleteGroup = api.group.deleteGroup.useMutation({
    onMutate: () => {
      setDialogOpen(false);
      toast.loading("Deleting group...");
    },
    onSuccess: (data) => {
      toast.dismiss();
      toast.success("Group deleted successfully!");
      router.push("/app/dashboard");
    },
    onError: (error) => {
      toast.dismiss();
      toast.error("Error deleting group.");
    },
  });

  return (
    <Dialog open={dialogOpen} onOpenChange={(value) => setDialogOpen(value)}>
      <DialogContent>
        <DialogTitle>Delete a group</DialogTitle>
        <div>Are you sure? This action is irreversible.</div>
        <DialogFooter>
          <DialogClose>Close</DialogClose>
          <Button
            onClick={() => {
              deleteGroup.mutate({
                groupId,
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
