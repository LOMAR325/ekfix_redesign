// Shared HTML → text extraction for scripts/check-copy.mjs and scripts/similarity.mjs.
// No dependencies: regex-level parsing is enough for Next's prerendered HTML.

// Named entities: the full HTML 4 set minus Greek/math letters — Latin-1 (160–255) by
// position, plus markup-significant, typographic and arrow entities.
const LATIN1 =
  "nbsp iexcl cent pound curren yen brvbar sect uml copy ordf laquo not shy reg macr deg plusmn sup2 sup3 acute micro para middot cedil sup1 ordm raquo frac14 frac12 frac34 iquest Agrave Aacute Acirc Atilde Auml Aring AElig Ccedil Egrave Eacute Ecirc Euml Igrave Iacute Icirc Iuml ETH Ntilde Ograve Oacute Ocirc Otilde Ouml times Oslash Ugrave Uacute Ucirc Uuml Yacute THORN szlig agrave aacute acirc atilde auml aring aelig ccedil egrave eacute ecirc euml igrave iacute icirc iuml eth ntilde ograve oacute ocirc otilde ouml divide oslash ugrave uacute ucirc uuml yacute thorn yuml".split(
    " ",
  );
if (LATIN1.length !== 96) throw new Error("html-text: Latin-1 entity table is off");
const NAMED = {
  quot: '"', amp: "&", apos: "'", lt: "<", gt: ">",
  OElig: "Œ", oelig: "œ", Scaron: "Š", scaron: "š", Yuml: "Ÿ",
  fnof: "ƒ", circ: "ˆ", tilde: "˜", ensp: " ", emsp: " ",
  thinsp: " ", zwnj: "‌", zwj: "‍", lrm: "‎", rlm: "‏",
  ndash: "–", mdash: "—", lsquo: "‘", rsquo: "’", sbquo: "‚",
  ldquo: "“", rdquo: "”", bdquo: "„", dagger: "†", Dagger: "‡",
  bull: "•", hellip: "…", permil: "‰", prime: "′", Prime: "″",
  lsaquo: "‹", rsaquo: "›", oline: "‾", frasl: "⁄", euro: "€",
  trade: "™", larr: "←", uarr: "↑", rarr: "→", darr: "↓",
  harr: "↔", minus: "−", middot: "·",
};
LATIN1.forEach((name, i) => (NAMED[name] = String.fromCodePoint(160 + i)));

export function decodeEntities(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z][a-z0-9]*);/gi, (m, body) => {
    if (body[0] === "#") {
      const cp = body[1] === "x" || body[1] === "X" ? parseInt(body.slice(2), 16) : Number(body.slice(1));
      return Number.isFinite(cp) ? String.fromCodePoint(cp) : m;
    }
    return NAMED[body] ?? m;
  });
}

const stripNoise = (html) =>
  html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<template\b[\s\S]*?<\/template>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, "");

/** Visible text: no <script>/<style>/comments/attributes; entities decoded; whitespace collapsed. */
export function visibleText(html) {
  return decodeEntities(stripNoise(html).replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

/** Removes every element carrying `cls` (balanced on its own tag name). */
export function removeByClass(html, cls) {
  const open = new RegExp(
    `<([a-z][a-z0-9]*)\\b[^>]*\\bclass="[^"]*(?<![\\w-])${cls}(?![\\w-])[^"]*"[^>]*>`,
    "i",
  );
  let out = html;
  for (let m = open.exec(out); m; m = open.exec(out)) {
    const tag = new RegExp(`<(/?)${m[1]}\\b[^>]*>`, "gi");
    tag.lastIndex = m.index + m[0].length;
    let depth = 1;
    let end = out.length;
    for (let t = tag.exec(out); t; t = tag.exec(out)) {
      if (t[0].endsWith("/>")) continue;
      depth += t[1] ? -1 : 1;
      if (depth === 0) {
        end = t.index + t[0].length;
        break;
      }
    }
    out = `${out.slice(0, m.index)} ${out.slice(end)}`;
  }
  return out;
}

/** The page's own content: <main> when present, else between </header> and the footer. */
export function pageRegion(html) {
  const main = html.match(/<main\b[^>]*>([\s\S]*)<\/main>/i);
  if (main) return main[1];
  const start = html.search(/<\/header>/i);
  const end = html.lastIndexOf("<footer");
  return html.slice(start >= 0 ? start : 0, end >= 0 ? end : undefined);
}

/** spec §10 "full" text: the page region minus the CTA band. */
export function fullText(html) {
  return visibleText(removeByClass(stripNoise(pageRegion(html)), "cta-band"));
}

/**
 * spec §10 / D01 "editorial" text: paragraphs, headings, list items, FAQ question+answer —
 * without chip/link rows, breadcrumbs and the CTA band.
 */
export function editorialText(html) {
  let region = stripNoise(pageRegion(html));
  for (const cls of ["cta-band", "breadcrumb", "chip-row"]) region = removeByClass(region, cls);
  const blocks = [];
  for (const m of region.matchAll(/<(p|h[1-6]|li|summary|dt|dd)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const text = visibleText(m[2]);
    if (text) blocks.push(text);
  }
  return blocks.join("\n");
}
