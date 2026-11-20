/* One place that decides how every photo is resized.
   - On Netlify: the platform's Image CDN (/.netlify/images) resizes and caches each photo.
     (Next's built-in /_next/image is not used there: Netlify's cache ignored its ?url=
     query and served one photo for every image.)
   - Anywhere else (local preview): the original file is served as is. */
export function imgUrl(src, width, quality = 70) {
  if (process.env.NEXT_PUBLIC_IMAGE_CDN === "netlify") {
    return `/.netlify/images?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
  }
  return src;
}

export default function loader({ src, width, quality }) {
  return imgUrl(src, width, quality || 75);
}
