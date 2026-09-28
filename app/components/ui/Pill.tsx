import { type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/app/lib/cn";

export type PillVariant = "dark" | "cream" | "sage" | "gold" | "ghost";
export type PillSize = "sm" | "md" | "lg";

const VARIANT_CLASSES: Record<PillVariant, string> = {
  dark: "bg-warm-ink text-warm-cream hover:bg-warm-ink-hover focus-visible:outline-warm-ink",
  cream: "bg-white text-warm-ink hover:text-warm-ink-hover focus-visible:outline-warm-ink",
  sage: "bg-sage-ink text-warm-cream hover:bg-sage-accent focus-visible:outline-warm-ink",
  gold: "bg-oraura-gold text-oraura-bg hover:bg-warm-cream focus-visible:outline-oraura-gold",
  ghost:
    "bg-transparent text-warm-cream border border-oraura-ghost-border hover:border-oraura-gold hover:text-oraura-gold focus-visible:outline-oraura-gold",
};

const ARROW_CLASSES: Record<PillVariant, string> = {
  dark: "bg-warm-cream text-warm-ink",
  cream: "bg-warm-ink text-warm-cream",
  sage: "bg-warm-cream text-sage-ink",
  gold: "bg-oraura-bg text-oraura-gold",
  ghost: "bg-warm-cream text-oraura-bg",
};

const SIZE_CLASSES: Record<PillSize, { pill: string; text: string; arrow: string }> = {
  sm: { pill: "pt-[5px] pr-[5px] pb-[5px] pl-4", text: "text-[13px]", arrow: "size-7 text-sm" },
  md: { pill: "pt-1.5 pr-1.5 pb-1.5 pl-5", text: "text-sm", arrow: "size-8 text-[15px]" },
  lg: { pill: "pt-[7px] pr-[7px] pb-[7px] pl-[22px]", text: "text-sm", arrow: "size-[34px] text-[15px]" },
};

interface PillOwnProps {
  variant?: PillVariant;
  size?: PillSize;
  children: ReactNode;
  className?: string;
}

type PillAsLink = PillOwnProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & { href: string };
type PillAsButton = PillOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & { href?: undefined };

export type PillProps = PillAsLink | PillAsButton;

export function Pill({ variant = "dark", size = "md", children, className, ...rest }: PillProps) {
  const sizing = SIZE_CLASSES[size];
  const sharedClassName = cn(
    "inline-flex w-full items-center justify-center gap-2.5 rounded-full font-semibold transition-colors duration-200 sm:w-auto",
    "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline",
    VARIANT_CLASSES[variant],
    sizing.pill,
    sizing.text,
    className,
  );
  const arrow = (
    <span
      aria-hidden="true"
      className={cn("flex flex-none items-center justify-center rounded-full", ARROW_CLASSES[variant], sizing.arrow)}
    >
      →
    </span>
  );

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchorRest } = rest as Omit<PillAsLink, keyof PillOwnProps>;
    return (
      <a href={href} className={sharedClassName} {...anchorRest}>
        {children}
        {arrow}
      </a>
    );
  }

  const buttonRest = rest as Omit<PillAsButton, keyof PillOwnProps>;
  return (
    <button type="button" className={sharedClassName} {...buttonRest}>
      {children}
      {arrow}
    </button>
  );
}
