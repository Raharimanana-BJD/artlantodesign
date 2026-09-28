"use client";

import { useState } from "react";
import Image from "next/image";
import logoToliara from "@/app/assets/logo-toliara.png";
import logoUniversPlante from "@/app/assets/logo-univers-plante.jpg";
import logoOraura from "@/app/assets/logo-oraura.jpg";
import { Container } from "@/app/components/ui/Container";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { CreditedImage } from "@/app/components/ui/CreditedImage";
import { Reveal } from "@/app/components/Reveal";

const MAISONS = [
  {
    n: "01",
    tag: "Vannerie · B2B",
    name: "Toliara Handicraft",
    href: "#toliara",
    logo: logoToliara,
    logoShape: "square" as const,
    desc: "Vannerie haut de gamme en jonc de mer, produite à Tuléar. Catalogue, sur mesure hôtellerie, commandes en volume.",
    src: "https://images.unsplash.com/photo-1601330862030-1e08c703ac04?auto=format&fit=crop&w=1200&q=75",
    credit: "Photo by Eduardo Rodriguez on Unsplash",
    creditHref: "https://unsplash.com/@rodriguezedm",
  },
  {
    n: "02",
    tag: "Végétal · Pro & particuliers",
    name: "Univers Plante",
    href: "#plante",
    logo: logoUniversPlante,
    logoShape: "circle-white" as const,
    desc: "Plantes d'intérieur et d'extérieur, aromatiques, arbres fruitiers, pots et accessoires.",
    src: "https://images.unsplash.com/photo-1634840742261-116441097aac?auto=format&fit=crop&w=1200&q=75",
    credit: "Photo by Kelly Ziesenis Carter on Unsplash",
    creditHref: "https://unsplash.com/@quietspaces",
  },
  {
    n: "03",
    tag: "Hospitalité · Lounge",
    name: "Or'Aura",
    href: "#oraura",
    logo: logoOraura,
    logoShape: "circle" as const,
    desc: "The Lounge Grill & Hub Restaurant. Eat, drink, meet, with purpose.",
    src: "https://images.unsplash.com/photo-1552566626-2d907dab0dff?auto=format&fit=crop&w=1200&q=75",
    credit: "Photo by Nick Karvounis on Unsplash",
    creditHref: "https://unsplash.com/@nickkarvounis",
  },
];

export function NosMaisons() {
  const [active, setActive] = useState(0);

  return (
    <section id="maisons">
      <Container py="section" className="flex flex-col">
        <div className="mb-head-gap flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="nos trois" tone="warm">
            maisons
          </SectionHeading>
          <p className="m-0 max-w-[22em] text-small text-warm-muted">
            Survolez une maison pour la découvrir. Combinez les pour un projet
            complet.
          </p>
        </div>

        <Reveal as="div" stagger={0.08} className="flex flex-wrap gap-3">
          {MAISONS.map((m, i) => {
            const isActive = i === active;
            return (
              <a
                key={m.href}
                href={m.href}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                style={{
                  flex: isActive ? "1.7 1 320px" : "1 1 220px",
                  transition: "flex 600ms var(--ease-house), color 300ms",
                }}
                className={cardClassName(isActive)}
              >
                {isActive && (
                  <>
                    <div className="absolute inset-0">
                      <CreditedImage
                        src={m.src}
                        alt={m.name}
                        sizes="(max-width: 900px) 100vw, 600px"
                        credit={m.credit}
                        creditHref={m.creditHref}
                        creditLinks={false}
                      />
                    </div>
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(30,20,14,.55) 0%, rgba(30,20,14,.1) 45%, rgba(30,20,14,.7) 100%)",
                      }}
                    />
                  </>
                )}

                <div className="relative flex flex-col gap-2.5">
                  <span className="text-xs opacity-75">{m.tag}</span>
                  <span className="border-t border-current pt-2.5 text-2xl font-medium tracking-[-0.02em]">
                    {m.n}
                  </span>
                </div>

                <div className="relative flex flex-col gap-4">
                  <span
                    className={
                      "flex size-9.5 items-center justify-center overflow-hidden " +
                      (m.logoShape === "square" ? "" : "rounded-full") +
                      (m.logoShape === "circle-white" ? " bg-white" : "")
                    }
                  >
                    <Image
                      src={m.logo}
                      alt=""
                      className={
                        m.logoShape === "circle-white"
                          ? "h-[78%] w-[78%] object-contain"
                          : "h-full w-full object-contain"
                      }
                    />
                  </span>
                  {isActive && (
                    <span className="max-w-[24em] text-sm leading-normal text-white/90">
                      {m.desc}
                    </span>
                  )}
                  <span className="flex items-end justify-between gap-3">
                    <span className="max-w-[8em] text-[clamp(24px,2.2vw,32px)] leading-none font-medium tracking-[-0.03em]">
                      {m.name}
                    </span>
                    <span
                      className={
                        "flex size-9 flex-none items-center justify-center rounded-full text-sm " +
                        (isActive
                          ? "bg-white text-warm-ink"
                          : "border border-warm-ink/30 text-warm-ink")
                      }
                    >
                      →
                    </span>
                  </span>
                </div>
              </a>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}

function cardClassName(isActive: boolean) {
  return (
    "group relative flex min-h-[480px] flex-col justify-between gap-10 overflow-hidden rounded-[6px] p-5 box-border outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warm-ink " +
    (isActive
      ? "border border-transparent text-white"
      : "border border-rule text-warm-ink")
  );
}
