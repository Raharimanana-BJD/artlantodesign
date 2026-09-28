import Image from "next/image";
import logoOraura from "@/app/assets/logo-oraura.jpg";
import { Container } from "@/app/components/ui/Container";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { CreditedImage } from "@/app/components/ui/CreditedImage";
import { Pill } from "@/app/components/ui/Pill";
import { Reveal } from "@/app/components/Reveal";

const LIST = [
  { n: "01", label: "Eat", color: "text-oraura-gold", desc: "Grillades et cuisine généreuse." },
  { n: "02", label: "Drink", color: "text-oraura-green", desc: "Cocktails, jus frais, bar lounge." },
  { n: "03", label: "Meet", color: "text-oraura-green", desc: "Rendez vous d'affaires, afterworks." },
  {
    n: "04",
    label: "with purpose",
    color: "text-oraura-gold font-serif italic font-normal",
    desc: "Un lieu qui soutient le local.",
  },
];

export function OrAura() {
  return (
    <section id="oraura" className="bg-oraura-bg text-warm-cream">
      <Container py="section">
        <Reveal className="mb-[clamp(48px,6vw,80px)] flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image src={logoOraura} alt="" className="size-8.5 rounded-full" />
            <span className="text-micro text-oraura-muted">
              (03) Or&apos;Aura, The Lounge Grill &amp; Hub Restaurant
            </span>
          </div>
          <Pill href="#contact" variant="gold" size="md">
            Réserver une table
          </Pill>
        </Reveal>

        <SectionHeading eyebrow="the lounge grill" tone="gold" className="mb-[clamp(48px,6vw,80px)]">
          &amp; hub restaurant
        </SectionHeading>

        <Reveal className="flex flex-wrap items-stretch gap-x-[clamp(32px,5vw,80px)] gap-y-12">
          <figure className="m-0 flex flex-1 basis-105 flex-col gap-3">
            <div className="relative min-h-[clamp(420px,46vw,640px)] flex-1 overflow-hidden rounded-md">
              <CreditedImage
                src="https://images.unsplash.com/photo-1552566626-2d907dab0dff?auto=format&fit=crop&w=1600&q=75"
                alt="La salle Or'Aura en soirée"
                sizes="(max-width: 900px) 100vw, 700px"
                credit="Photo by Nick Karvounis on Unsplash"
                creditHref="https://unsplash.com/@nickkarvounis"
              />
            </div>
            <figcaption className="flex justify-between text-xs text-oraura-muted-2">
              <span>La salle</span>
              <span>Or&apos;Aura</span>
            </figcaption>
          </figure>

          <div className="flex flex-1 basis-110 flex-col justify-between gap-12">
            <p className="m-0 max-w-[28em] text-body text-oraura-muted">
              Cuisine au grill, bar lounge et lieu de rencontre. Pour vos dîners d&apos;affaires,
              afterworks, séminaires et événements privés.
            </p>

            <div className="flex flex-col border-b border-rule-inverse">
              {LIST.map((item) => (
                <div
                  key={item.n}
                  className="grid grid-cols-[44px_1fr_1fr] items-baseline gap-4 border-t border-rule-inverse py-5.5"
                >
                  <span className="text-xs text-oraura-muted-2">{item.n}</span>
                  <span className={`text-[clamp(34px,3.6vw,56px)] leading-[0.9] tracking-[-0.04em] ${item.color}`}>
                    {item.label}
                  </span>
                  <span className="max-w-[16em] justify-self-end text-right text-sm leading-[1.5] text-oraura-muted">
                    {item.desc}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-end gap-5">
              <div className="relative size-33 flex-none overflow-hidden rounded-md">
                <CreditedImage
                  src="https://images.unsplash.com/photo-1500217052183-bc01eee1a74e?auto=format&fit=crop&w=600&q=75"
                  alt="Cocktail signature"
                  sizes="132px"
                  credit="Photo by Jakub Dziubak on Unsplash"
                  creditHref="https://unsplash.com/@jckbck"
                />
              </div>
              <div className="flex flex-1 basis-55 flex-col gap-3.5">
                <span className="text-[13px] leading-[1.5] text-oraura-muted">
                  Privatisation possible pour vos équipes et partenaires.
                </span>
                <Pill href="#contact" variant="ghost" size="sm" className="self-start">
                  Privatiser l&apos;espace
                </Pill>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
