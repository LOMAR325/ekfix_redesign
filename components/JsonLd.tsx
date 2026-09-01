// Server component. Renders one or more schema.org blocks (built by lib/jsonld.ts) as
// <script type="application/ld+json">. The only sanctioned way to put JSON-LD on a page.

type JsonLdBlock = Record<string, unknown>;

// JSON.stringify output goes straight into dangerouslySetInnerHTML, so any "<" (and in
// particular a literal "</script>") in the data would break out of the <script> element.
// Escape "<", ">" and "&" as \uXXXX — still valid JSON, parsed back by any consumer.
function serialize(block: JsonLdBlock): string {
  return JSON.stringify(block)
    .replace(/&/g, "\\u0026")
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e");
}

export function JsonLd({ data }: { data: JsonLdBlock | JsonLdBlock[] }) {
  const blocks = Array.isArray(data) ? data : [data];
  return (
    <>
      {blocks.map((block, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serialize(block) }}
        />
      ))}
    </>
  );
}
