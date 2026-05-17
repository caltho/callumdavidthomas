/**
 * Simple responsive image gallery for project detail pages.
 * Click an image to open it full-size in a new tab.
 * No lightbox library — keeps the bundle small.
 */
export function ImageGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  if (!images || images.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((src) => (
        <a
          key={src}
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="group block overflow-hidden border border-border bg-ink-700/40 transition-colors hover:border-ember/60"
          title={alt}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="block h-auto w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            loading="lazy"
          />
        </a>
      ))}
    </div>
  );
}
