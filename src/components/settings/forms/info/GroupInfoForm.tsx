import { zodResolver } from "@hookform/resolvers/zod";
import type { inferRouterOutputs } from "@trpc/server";
import { Check, Clipboard, ClipboardCheck, Repeat, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Partial_DB_GroupType_Zod } from "~/lib/types";
import type { AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";

export const formSchema = Partial_DB_GroupType_Zod.omit({ id: true });

export default function GroupInfoForm({
  groupData,
}: {
  groupData: inferRouterOutputs<AppRouter>["group"]["getGroupByUsername"];
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: groupData?.group.name,
      groupUsername: groupData?.group.groupUsername,
      description: groupData?.group.description ?? undefined,
      inviteCode: `${process.env.NEXT_PUBLIC_BASE_URL}app/join?code=${groupData?.group.inviteCode}`,
    },
    mode: "onChange",
  });

  const [isTextCopiedVisible, setIsTextCopiedVisible] = React.useState(false);

  const utils = api.useUtils();

  const updateGroup = api.group.updateGroup.useMutation({
    onMutate: () => {
      toast.loading("Updating group...");
    },
    onSuccess: (data) => {
      toast.dismiss();
      toast.success("Group updated successfully!");
      utils.group.getGroupByUsername.invalidate({
        groupUsername: groupData?.group.groupUsername,
      });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error("Error updating group.");
    },
  });

  console.log(form.formState.errors);

  const groupUsername = form.watch("groupUsername");

  const isUsernameAvailable = api.group.checkGroupUsernameAvailability.useQuery(
    {
      groupUsername: groupUsername as string,
    },
    { enabled: form.formState.isDirty },
  );

  useEffect(() => {
    if (!isUsernameAvailable) {
      form.setError("groupUsername", {
        message: "Group Username already exists.",
      });
    }
  }, [isUsernameAvailable]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (form.formState.isDirty && groupData)
      updateGroup.mutate({ ...values, id: groupData?.group.id });
  };

  return (
    <Form {...form}>
      <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="my-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Group Info</h1>
          <Button type="submit" disabled={!form.formState.isDirty}>
            Save
          </Button>
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input id="name" placeholder="My friend group" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="groupUsername"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Username</FormLabel>
              <FormControl>
                <Input
                  prefix={"@"}
                  postfix={
                    <span>
                      {isUsernameAvailable ? (
                        <Check className={"h-7 w-7 font-bold text-green-500"} />
                      ) : (
                        <X className={"h-7 w-7 font-bold text-red-500"} />
                      )}
                    </span>
                  }
                  id="name"
                  placeholder="mygroup"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="inviteCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Invite Link</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Input
                    disabled
                    postfix={
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span
                            onClick={(e) => {
                              e.preventDefault();
                              if (field.value) {
                                navigator.clipboard.writeText(field.value);
                                setIsTextCopiedVisible(true);
                                setTimeout(() => {
                                  setIsTextCopiedVisible(false);
                                }, 1000);
                              }
                            }}
                            className="hover:cursor-pointer"
                          >
                            {!isTextCopiedVisible ? (
                              <Clipboard className="h-5 w-5" />
                            ) : (
                              <ClipboardCheck className="h-5 w-5" />
                            )}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy</p>
                        </TooltipContent>
                      </Tooltip>
                    }
                    id="name"
                    placeholder="My friend group"
                    {...field}
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button onClick={(e) => e.preventDefault()}>
                        <Repeat />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Generate new code</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
