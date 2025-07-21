"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme } = useTheme();

  const [selectedTheme, setSelectedTheme] = React.useState<string | undefined>(
    typeof window !== "undefined"
      ? (localStorage.getItem("theme") ?? undefined)
      : undefined,
  );

  const handleThemeChange = (theme: "light" | "dark" | "system") => {
    setSelectedTheme(theme);
    setTheme(theme);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className={`${selectedTheme === "light" ? "bg-muted" : ""}`}
          onClick={() => handleThemeChange("light")}
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          className={`${selectedTheme === "dark" ? "bg-muted" : ""}`}
          onClick={() => handleThemeChange("dark")}
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          className={`${selectedTheme === "system" ? "bg-muted" : ""}`}
          onClick={() => handleThemeChange("system")}
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
