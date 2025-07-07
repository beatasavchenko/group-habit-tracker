import { SendHorizontal } from "lucide-react";
import type { AppRouter } from "~/server/api/root";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { DB_MessageType_Zod_Create } from "~/lib/types";
import { useForm } from "react-hook-form";
import type z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import type { inferRouterOutputs } from "@trpc/server";
import { info } from "console";

type MessageBarProps = {
  info?: inferRouterOutputs<AppRouter>["group"]["getGroupByUsername"];
};

export const formSchema = DB_MessageType_Zod_Create.omit({
  type: true,
  groupId: true,
  userId: true,
  eventType: true,
  habitId: true,
});

export function MessageBar(props: MessageBarProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contents: "",
    },
    mode: "onChange",
  });

  const utils = api.useUtils();

  const createMessage = api.message.createMessage.useMutation({
    onSuccess: () => {
      form.reset();
      utils.message.getGroupMessages.invalidate({
        groupId: Number(props.info?.group.id),
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createMessage.mutate({
      ...values,
      type: "message",
      groupId: Number(props.info?.group.id),
    });
  }

  return (
    <Form {...form}>
      <form
        className="space-y-6 text-right"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="contents"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="static z-50 mb-7 flex w-full items-center gap-3 px-6">
                  <Input
                    {...field}
                    placeholder="Type to send a message"
                    className="h-10"
                  />
                  <Button type="submit" className="h-10 w-14">
                    <SendHorizontal />
                  </Button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
