import { CreditedImage } from "@/app/components/ui/CreditedImage";
import { Pill } from "@/app/components/ui/Pill";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden text-white"
      style={{ height: "max(660px, min(100vh, 940px))" }}
    >
      <CreditedImage
        src="https://images.unsplash.com/photo-1685257814865-447d119a29fb?auto=format&fit=crop&w=2400&q=75"
        alt="Photo plein cadre, intérieur d'hôtel avec vannerie Toliara"
        sizes="100vw"
        preload
        credit="Photo by Amy Vosters on Unsplash"
        creditHref="https://unsplash.com/@amyvosters"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(30,20,14,.5) 0%, rgba(30,20,14,.3) 40%, rgba(30,20,14,.3) 60%, rgba(30,20,14,.5) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 52%, rgba(30,20,14,.45), rgba(30,20,14,0) 75%)",
        }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-[clamp(28px,3.4vw,44px)] px-gutter pt-24 pb-27.5 text-center">
        <h1 className="m-0 text-display font-semibold uppercase tracking-display">
          <span className="block">L&apos;artisanat</span>
          <span className="block">malgache,</span>
          <span className="block">à votre échelle.</span>
        </h1>
        <p className="m-0 max-w-[30em] text-small font-medium text-shadow-[0_1px_12px_rgba(0,0,0,.3)]">
          Vannerie haut de gamme, plantes et hospitalité — un seul interlocuteur pour les hôtels,
          restaurants et distributeurs.
        </p>
        <Pill href="#contact" variant="cream" size="lg">
          Lancer mon projet
        </Pill>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-[clamp(24px,3vw,36px)]">
        <div className="mx-auto flex max-w-360 items-end justify-between gap-6 px-gutter text-micro leading-relaxed text-white/90">
          <span>
            Tuléar, Madagascar
            <br />
            Depuis 2017
          </span>
          <span className="text-right">
            Défiler
            <br />↓
          </span>
        </div>
      </div>
    </section>
  );
}
