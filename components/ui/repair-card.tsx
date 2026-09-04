"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { imageDims } from "./image-dimensions";
import { Anchor } from "./anchor";

export type RepairCardProps = {
  label: string;
  href: string;
  /** `.tag` line — "Repair · Book online" on the home grid, "Full local page" on /towns. */
  tag: string;
  /** Thumbnail src ("/images/Refrigerator.webp"). Omit for the text-only /towns cards. */
  image?: string;
  imageAlt?: string;
  /**
   * When provided, the card fires `onSelect(label)` on click before the link is
   * followed — the home #repair grid uses it to preset the booking form
   * (`useBooking().setAppliance`). Passing it is what makes this card interactive;
   * without it the card is a plain link and renders fine from a server component.
   */
  onSelect?: (label: string) => void;
  style?: CSSProperties;
  bodyStyle?: CSSProperties;
};

// `.repair-card` — thumb (next/image, `object-fit: contain` via globals.css), `.body`,
// `.row` (`.name` + `.arrow`), `.tag`. Ported 1:1 from index.html / towns/index.html.
export function RepairCard({
  label,
  href,
  tag,
  image,
  imageAlt,
  onSelect,
  style,
  bodyStyle,
}: RepairCardProps) {
  const dims = image ? imageDims(image) : null;
  return (
    <Anchor
      href={href}
      className="repair-card"
      style={style}
      onClick={onSelect ? () => onSelect(label) : undefined}
    >
      {image && dims && (
        <div className="thumb">
          <Image
            src={image}
            alt={imageAlt ?? `${label} repair`}
            width={dims.width}
            height={dims.height}
          />
        </div>
      )}
      <div className="body" style={bodyStyle}>
        <div className="row">
          <span className="name">{label}</span>
          <span className="arrow">→</span>
        </div>
        <span className="tag">{tag}</span>
      </div>
    </Anchor>
  );
}
