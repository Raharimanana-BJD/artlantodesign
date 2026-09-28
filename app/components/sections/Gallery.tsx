"use client";

import { useState } from "react";
import { Container } from "@/app/components/ui/Container";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { CreditedImage } from "@/app/components/ui/CreditedImage";
import { Reveal } from "@/app/components/Reveal";

const GALLERY = [
  {
    title: "Rangements tressés",
    house: "Toliara Handicraft",
    cap: "Rangements en jonc de mer, tissés main à Tuléar pour boutiques et hôtels.",
    src: "https://images.unsplash.com/photo-1601330862030-1e08c703ac04?auto=format&fit=crop&w=900&q=75",
    credit: "Photo by Eduardo Rodriguez on Unsplash",
    creditHref: "https://unsplash.com/@rodriguezedm",
  },
  {
    title: "Luminaire suspendu",
    house: "Toliara Handicraft",
    cap: "Suspensions sur mesure pour lobbies, restaurants et terrasses.",
    src: "https://images.unsplash.com/photo-1757163572008-5b12ff831b4e?auto=format&fit=crop&w=900&q=75",
    credit: "Photo by Raúl Mermans García on Unsplash",
    creditHref: "https://unsplash.com/@raulmermans",
  },
  {
    title: "Art de la table",
    house: "Toliara Handicraft",
    cap: "Sets de table et corbeilles pour la restauration.",
    src: "https://images.unsplash.com/photo-1544914167-c71759753c6d?auto=format&fit=crop&w=900&q=75",
    credit: "Photo by AfriMod Studio on Unsplash",
    creditHref: "https://unsplash.com/@afrimod",
  },
  {
    title: "Détail du tissage",
    house: "Toliara Handicraft",
    cap: "La technique « roulé » : une trame plus fine, plus régulière.",
    src: "https://images.unsplash.com/photo-1646170629004-b3c84a27fc17?auto=format&fit=crop&w=900&q=75",
    credit: "Photo by Clay LeConey on Unsplash",
    creditHref: "https://unsplash.com/@clayleconey",
  },
  {
    title: "Plantes & pots",
    house: "Univers Plante",
    cap: "Composition végétale pour espaces d'accueil.",
    src: "https://images.unsplash.com/photo-1634840742261-116441097aac?auto=format&fit=crop&w=900&q=75",
    credit: "Photo by Kelly Ziesenis Carter on Unsplash",
    creditHref: "https://unsplash.com/@quietspaces",
  },
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function Gallery() {
  const [index, setIndex] = useState(0);
  const current = GALLERY[index];

  const prev = () => setIndex((i) => (i - 1 + GALLERY.length) % GALLERY.length);
  const next = () => setIndex((i) => (i + 1) % GALLERY.length);

  return (
    <section aria-label="Réalisations">
      <Container py="section">
        <Reveal className="flex flex-wrap gap-x-[clamp(32px,5vw,80px)] gap-y-10">
          <div className="flex flex-none basis-75 flex-col justify-between gap-10">
            <div className="flex flex-col gap-7">
              <SectionHeading eyebrow="nos" tone="warm">
                pièces
              </SectionHeading>
              <div className="flex items-baseline gap-1 font-light tracking-[-0.04em]">
                <span className="text-[56px] leading-none">{pad(index + 1)}</span>
                <span className="text-[22px] text-warm-muted">/{pad(GALLERY.length)}</span>
              </div>
              <p className="m-0 max-w-[20em] text-[14.5px] leading-[1.55] text-warm-body">
                {current.cap}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Pièce précédente"
                onClick={prev}
                className="flex size-10 items-center justify-center rounded-full border border-warm-ink/30 text-small text-warm-ink transition-colors duration-200 hover:bg-warm-ink hover:text-white"
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Pièce suivante"
                onClick={next}
                className="flex size-10 items-center justify-center rounded-full border border-warm-ink/30 text-small text-warm-ink transition-colors duration-200 hover:bg-warm-ink hover:text-white"
              >
                →
              </button>
            </div>
          </div>

          <div className="min-w-0 flex-1 basis-130 overflow-hidden">
            <div
              className="flex gap-3"
              style={{
                transform: `translateX(calc(${-index} * (min(340px, 72vw) + 12px)))`,
                transition: "transform 700ms var(--ease-house)",
              }}
            >
              {GALLERY.map((g) => (
                <figure key={g.title} className="m-0 flex flex-none flex-col gap-2.5" style={{ flexBasis: "min(340px, 72vw)" }}>
                  <CreditedImage
                    src={g.src}
                    alt={g.title}
                    sizes="(max-width: 900px) 72vw, 340px"
                    aspect="4/5"
                    credit={g.credit}
                    creditHref={g.creditHref}
                  />
                  <figcaption className="flex justify-between gap-3 text-micro text-warm-muted">
                    <span>{g.title}</span>
                    <span>{g.house}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
