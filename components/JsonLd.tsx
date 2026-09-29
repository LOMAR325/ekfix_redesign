import type { JsonLdGraph } from "@/lib/jsonld";

// Server component. Renders the page's one schema.org graph (built by lib/jsonld.graph)
// as a single <script type="application/ld+json">. The only sanctioned way to put
// JSON-LD on a page — one per page (spec story 16).

// JSON.stringify output goes straight into dangerouslySetInnerHTML, so any "<" (and in
// particular a literal "</script>") in the data would break out of the <script> element.
// Escape "<", ">" and "&" as \uXXXX — still valid JSON, parsed back by any consumer.
function serialize(data: JsonLdGraph): string {
  return JSON.stringify(data)
    .replace(/&/g, "\\u0026")
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e");
}

export function JsonLd({ data }: { data: JsonLdGraph }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialize(data) }}
    />
  );
}
