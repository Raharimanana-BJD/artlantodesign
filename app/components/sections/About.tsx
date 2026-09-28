import { Container } from "@/app/components/ui/Container";
import { CreditedImage } from "@/app/components/ui/CreditedImage";
import { StatTile } from "@/app/components/ui/StatTile";
import { Reveal } from "@/app/components/Reveal";

export function About() {
  return (
    <section id="about">
      <Container py="section">
        <Reveal className="flex flex-wrap gap-x-[clamp(32px,5vw,80px)] gap-y-14">
          <div className="flex flex-1 flex-col gap-[clamp(40px,5vw,72px)] basis-105">
            <div className="flex flex-col gap-7">
              <span className="text-micro text-warm-muted">(à propos)</span>
              <h2 className="m-0 text-[clamp(44px,5.8vw,92px)] font-medium uppercase leading-[0.9] tracking-[-0.045em]">
                Art Lanto{" "}
                <span className="font-serif text-[0.5em] italic normal-case tracking-normal align-[0.15em]">
                  &amp;
                </span>{" "}
                Design,
              </h2>
              <p className="m-0 max-w-[29em] text-body text-warm-body">
                Nous croyons que l&apos;artisanat est plus qu&apos;un décor : il donne une âme aux
                lieux, fait vivre un territoire et raconte une origine. Trois maisons, un même
                soin du détail.
              </p>
            </div>
            <CreditedImage
              src="https://images.unsplash.com/photo-1601330862030-1e08c703ac04?auto=format&fit=crop&w=1600&q=75"
              alt="Nature morte, pièces Toliara Handicraft"
              sizes="(max-width: 900px) 100vw, 500px"
              aspect="16/10"
              credit="Photo by Eduardo Rodriguez on Unsplash"
              creditHref="https://unsplash.com/@rodriguezedm"
            />
          </div>

          <div className="grid flex-1 basis-110 grid-cols-2 self-end border-t border-l border-rule">
            <StatTile>
              <div className="flex h-full flex-col items-start justify-end gap-3">
                <span className="max-w-[11em] text-[13px] leading-[1.35] text-warm-body">
                  année de création de l&apos;atelier à Tuléar.
                </span>
                <span className="text-stat font-medium tracking-stat">2017</span>
              </div>
            </StatTile>
            <StatTile>
              <div className="flex h-full flex-col items-start justify-end gap-3">
                <span className="max-w-[10em] text-[13px] leading-[1.35] text-warm-body">
                  artisans formés au tissage « roulé ».
                </span>
                <span className="text-stat font-medium tracking-stat">~30</span>
              </div>
            </StatTile>
            <StatTile>
              <div className="flex h-full flex-col items-start justify-end gap-3">
                <span className="max-w-[10em] text-[13px] leading-[1.35] text-warm-body">
                  de nos pièces faites main, biodégradables.
                </span>
                <span className="text-stat font-medium tracking-stat">100%</span>
              </div>
            </StatTile>
            <a
              href="#impact"
              className="flex flex-col justify-between gap-6 bg-warm-ink-hover p-5 text-warm-cream transition-colors duration-200 hover:bg-[#3a2016]"
            >
              <span className="max-w-[14em] text-small font-medium leading-[1.4]">
                Le jonc de mer n&apos;est pas qu&apos;une fibre, c&apos;est un revenu pour tout un
                territoire.
              </span>
              <span className="text-[13px] underline underline-offset-4">Notre impact ›</span>
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
