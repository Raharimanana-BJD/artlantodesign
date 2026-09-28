import { Container } from "@/app/components/ui/Container";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { Card } from "@/app/components/ui/Card";
import { Pill } from "@/app/components/ui/Pill";
import { Reveal } from "@/app/components/Reveal";

const STEPS = [
  { symbol: "✳", title: "Brief", desc: "Vous décrivez vos besoins, quantités, contraintes et délais." },
  { symbol: "⁘", title: "Prototype & devis", desc: "Un échantillon validé avec vous, un devis clair." },
  { symbol: "+", title: "Production", desc: "Tissage main à Tuléar, contrôle pièce par pièce." },
  { symbol: "●", title: "Livraison", desc: "Emballage soigné, à Madagascar ou à l'export." },
];

export function Processus() {
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
            <Card key={step.title} className="flex flex-col gap-10 p-5.5">
              <span className="font-serif text-3xl leading-none text-warm-ink-hover">
                {step.symbol}
              </span>
              <div className="flex flex-col gap-2">
                <strong className="text-[15.5px] font-semibold">{step.title}</strong>
                <span className="text-sm leading-[1.5] text-warm-muted">{step.desc}</span>
              </div>
            </Card>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
