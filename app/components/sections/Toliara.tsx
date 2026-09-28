import Image from "next/image";
import logoToliara from "@/app/assets/logo-toliara.png";
import { Container } from "@/app/components/ui/Container";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { Card } from "@/app/components/ui/Card";
import { CreditedImage } from "@/app/components/ui/CreditedImage";
import { Pill } from "@/app/components/ui/Pill";
import { Reveal } from "@/app/components/Reveal";

export function Toliara() {
  return (
    <section id="toliara">
      <Container py="section">
        <Reveal className="flex flex-wrap gap-x-[clamp(32px,5vw,80px)] gap-y-12">
          <div className="flex flex-1 basis-[380px] flex-col gap-7">
            <div className="flex items-center gap-3">
              <Image src={logoToliara} alt="" className="size-[34px]" />
              <span className="text-micro text-warm-muted">(01) Toliara Handicraft</span>
            </div>
            <SectionHeading eyebrow="la vannerie" tone="warm">
              qui signe un lieu
            </SectionHeading>
            <p className="m-0 max-w-[28em] text-body text-warm-body">
              Paniers, luminaires, sets de table, rangements, tissés main en jonc de mer selon la
              technique « roulé », plus fine et plus élégante.
            </p>
            <Pill href="#contact" variant="dark" size="md" className="self-start">
              Recevoir le catalogue
            </Pill>
          </div>

          <div className="grid flex-[1.3_1_520px] grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-3">
            <Card className="flex min-h-[300px] flex-col justify-between gap-12">
              <div className="flex flex-col gap-2">
                <span className="text-[11.5px] text-warm-muted">Boutiques &amp; revendeurs</span>
                <span className="border-t border-rule pt-2.5 text-[26px] font-medium tracking-[-0.03em]">
                  A.
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                <strong className="text-[22px] leading-[1.05] font-medium tracking-[-0.02em]">
                  Pièces en
                  <br />
                  catalogue
                </strong>
                <span className="text-[13.5px] leading-[1.5] text-warm-muted">
                  Modèles éprouvés, disponibles rapidement.
                </span>
              </div>
            </Card>

            <div className="relative flex min-h-[300px] flex-col justify-between gap-12 overflow-hidden rounded-[6px] p-5 text-white">
              <CreditedImage
                src="https://images.unsplash.com/photo-1757163572008-5b12ff831b4e?auto=format&fit=crop&w=900&q=75"
                alt="Luminaire tressé en hôtel"
                sizes="(max-width: 900px) 100vw, 300px"
                credit="Photo by Raúl Mermans García on Unsplash"
                creditHref="https://unsplash.com/@raulmermans"
                creditLinks={false}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background: "linear-gradient(180deg, rgba(30,20,14,.5), rgba(30,20,14,.1) 45%, rgba(30,20,14,.72))",
                }}
              />
              <div className="relative flex flex-col gap-2">
                <span className="text-[11.5px] opacity-85">Hôtels &amp; restaurants</span>
                <span className="border-t border-white/50 pt-2.5 text-[26px] font-medium tracking-[-0.03em]">
                  B.
                </span>
              </div>
              <div className="relative flex flex-col gap-2.5">
                <strong className="text-[22px] leading-[1.05] font-medium tracking-[-0.02em]">
                  Sur mesure
                  <br />
                  hôtellerie
                </strong>
                <span className="text-[13.5px] leading-[1.5] opacity-90">
                  Dimensions, teintes, finitions pour votre lieu.
                </span>
              </div>
            </div>

            <Card className="flex min-h-[300px] flex-col justify-between gap-12">
              <div className="flex flex-col gap-2">
                <span className="text-[11.5px] text-warm-muted">Grossistes &amp; export</span>
                <span className="border-t border-rule pt-2.5 text-[26px] font-medium tracking-[-0.03em]">
                  C.
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                <strong className="text-[22px] leading-[1.05] font-medium tracking-[-0.02em]">
                  Commandes
                  <br />
                  en volume
                </strong>
                <span className="text-[13.5px] leading-[1.5] text-warm-muted">
                  Production en série, prête à l&apos;export.
                </span>
              </div>
            </Card>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
