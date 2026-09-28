import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { publishedPaths } from "@/lib/routes";

// The sitemap is lib/routes.publishedPaths() — the one list of live URLs, built from
// data/ through lib/publish. A draft never gets an entry; publishing it (one `status`
// edit in data/) adds one. Only priority/changeFrequency are decided here.

type Entry = MetadataRoute.Sitemap[number];
type ChangeFrequency = NonNullable<Entry["changeFrequency"]>;

const lastModified = new Date();

// Same rules as before: home 1.0 weekly; /about & /brands 0.7 yearly; hubs 0.7 monthly;
// service, commercial and town pages 0.9 monthly. New content types: guides 0.6 monthly,
// cases 0.6 yearly.
function rule(path: string): [number, ChangeFrequency] {
  if (path === "/") return [1.0, "weekly"];
  if (path === "/about" || path === "/brands") return [0.7, "yearly"];
  if (/^\/(appliance-repair|commercial-appliance-repair|towns)\/[^/]+$/.test(path)) {
    return [0.9, "monthly"];
  }
  if (path.startsWith("/appliance-repair-guide/")) return [0.6, "monthly"];
  if (path.startsWith("/repair-cases/")) return [0.6, "yearly"];
  return [0.7, "monthly"];
}

export default function sitemap(): MetadataRoute.Sitemap {
  return publishedPaths().map((path) => {
    const [priority, changeFrequency] = rule(path);
    return { url: absoluteUrl(path), lastModified, changeFrequency, priority };
  });
}
