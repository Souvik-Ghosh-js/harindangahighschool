import Image from "next/image";
import { mediaUrl } from "@/lib/media-url";

/* Renders an uploaded photo with its stored dimensions and a blurred
   placeholder, so nothing ever jumps while loading.
   - `fill` (default): fills an aspect-ratio box set by the wrapper.
   - `fill={false}`: natural size (masonry, documents). */
export default function Img({ id, media = {}, alt, sizes = "100vw", priority = false, fill = true, quality = 70, className, style }) {
  if (!id) return null;
  const m = media[id] || {};
  const common = {
    src: mediaUrl(id),
    alt: alt ?? m.alt ?? "",
    sizes,
    priority,
    quality,
    className,
    style,
    ...(m.blur ? { placeholder: "blur", blurDataURL: m.blur } : {}),
  };
  if (fill) return <Image {...common} fill />;
  return <Image {...common} width={m.width || 1600} height={m.height || 1200} style={{ width: "100%", height: "auto", ...style }} />;
}
