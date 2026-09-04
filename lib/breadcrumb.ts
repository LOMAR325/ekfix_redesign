import { breadcrumbJsonLd } from "@/lib/jsonld";
import type { Crumb } from "@/components/ui/page-hero";

// One place to write a page's breadcrumb trail. Each step carries the name shown to
// the reader and the path it points at; the helper produces both the visual
// `.breadcrumb` crumbs (for `PageHero`) and the `BreadcrumbList` JSON-LD, so the
// trail never has to be spelled out twice and the two can't drift.

export type BreadcrumbStep = {
  name: string;
  /** Root-relative path (also used as the JSON-LD `item`, absolutised there). */
  path: string;
  /**
   * Render as plain text in the visual trail even when it isn't the last step —
   * charlotte.html leaves "Service Area" unlinked. The step still appears, linked,
   * in the JSON-LD.
   */
  unlinked?: boolean;
};

export function breadcrumbTrail(steps: BreadcrumbStep[]): {
  crumbs: Crumb[];
  jsonLd: ReturnType<typeof breadcrumbJsonLd>;
} {
  const lastIndex = steps.length - 1;
  return {
    crumbs: steps.map((step, i) => ({
      label: step.name,
      href: i === lastIndex || step.unlinked ? undefined : step.path,
    })),
    jsonLd: breadcrumbJsonLd(
      steps.map((step) => ({ name: step.name, url: step.path })),
    ),
  };
}
