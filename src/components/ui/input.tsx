import * as React from "react";

import { cn } from "~/lib/utils";

type InputProps = React.ComponentProps<"input"> & {
  prefix?: React.ReactNode;
  postfix?: React.ReactNode;
};

export function Input({
  className,
  type,
  prefix,
  postfix,
  ...props
}: InputProps) {
  return (
    <div
      className={cn(
        "border-input focus-within:ring-ring/50 focus-within:border-ring dark:bg-input/30 flex h-9 w-full items-center rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-colors focus-within:ring-2 md:text-sm",
        !prefix && !postfix && className,
      )}
    >
      {prefix && (
        <span className="text-muted-foreground mr-2 flex-shrink-0">
          {prefix}
        </span>
      )}
      <input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-full w-full bg-transparent outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
      {postfix && (
        <span className="text-muted-foreground mr-2 flex-shrink-0">
          {postfix}
        </span>
      )}
    </div>
  );
}
