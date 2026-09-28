import { Container } from "@/app/components/ui/Container";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { CreditedImage } from "@/app/components/ui/CreditedImage";
import { Reveal } from "@/app/components/Reveal";
import { lanto } from "@/app/assets";

const STATS = [
  { title: "Emploi local", desc: "Priorité aux femmes, formées au tissage." },
  { title: "Zéro chimie", desc: "Fibre biodégradable, sans déchet." },
  {
    title: "Aires protégées",
    desc: "Un revenu qui allège la pression sur les ressources.",
  },
];

export function Impact() {
  return (
    <section id="impact">
      <Container py="section">
        <SectionHeading
          eyebrow="ce qui nous"
          tone="warm"
          className="mb-[clamp(48px,6vw,80px)]"
        >
          fait avancer
        </SectionHeading>

        <Reveal className="flex flex-wrap items-start gap-x-col-gap gap-y-10">
          <figure className="m-0 flex flex-none basis-65 flex-col gap-3">
            <CreditedImage
              src={lanto}
              alt="Portrait de la fondatrice"
              sizes="(max-width: 900px) 100vw, 260px"
              aspect="1/1.2"
            />
            <figcaption className="flex flex-col gap-0.5 text-[13px]">
              <strong className="font-semibold">
                Lantoniaina Malala Rakotoarivelo
              </strong>
              <span className="text-warm-muted">
                Fondatrice, Art Lanto Design
              </span>
            </figcaption>
          </figure>

          <div className="flex flex-1 basis-120 flex-col gap-12">
            <blockquote className="m-0 max-w-[22em] font-serif text-quote tracking-quote">
              « La conservation des ressources naturelles ne suffit pas. Il faut
              l&apos;accompagner d&apos;activités créatrices d&apos;emplois. »
            </blockquote>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,180px),1fr))] gap-6">
              {STATS.map((s) => (
                <div
                  key={s.title}
                  className="flex flex-col gap-2 border-t border-rule pt-3.5"
                >
                  <strong className="text-[14.5px] font-semibold">
                    {s.title}
                  </strong>
                  <span className="text-[13.5px] leading-normal text-warm-muted">
                    {s.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
