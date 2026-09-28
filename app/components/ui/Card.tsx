import { type ReactNode } from "react";
import { cn } from "@/app/lib/cn";

export interface CardProps {
  children: ReactNode;
  className?: string;
}

/** The bordered offer/step card pattern (Toliara Handicraft, Processus). */
export function Card({ children, className }: CardProps) {
  return (
    <div className={cn("rounded-[6px] border border-rule p-5", className)}>
      {children}
    </div>
  );
}
