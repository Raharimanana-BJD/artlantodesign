"use client";

import { useState } from "react";
import { Container } from "@/app/components/ui/Container";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { Pill } from "@/app/components/ui/Pill";

const FAQ = [
  {
    q: "Travaillez-vous avec les hôtels et restaurants ?",
    a: "Oui, c'est notre cœur de métier : décoration sur mesure, pièces en catalogue et accompagnement de projet, du prototype à la livraison.",
  },
  {
    q: "Peut-on personnaliser dimensions et teintes ?",
    a: "Oui. Nous réalisons un échantillon que vous validez avant de lancer la production.",
  },
  {
    q: "Livrez-vous à l'international ?",
    a: "Oui, nos pièces sont déjà livrées à des grossistes internationaux. Nous organisons emballage et expédition.",
  },
  {
    q: "Quels délais pour une commande en volume ?",
    a: "Ils dépendent des quantités et de la complexité. Nous confirmons un planning précis avec votre devis.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq">
      <Container className="flex flex-wrap gap-x-col-gap gap-y-12">
        <SectionHeading eyebrow="des questions ?" className="flex-1 basis-90">
          parlons-en
        </SectionHeading>

        <div className="flex flex-[1.3] basis-120 flex-col gap-8">
          <div className="flex flex-col border-b border-rule">
            {FAQ.map((item, i) => {
              const open = openIndex === i;
              return (
                <div key={item.q} className="border-t border-rule">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : i)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left text-[15.5px] font-medium text-warm-ink"
                  >
                    {item.q}
                    <span
                      aria-hidden="true"
                      className="flex-none text-[18px] font-light"
                    >
                      {open ? "×" : "+"}
                    </span>
                  </button>
                  {open && (
                    <p className="m-0 max-w-[46em] pr-12 pb-5.5 text-[14.5px] leading-[1.6] text-warm-muted">
                      {item.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          <Pill href="#contact" variant="dark" size="sm" className="self-start">
            Poser une question
          </Pill>
        </div>
      </Container>
    </section>
  );
}
