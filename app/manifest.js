import { getSite } from "@/lib/content";
import { mediaUrl } from "@/lib/media-url";
import { imgUrl } from "@/lib/image-loader";
import { shortName } from "@/lib/seo";

export default async function manifest() {
  const { site } = await getSite();
  return {
    name: site.name,
    short_name: shortName(site.name).replace("High School", "HS"),
    start_url: "/",
    display: "standalone",
    background_color: "#f7f3ec",
    theme_color: "#0f1b2d",
    icons: site.logo
      ? [256, 640].map((w) => ({ src: imgUrl(mediaUrl(site.logo), w, 70), sizes: `${w}x${w}`, type: "image/webp" }))
      : [],
  };
}
