import Image from "next/image";
import type { Brand } from "@/data/types";
import { business } from "@/data/business";
import { imageDims } from "./image-dimensions";

type BrandNote = { tag: string; text: string; cta: string };

type BrandGridProps = {
  brands: Brand[];
  /** Optional `.brand-note` line under the grid ("Commercial · Unimac · Miele · …"). */
  note?: BrandNote;
};

// `.brand-grid` (flex-wrap) + equal-size `.brand-cell`s. Logos go through next/image
// at their real pixel size (from image-dimensions.ts); `app/globals.css` caps them
// (`.brand-cell img { max-height: 42px; object-fit: contain; filter: grayscale(1) }`).
export function BrandGrid({ brands, note }: BrandGridProps) {
  return (
    <>
      <div className="brand-grid">
        {brands.map((brand) => {
          const dims = imageDims(brand.logo);
          return (
            <div key={brand.name} className="brand-cell">
              <Image
                src={brand.logo}
                alt={brand.alt}
                width={dims.width}
                height={dims.height}
              />
            </div>
          );
        })}
      </div>
      {note && (
        <div className="brand-note">
          <span className="tag">{note.tag}</span> {note.text} —{" "}
          <a href={business.phoneHref}>{note.cta}</a>
        </div>
      )}
    </>
  );
}
