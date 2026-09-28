import { type ReactNode } from "react";
import { cn } from "@/app/lib/cn";

export interface StatTileProps {
  children: ReactNode;
  className?: string;
}

/** The borderless stat tile pattern (About): a right + bottom rule only, no radius. */
export function StatTile({ children, className }: StatTileProps) {
  return (
    <div className={cn("border-r border-b border-rule p-5", className)}>
      {children}
    </div>
  );
}
