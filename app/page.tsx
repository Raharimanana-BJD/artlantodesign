import { Hero } from "@/app/components/sections/Hero";
import { About } from "@/app/components/sections/About";
import { NosMaisons } from "@/app/components/sections/NosMaisons";
import { Toliara } from "@/app/components/sections/Toliara";
import { Processus } from "@/app/components/sections/Processus";
import { Gallery } from "@/app/components/sections/Gallery";
import { UniversPlante } from "@/app/components/sections/UniversPlante";
import { OrAura } from "@/app/components/sections/OrAura";
import { Impact } from "@/app/components/sections/Impact";
import { Contact } from "@/app/components/sections/Contact";
import { Faq } from "@/app/components/sections/Faq";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <NosMaisons />
      <Toliara />
      <Processus />
      <Gallery />
      <UniversPlante />
      <OrAura />
      <Impact />
      <Contact />
      <Faq />
    </main>
  );
}
