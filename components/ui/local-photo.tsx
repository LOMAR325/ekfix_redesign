import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { imageDims } from "./image-dimensions";

type LocalPhotoProps = {
  /** Image source. Ignored when `children` (an `<iframe>` map) is supplied. */
  src?: string;
  alt?: string;
  /** Existing per-page inline override on the `<img>` (about.html: `background`). */
  imgStyle?: CSSProperties;
  /** Existing wrapper inline override (charlotte.html map: `borderColor`). */
  style?: CSSProperties;
  /** A map `<iframe>` — takes the place of the image when present. */
  children?: ReactNode;
};

// `.local-photo` — rounded, bordered media wrapper. Holds either a next/image
// (`.local-photo img { width: 100%; height: auto }` from globals.css) or an
// embedded map iframe passed as children.
export function LocalPhoto({ src, alt, imgStyle, style, children }: LocalPhotoProps) {
  return (
    <div className="local-photo" style={style}>
      {children ??
        (src ? (
          <Image
            src={src}
            alt={alt ?? ""}
            width={imageDims(src).width}
            height={imageDims(src).height}
            style={imgStyle}
          />
        ) : null)}
    </div>
  );
}
