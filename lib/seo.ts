import type { Metadata } from "next";
import { business } from "@/data/business";

/** Absolute base for canonical URLs and OG tags. Derived from the one domain constant. */
export const metadataBase = new URL(business.siteUrl);

/**
 * Build a per-route Metadata object with a correct canonical.
 * `path` is a root-relative path, e.g. "/", "/about", "/appliance-repair/dryer".
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    metadataBase,
    title,
    description,
    alternates: { canonical: path },
  };
}
