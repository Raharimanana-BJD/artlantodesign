import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/app/components/ui/Container";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { CreditedImage } from "@/app/components/ui/CreditedImage";
import { Pill } from "@/app/components/ui/Pill";
import { Reveal } from "@/app/components/Reveal";
import { cn } from "@/app/lib/cn";
import { logoToliara, logoUniversPlante, logoOraura } from "@/app/assets";
import {
  TOLIARA_PRODUCTS,
  UNIVERS_PLANTE_PRODUCTS,
  ORAURA_MENU,
  type CatalogueProduct,
} from "@/app/lib/catalogue-data";

export const metadata: Metadata = {
  title: "Catalogue & menu",
  description:
    "Le catalogue vannerie de Toliara Handicraft, la sélection de plantes d'Univers Plante, et le menu du restaurant Or'Aura.",
};

function ProductGrid({ products, muted }: { products: CatalogueProduct[]; muted: string }) {
  return (
    <Reveal
      as="div"
      stagger={0.06}
      className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-x-6 gap-y-12"
    >
      {products.map((product) => (
        <div key={product.name} className="flex flex-col gap-3">
          <CreditedImage
            src={product.image}
            alt={product.name}
            sizes="(max-width: 900px) 100vw, 320px"
            aspect="4/3"
            credit={product.credit}
            creditHref={product.creditHref}
          />
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <strong className="text-[15px] leading-[1.2] font-medium">{product.name}</strong>
              <span className={cn("text-[13px] leading-[1.4]", muted)}>{product.description}</span>
            </div>
            <span className="flex-none text-[13px] font-semibold whitespace-nowrap">{product.price}</span>
          </div>
        </div>
      ))}
    </Reveal>
  );
}

export default function CataloguePage() {
  return (
    <main>
      <Container py="section" className="flex flex-col gap-6">
        <Reveal as="div" className="flex max-w-[46em] flex-col gap-6">
          <span className="text-micro text-warm-muted">Catalogue &amp; menu</span>
          <SectionHeading eyebrow="tout ce que nous">proposons, au même endroit</SectionHeading>
          <p className="m-0 text-body text-warm-body">
            Un aperçu de nos pièces de vannerie, de notre sélection de plantes et du menu du
            restaurant Or&apos;Aura. Toutes nos pièces se déclinent aussi sur mesure, écrivez-nous
            pour un devis.
          </p>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] font-medium">
            <a href="#toliara-catalogue" className="underline decoration-1 underline-offset-4">
              Vannerie Toliara Handicraft
            </a>
            <a href="#plante-catalogue" className="underline decoration-1 underline-offset-4">
              Univers Plante
            </a>
            <a href="#oraura-menu" className="underline decoration-1 underline-offset-4">
              Menu Or&apos;Aura
            </a>
          </nav>
        </Reveal>
      </Container>

      <section id="toliara-catalogue">
        <Container py="bottom-only">
          <div className="mb-head-gap flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Image src={logoToliara} alt="" className="size-[34px]" />
                <span className="text-micro text-warm-muted">(01) Toliara Handicraft</span>
              </div>
              <SectionHeading eyebrow="la vannerie" tone="warm">
                & la décoration
              </SectionHeading>
            </div>
            <Pill href="/#contact" variant="dark" size="sm">
              Demander un devis
            </Pill>
          </div>
          <ProductGrid products={TOLIARA_PRODUCTS} muted="text-warm-muted" />
        </Container>
      </section>

      <section id="plante-catalogue" className="bg-sage-bg text-sage-ink">
        <Container py="section">
          <div className="mb-head-gap flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="flex size-[34px] items-center justify-center overflow-hidden rounded-full bg-white">
                  <Image src={logoUniversPlante} alt="" className="h-[78%] w-[78%] object-contain" />
                </span>
                <span className="text-micro text-sage-muted">(02) Univers Plante</span>
              </div>
              <SectionHeading eyebrow="des plantes qui" tone="sage">
                font vivre vos lieux
              </SectionHeading>
            </div>
            <Pill href="/#contact" variant="sage" size="sm">
              Passer commande
            </Pill>
          </div>
          <ProductGrid products={UNIVERS_PLANTE_PRODUCTS} muted="text-sage-muted" />
        </Container>
      </section>

      <section id="oraura-menu" className="bg-oraura-bg text-warm-cream">
        <Container py="section">
          <div className="mb-head-gap flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Image src={logoOraura} alt="" className="size-[34px] rounded-full" />
                <span className="text-micro text-oraura-muted">(03) Or&apos;Aura</span>
              </div>
              <SectionHeading eyebrow="the lounge grill" tone="gold">
                & hub restaurant, le menu
              </SectionHeading>
            </div>
            <Pill href="/#contact" variant="gold" size="sm">
              Réserver une table
            </Pill>
          </div>

          <Reveal as="div" className="flex flex-col gap-14">
            {ORAURA_MENU.map((category) => (
              <div key={category.name} className="flex flex-col gap-2">
                <h3 className="m-0 text-[12px] font-semibold tracking-[0.08em] text-oraura-gold uppercase">
                  {category.name}
                </h3>
                <div className="flex flex-col border-b border-rule-inverse">
                  {category.items.map((item) => (
                    <div
                      key={item.name}
                      className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-rule-inverse py-4"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="text-[16px] font-medium">{item.name}</span>
                        <span className="text-[13px] leading-[1.4] text-oraura-muted">
                          {item.description}
                        </span>
                      </div>
                      <span className="flex-none text-[14px] text-oraura-gold">{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Reveal>

          <p className="mt-10 max-w-[32em] text-[12.5px] leading-[1.6] text-oraura-muted-2">
            Menu indicatif, sous réserve de disponibilité selon arrivage. Prix en ariary (Ar),
            taxes incluses.
          </p>
        </Container>
      </section>
    </main>
  );
}
