"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A figure that only appears once its image has actually loaded, so a photo
 * that hasn't been added yet leaves no broken box behind.
 */
export function OptionalFigure({
  src,
  alt,
  caption,
  className,
  imgStyle,
}: {
  src: string;
  alt: string;
  caption?: React.ReactNode;
  className?: string;
  imgStyle?: React.CSSProperties;
}) {
  const img = useRef<HTMLImageElement>(null);
  const [ok, setOk] = useState(false);
  useEffect(() => {
    // It may have finished loading before hydration, when onLoad can't fire.
    if (img.current?.complete && img.current.naturalWidth) setOk(true);
  }, []);
  return (
    <figure className={className} style={ok ? undefined : { display: "none" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={img} src={src} alt={alt} style={imgStyle} onLoad={() => setOk(true)} />
      {caption && <figcaption className="label">{caption}</figcaption>}
    </figure>
  );
}
