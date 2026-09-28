import { Pill } from "@/app/components/ui/Pill";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { FOOTER_NAV_LINKS, SOCIAL_LINKS, QUOTE_CTA } from "@/app/lib/nav-links";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="overflow-hidden bg-footer-bg">
      <div className="mx-auto max-w-360 px-gutter pt-[clamp(64px,7vw,96px)]">
        <div className="flex flex-wrap justify-between gap-10">
          <div className="flex w-full flex-col gap-4.5 md:w-auto">
            <SectionHeading eyebrow="prêt à">commencer ?</SectionHeading>
            <Pill
              href={QUOTE_CTA.href}
              variant="dark"
              size="sm"
              className="self-start"
            >
              {QUOTE_CTA.label}
            </Pill>
          </div>

          <div className="flex flex-wrap gap-x-[clamp(40px,6vw,96px)] gap-y-10 text-[13.5px]">
            <div className="flex flex-col gap-2.5">
              <span className="text-xs text-warm-muted">• navigation</span>
              {FOOTER_NAV_LINKS.map((link) => (
                <a key={link.href} href={link.href} className="text-warm-ink">
                  {link.label}
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-2.5">
              <span className="text-xs text-warm-muted">• réseaux</span>
              {SOCIAL_LINKS.map((link) => (
                <a key={link.label} href={link.href} className="text-warm-ink">
                  {link.label}
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-2.5">
              <span className="text-xs text-warm-muted">• contact</span>
              <span className="text-warm-ink">
                rlanto.rakotoarivelo4@gmail.com
              </span>
              <span className="text-warm-ink">+261 34 35 573 23</span>
            </div>
          </div>
        </div>

        <div className="mt-[clamp(56px,6vw,80px)] max-md:pb-4 items-end flex flex-wrap justify-between gap-4 text-xs text-warm-muted">
          <span className="max-md:order-2">© {year} Art Lanto Design SARL</span>
          <div className="mt-3.5 max-md:order-1 text-[clamp(40px,10.6vw,152px)] leading-[0.78] font-bold tracking-[-0.06em] whitespace-nowrap text-warm-ink text-center">
            art lanto design
          </div>
          <span className="max-md:order-3">Tuléar · Madagascar</span>
        </div>
      </div>
    </footer>
  );
}
