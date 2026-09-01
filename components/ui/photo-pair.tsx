import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

export type Photo = {
  src: string;
  alt: string;
  caption: ReactNode;
  /** Passed through to the image (current markup: `style="object-position:30% 75%"`). */
  objectPosition?: string;
  /** Existing per-figure inline override, e.g. `{ height: 280 }` on about.html. */
  figureStyle?: CSSProperties;
};

type PhotoPairProps = {
  photos: Photo[];
  /** Existing wrapper inline override, e.g. `{ marginTop: 0 }` on about.html. */
  style?: CSSProperties;
};

// `.photo-pair` — `figure` + `figcaption`, images `object-fit: cover` (via globals.css).
// `figure` is already `position: relative` in the CSS, so `next/image` `fill` needs
// nothing added.
export function PhotoPair({ photos, style }: PhotoPairProps) {
  return (
    <div className="photo-pair" style={style}>
      {photos.map((photo) => (
        <figure key={photo.src} style={photo.figureStyle}>
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            style={
              photo.objectPosition
                ? { objectPosition: photo.objectPosition }
                : undefined
            }
          />
          <figcaption>{photo.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}
