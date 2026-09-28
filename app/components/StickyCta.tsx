import { Pill } from "@/app/components/ui/Pill";

export function StickyCta() {
  return (
    <Pill
      href="/#contact"
      variant="dark"
      size="md"
      className="fixed right-5 bottom-5 z-60 shadow-[0_12px_32px_rgba(42,31,24,.25)]"
    >
      Devis rapide
    </Pill>
  );
}
