import Image from "next/image";
import logoUniversPlante from "@/app/assets/logo-univers-plante.jpg";
import { Container } from "@/app/components/ui/Container";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { CreditedImage } from "@/app/components/ui/CreditedImage";
import { Pill } from "@/app/components/ui/Pill";
import { Reveal } from "@/app/components/Reveal";

const CATEGORIES = [
  { name: "Plantes d'intérieur", desc: "Salons, bureaux, halls" },
  { name: "Plantes d'extérieur", desc: "Jardins, terrasses" },
  { name: "Aromatiques", desc: "Cuisine, potager" },
  { name: "Arbres fruitiers", desc: "Jeunes plants" },
  { name: "Pots & accessoires", desc: "Contenants, entretien" },
];

export function UniversPlante() {
  return (
    <section id="plante" className="bg-sage-bg text-sage-ink">
      <Container py="section">
        <Reveal className="flex flex-wrap gap-x-[clamp(32px,5vw,80px)] gap-y-12">
          <div className="flex flex-1 basis-[420px] flex-col gap-7">
            <div className="flex items-center gap-3">
              <span className="flex size-[34px] items-center justify-center overflow-hidden rounded-full bg-white">
                <Image src={logoUniversPlante} alt="" className="h-[78%] w-[78%] object-contain" />
              </span>
              <span className="text-micro text-sage-muted">(02) Univers Plante</span>
            </div>
            <SectionHeading eyebrow="des plantes qui" tone="sage">
              font vivre vos lieux
            </SectionHeading>
            <CreditedImage
              src="https://images.unsplash.com/photo-1634840742261-116441097aac?auto=format&fit=crop&w=1600&q=75"
              alt="Sélection de plantes"
              sizes="(max-width: 900px) 100vw, 600px"
              aspect="5/4"
              className="mt-3"
              credit="Photo by Kelly Ziesenis Carter on Unsplash"
              creditHref="https://unsplash.com/@quietspaces"
            />
          </div>

          <div className="flex flex-1 basis-[400px] flex-col justify-end gap-8">
            <p className="m-0 max-w-[28em] text-body text-sage-body">
              Pour votre jardin, votre terrasse ou l&apos;accueil de votre établissement. Conseil,
              sélection et accessoires au même endroit.
            </p>
            <div className="flex flex-col border-b border-sage-ink/20">
              {CATEGORIES.map((c) => (
                <a
                  key={c.name}
                  href="#contact"
                  className="group flex items-center justify-between gap-4 border-t border-sage-ink/20 py-[18px] text-sage-ink transition-[color,padding] duration-200 hover:pl-1.5 hover:text-sage-accent"
                >
                  <span className="text-[clamp(20px,1.8vw,24px)] font-medium tracking-[-0.02em]">
                    {c.name}
                  </span>
                  <span className="flex items-center gap-4 text-[13px] text-sage-muted">
                    {c.desc}
                    <span className="text-sage-ink">+</span>
                  </span>
                </a>
              ))}
            </div>
            <Pill href="#contact" variant="sage" size="md" className="self-start">
              Passer commande
            </Pill>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
