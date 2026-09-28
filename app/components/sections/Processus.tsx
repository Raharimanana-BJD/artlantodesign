"use client";

import { useState } from "react";
import { Container } from "@/app/components/ui/Container";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { Card } from "@/app/components/ui/Card";
import { CreditedImage } from "@/app/components/ui/CreditedImage";
import { Pill } from "@/app/components/ui/Pill";
import { Reveal } from "@/app/components/Reveal";
import { sendLead } from "@/app/lib/send-lead";

const STEPS = [
  { symbol: "✳", title: "Brief", desc: "Vous décrivez vos besoins, quantités, contraintes et délais." },
  { symbol: "⁘", title: "Prototype & devis", desc: "Un échantillon validé avec vous, un devis clair." },
  { symbol: "+", title: "Production", desc: "Tissage main à Tuléar, contrôle pièce par pièce." },
  { symbol: "●", title: "Livraison", desc: "Emballage soigné, à Madagascar ou à l'export." },
];

type QuickStatus = "idle" | "submitting" | "sent" | "error";

export function Processus() {
  const [quick, setQuick] = useState("");
  const [quickWebsite, setQuickWebsite] = useState("");
  const [quickStatus, setQuickStatus] = useState<QuickStatus>("idle");

  const quickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quick.trim()) return;
    setQuickStatus("submitting");
    const result = await sendLead({ kind: "quick", phone: quick, website: quickWebsite });
    if (result === "ok") {
      setQuick("");
      setQuickStatus("sent");
    } else {
      setQuickStatus("error");
    }
  };

  const quickPlaceholder =
    quickStatus === "submitting"
      ? "Envoi…"
      : quickStatus === "sent"
        ? "Merci ! Nous vous rappelons."
        : quickStatus === "error"
          ? "Échec de l'envoi. Réessayez."
          : "Votre numéro de téléphone";

  return (
    <section id="processus">
      <Container py="section">
        <div className="mb-head-gap flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="comment" tone="warm">
            ça marche
          </SectionHeading>
          <Pill href="#contact" variant="dark" size="sm">
            Obtenir un devis
          </Pill>
        </div>

        <Reveal
          as="div"
          stagger={0.06}
          className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,230px),1fr))] gap-3"
        >
          {STEPS.map((step) => (
            <Card key={step.title} className="flex flex-col gap-10 p-[22px]">
              <span className="font-serif text-[30px] leading-none text-warm-ink-hover">
                {step.symbol}
              </span>
              <div className="flex flex-col gap-2">
                <strong className="text-[15.5px] font-semibold">{step.title}</strong>
                <span className="text-[14px] leading-[1.5] text-warm-muted">{step.desc}</span>
              </div>
            </Card>
          ))}
        </Reveal>
      </Container>

      <div className="relative overflow-hidden text-white">
        <CreditedImage
          src="https://images.unsplash.com/photo-1646170629004-b3c84a27fc17?auto=format&fit=crop&w=2400&q=70"
          alt="Texture de tissage en fond flou"
          sizes="100vw"
          credit="Photo by Clay LeConey on Unsplash"
          creditHref="https://unsplash.com/@clayleconey"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[rgba(58,36,24,.62)] backdrop-blur-[6px]"
        />
        <Reveal
          as="div"
          className="relative mx-auto flex max-w-[1440px] flex-col items-center gap-[22px] px-gutter py-band text-center"
        >
          <h2 className="m-0 text-h2 font-normal">
            Un projet en tête ?
            <br />
            Parlons-en.
          </h2>
          <p className="m-0 max-w-[28em] text-small opacity-90">
            Laissez votre numéro, nous vous rappelons pour cadrer votre besoin.
          </p>
          <form
            onSubmit={quickSubmit}
            className="mt-2 flex w-full max-w-[380px] items-center gap-1.5 rounded-full bg-white/92 p-1.5 pl-5"
          >
            <input
              type="text"
              value={quickWebsite}
              onChange={(e) => setQuickWebsite(e.target.value)}
              name="website"
              autoComplete="off"
              tabIndex={-1}
              aria-hidden="true"
              className="absolute left-[-9999px] top-auto size-px overflow-hidden"
            />
            <input
              placeholder={quickPlaceholder}
              value={quick}
              onChange={(e) => setQuick(e.target.value)}
              disabled={quickStatus === "submitting"}
              className="min-w-0 flex-1 border-0 bg-transparent py-2.5 text-warm-ink text-[14px] outline-none placeholder:text-warm-ink/45"
            />
            <button
              type="submit"
              aria-label="Envoyer"
              disabled={quickStatus === "submitting"}
              className="flex size-[38px] flex-none items-center justify-center rounded-full bg-warm-ink text-[15px] text-white transition-colors duration-200 hover:bg-warm-ink-hover disabled:opacity-70"
            >
              →
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
