// Responsive <picture> over the pre-generated variants in public/img/
// (see scripts/generate-assets.mjs). Browser negotiates AVIF -> WebP -> JPEG
// and picks the right width from srcset, so phones don't pull desktop bytes.
type PictureProps = {
  /** Basename in public/img, e.g. "hero-spruce". */
  name: string;
  /** Widths generated for this image, ascending. */
  widths: number[];
  /** The CSS `sizes` hint (how wide the image renders at each breakpoint). */
  sizes: string;
  /** Intrinsic dimensions of the source — reserves space, locks CLS. */
  width: number;
  height: number;
  alt: string;
  /** Decorative images: empty alt + aria-hidden. */
  decorative?: boolean;
  /** Above-the-fold LCP image: eager + high priority. Default lazy. */
  eager?: boolean;
  /** Applied to <picture> (layout) and <img> (object-fit etc.) respectively. */
  className?: string;
  imgClassName?: string;
};

const srcSet = (name: string, widths: number[], ext: string) =>
  widths.map((w) => `/img/${name}-${w}.${ext} ${w}w`).join(", ");

export function Picture({
  name,
  widths,
  sizes,
  width,
  height,
  alt,
  decorative,
  eager,
  className,
  imgClassName,
}: PictureProps) {
  const fallbackWidth = Math.max(...widths);
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={srcSet(name, widths, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(name, widths, "webp")} sizes={sizes} />
      <img
        src={`/img/${name}-${fallbackWidth}.jpg`}
        srcSet={srcSet(name, widths, "jpg")}
        sizes={sizes}
        alt={decorative ? "" : alt}
        aria-hidden={decorative || undefined}
        width={width}
        height={height}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined}
        decoding="async"
        className={imgClassName}
      />
    </picture>
  );
}
