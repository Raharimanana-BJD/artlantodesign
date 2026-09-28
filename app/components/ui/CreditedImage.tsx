import Image, { type StaticImageData } from "next/image";
import { cn } from "@/app/lib/cn";

const UNSPLASH_HOST_RE = /(^|\.)unsplash\.com$/;

function isUnsplashHost(src: string | StaticImageData) {
  if (typeof src !== "string") return false;
  try {
    return UNSPLASH_HOST_RE.test(new URL(src).hostname.replace(/\.$/, ""));
  } catch {
    return false;
  }
}

function withUnsplashReferral(href: string) {
  try {
    const u = new URL(href);
    if (!UNSPLASH_HOST_RE.test(u.hostname.replace(/\.$/, ""))) return href;
    if (!u.searchParams.has("utm_source")) u.searchParams.set("utm_source", "art_lanto_design");
    if (!u.searchParams.has("utm_medium")) u.searchParams.set("utm_medium", "referral");
    return u.toString();
  } catch {
    return href;
  }
}

export interface CreditedImageProps {
  /** A remote URL, or a static import (StaticImageData) for a local file. */
  src: string | StaticImageData;
  alt: string;
  sizes: string;
  /** Exact form: "Photo by {name} on Unsplash". Required whenever src is an Unsplash host. */
  credit?: string;
  creditHref?: string;
  /** CSS aspect-ratio (e.g. "16/10"). Renders the rounded, clipped wrapper box.
   *  Omit when the parent already supplies a sized, relatively positioned box. */
  aspect?: string;
  /** Marks the image for eager, high priority loading (the hero/LCP photo).
   *  Next.js 16 renamed the old `priority` prop to `preload`; this wraps that. */
  preload?: boolean;
  /** Set false when this image is itself nested inside another <a> (e.g. a card
   *  that is a link): the credit still renders, as plain text, never a clickable
   *  link, since a nested <a> is invalid HTML and breaks hydration. Default true. */
  creditLinks?: boolean;
  className?: string;
}

export function CreditedImage({
  src,
  alt,
  sizes,
  credit,
  creditHref,
  aspect,
  preload,
  creditLinks = true,
  className,
}: CreditedImageProps) {
  const trimmedCredit = credit?.trim();
  const unsplash = isUnsplashHost(src);

  if (unsplash && !trimmedCredit) {
    const message = `CreditedImage: an Unsplash photo (${src}) has no credit. Rendering an uncredited Unsplash photo violates Unsplash's terms, so this image is not rendered. Pass a "credit" prop in the exact form "Photo by {name} on Unsplash".`;
    if (process.env.NODE_ENV === "development") {
      throw new Error(message);
    }
    console.error(message);
    return null;
  }

  const match = trimmedCredit ? /^Photo by (.+) on Unsplash$/.exec(trimmedCredit) : null;
  const resolvedCreditHref = creditHref ? withUnsplashReferral(creditHref) : undefined;

  const image = (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      preload={preload}
      className="object-cover"
    />
  );

  const wrapperClassName = aspect
    ? cn("relative overflow-hidden rounded-md", className)
    : cn("absolute inset-0 overflow-hidden", className);

  return (
    <div className={wrapperClassName} style={aspect ? { aspectRatio: aspect } : undefined}>
      {image}
      {trimmedCredit ? (
        <span className="absolute left-1.5 bottom-1.5 max-w-[calc(100%-12px)] truncate rounded-[5px] bg-black/55 px-1.75 py-0.75 text-[10px]/[1.2] text-white backdrop-blur-[6px]">
          {!creditLinks ? (
            trimmedCredit
          ) : match ? (
            <>
              Photo by{" "}
              {resolvedCreditHref ? (
                <a href={resolvedCreditHref} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {match[1]}
                </a>
              ) : (
                match[1]
              )}{" "}
              on{" "}
              <a
                href="https://unsplash.com/?utm_source=art_lanto_design&utm_medium=referral"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Unsplash
              </a>
            </>
          ) : resolvedCreditHref ? (
            <a href={resolvedCreditHref} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {trimmedCredit}
            </a>
          ) : (
            trimmedCredit
          )}
        </span>
      ) : null}
    </div>
  );
}
