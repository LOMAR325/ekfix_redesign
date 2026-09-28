import type { GuideArticle, GuideCategory } from "./types";
import { published, routable } from "../lib/publish";

// Knowledge centre /appliance-repair-guide (spec §11). Categories are fixed; articles are
// written in ticket 07 and stay drafts until the owner's technical review (R81). With no
// published article the hub itself has no route and no nav item (spec story 8).

export const guideCategories: { slug: GuideCategory; label: string }[] = [
  { slug: "refrigerator", label: "Refrigerators" },
  { slug: "dishwasher", label: "Dishwashers" },
  { slug: "washer", label: "Washers" },
  { slug: "dryer", label: "Dryers" },
  { slug: "oven-range", label: "Ovens & Ranges" },
  { slug: "ice-maker", label: "Ice Makers" },
  { slug: "commercial", label: "Commercial Equipment" },
];

export const articles: GuideArticle[] = [];

/** Published articles — sitemap, links, nav ("Guides" only when this is non-empty). */
export const publishedArticles = (): GuideArticle[] => published(articles);
/** generateStaticParams for /appliance-repair-guide/[slug] (drafts only in `next dev`). */
export const articleSlugs = (): string[] => articles.filter(routable).map((a) => a.slug);
/** An article only if it may be routed (published, or a draft in `next dev`). */
export const getArticle = (slug: string): GuideArticle | undefined =>
  articles.find((a) => a.slug === slug && routable(a));
