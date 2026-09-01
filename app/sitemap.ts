import type { MetadataRoute } from "next";
import { services } from "@/data/services";
import { fullPageTowns } from "@/data/towns";
import { absoluteUrl } from "@/lib/seo";

// The sitemap is assembled from the same data that drives routing — static route list +
// data/services (12) + data/towns filtered to isFullPage (5). Adding a service or a full
// town page automatically adds its sitemap entry; there is no second list to keep in sync.
// Deliberately absent: /api/*, .html URLs, and towns without isFullPage.

type Entry = MetadataRoute.Sitemap[number];
type ChangeFrequency = NonNullable<Entry["changeFrequency"]>;

const lastModified = new Date();

const entry = (
  path: string,
  priority: number,
  changeFrequency: ChangeFrequency,
): Entry => ({
  url: absoluteUrl(path),
  lastModified,
  changeFrequency,
  priority,
});

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    entry("/", 1.0, "weekly"),
    entry("/about", 0.7, "yearly"),
    entry("/brands", 0.7, "yearly"),
    entry("/for-business", 0.7, "monthly"),
    entry("/towns", 0.7, "monthly"),
    ...services.map((s) => entry(`/appliance-repair/${s.slug}`, 0.9, "monthly")),
    ...fullPageTowns.map((t) => entry(`/towns/${t.slug}`, 0.9, "monthly")),
  ];
}
