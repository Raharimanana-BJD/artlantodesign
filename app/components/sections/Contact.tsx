"use client";

import { useState, type FormEvent } from "react";
import { Container } from "@/app/components/ui/Container";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { CreditedImage } from "@/app/components/ui/CreditedImage";
import { Pill } from "@/app/components/ui/Pill";
import { cn } from "@/app/lib/cn";
import { sendLead } from "@/app/lib/send-lead";

const BRANDS = [
  {
    id: "toliara",
    label: "Toliara Handicraft",
    types: ["Pièces catalogue", "Sur mesure", "Volume / export"],
    placeholder: "Type de pièces, quantités, délais souhaités…",
  },
  {
    id: "plante",
    label: "Univers Plante",
    types: ["Plantes & pots", "Végétaliser un espace", "Commande pro"],
    placeholder: "Plantes recherchées, surface, lieu de livraison…",
  },
  {
    id: "oraura",
    label: "Or'Aura",
    types: ["Réserver une table", "Événement privé", "Partenariat"],
    placeholder: "Date, nombre de personnes, occasion…",
  },
] as const;

const EMAIL_RE = /^\S+@\S+\.\S+$/;
const CONTACT_EMAIL = "rlanto.rakotoarivelo4@gmail.com";

type Status = "idle" | "submitting" | "sent" | "error";

interface FieldErrors {
  name?: string;
  email?: string;
}

function chipClass(active: boolean) {
  return cn(
    "rounded-full border px-4 py-2.5 text-[13.5px] font-medium transition-colors duration-200",
    active
      ? "border-white bg-white text-warm-ink"
      : "border-white/40 bg-white/8 text-white",
  );
}

function fieldClass(hasError: boolean) {
  return cn(
    "rounded-full border-0 bg-white/90 px-5 py-3.5 text-[14.5px] text-warm-ink outline-none",
    hasError && "outline outline-2 outline-[#e2734a]",
  );
}

export function Contact() {
  const [brandId, setBrandId] = useState<(typeof BRANDS)[number]["id"]>(
    BRANDS[0].id,
  );
  const [typeIndex, setTypeIndex] = useState(0);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState(false);

  const brand = BRANDS.find((b) => b.id === brandId) ?? BRANDS[0];

  const pickBrand = (id: (typeof BRANDS)[number]["id"]) => {
    setBrandId(id);
    setTypeIndex(0);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(false);

    const errors: FieldErrors = {};
    if (!name.trim()) errors.name = "Votre nom est requis.";
    if (!EMAIL_RE.test(email)) errors.email = "Adresse e-mail non valide.";
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setStatus("submitting");
    const result = await sendLead({
      kind: "full",
      name,
      email,
      company,
      phone,
      message,
      brand: brand.label,
      requestType: brand.types[typeIndex],
      website,
    });

    if (result === "ok") {
      setStatus("sent");
    } else {
      setStatus("idle");
      setFormError(true);
    }
  };

  const reset = () => {
    setStatus("idle");
    setName("");
    setCompany("");
    setEmail("");
    setPhone("");
    setMessage("");
    setTypeIndex(0);
    setFieldErrors({});
    setFormError(false);
  };

  return (
    <section id="contact" className="relative overflow-hidden text-white">
      <CreditedImage
        src="https://images.unsplash.com/photo-1544914167-c71759753c6d?auto=format&fit=crop&w=2400&q=70"
        alt="Table dressée avec vannerie"
        sizes="100vw"
        credit="Photo by AfriMod Studio on Unsplash"
        creditHref="https://unsplash.com/@afrimod"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(42,26,18,.82), rgba(42,26,18,.55))",
        }}
      />

      <Container
        py="band"
        className="relative flex flex-wrap gap-x-col-gap gap-y-12"
      >
        <div className="flex flex-1 basis-95 flex-col justify-between gap-10">
          <SectionHeading eyebrow="demandez" tone="photo">
            votre devis
          </SectionHeading>
          <div className="flex flex-col gap-1.5 text-sm opacity-90">
            <span>+261 34 35 573 23</span>
            <span>{CONTACT_EMAIL}</span>
            <span>Tuléar (Toliara), Madagascar</span>
          </div>
        </div>

        <div className="flex-1 basis-115">
          {status === "sent" ? (
            <div className="flex min-h-85 flex-col justify-center gap-4">
              <span className="text-[clamp(34px,3.4vw,52px)] leading-none tracking-[-0.035em]">
                Merci, {name}.
              </span>
              <p className="m-0 max-w-[28em] text-base leading-[1.55] opacity-90">
                Votre demande pour <strong>{brand.label}</strong> est bien
                reçue. Nous revenons vers vous très vite.
              </p>
              <button
                type="button"
                onClick={reset}
                className="self-start rounded-full border border-white/60 px-5 py-2.5 text-[13.5px] transition-colors duration-200 hover:bg-white hover:text-warm-ink"
              >
                Nouvelle demande
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="flex flex-col gap-3">
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                name="website"
                autoComplete="off"
                tabIndex={-1}
                aria-hidden="true"
                className="absolute left-[-9999px] top-auto size-px overflow-hidden"
              />

              <div className="flex flex-col gap-1.5">
                <span className="text-[12px] font-medium text-white/70">
                  Maison concernée
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {BRANDS.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => pickBrand(b.id)}
                      aria-pressed={b.id === brandId}
                      className={chipClass(b.id === brandId)}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-1.5 flex flex-col gap-1.5">
                <span className="text-[12px] font-medium text-white/70">
                  Type de demande
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {brand.types.map((t, i) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTypeIndex(i)}
                      aria-pressed={i === typeIndex}
                      className={chipClass(i === typeIndex)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-2.5">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="contact-name"
                    className="text-[12px] font-medium text-white/70"
                  >
                    Nom *
                  </label>
                  <input
                    id="contact-name"
                    required
                    aria-required="true"
                    aria-invalid={!!fieldErrors.name}
                    aria-describedby={
                      fieldErrors.name ? "contact-name-error" : undefined
                    }
                    placeholder="Ex. Jean Randria"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={fieldClass(!!fieldErrors.name)}
                  />
                  {fieldErrors.name && (
                    <span
                      id="contact-name-error"
                      className="text-[12.5px] text-[#ffd48a]"
                    >
                      {fieldErrors.name}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="contact-company"
                    className="text-[12px] font-medium text-white/70"
                  >
                    Société / établissement
                  </label>
                  <input
                    id="contact-company"
                    placeholder="Optionnel"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className={fieldClass(false)}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="contact-email"
                    className="text-[12px] font-medium text-white/70"
                  >
                    E-mail *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    aria-required="true"
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={
                      fieldErrors.email ? "contact-email-error" : undefined
                    }
                    placeholder="vous@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={fieldClass(!!fieldErrors.email)}
                  />
                  {fieldErrors.email && (
                    <span
                      id="contact-email-error"
                      className="text-[12.5px] text-[#ffd48a]"
                    >
                      {fieldErrors.email}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="contact-phone"
                    className="text-[12px] font-medium text-white/70"
                  >
                    Téléphone
                  </label>
                  <input
                    id="contact-phone"
                    placeholder="Optionnel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={fieldClass(false)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="contact-message"
                  className="text-[12px] font-medium text-white/70"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  placeholder={brand.placeholder}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="resize-y rounded-[18px] border-0 bg-white/90 px-5 py-3.5 text-[14.5px] text-warm-ink outline-none"
                />
              </div>

              {formError && (
                <span className="text-[13.5px] text-[#ffd48a]">
                  L&apos;envoi a échoué. Réessayez, ou écrivez-nous à{" "}
                  {CONTACT_EMAIL}
                </span>
              )}

              <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
                <span className="text-micro opacity-80">
                  * Champs obligatoires · Réponse personnalisée
                </span>
                <Pill
                  type="submit"
                  variant="cream"
                  size="lg"
                  disabled={status === "submitting"}
                  className="disabled:opacity-70"
                >
                  {status === "submitting" ? "Envoi…" : "Envoyer ma demande"}
                </Pill>
              </div>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
