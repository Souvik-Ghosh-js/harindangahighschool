import Img from "../Img";
import { initials } from "@/lib/format";

/* Teacher photo, or an elegant typographic monogram until a photo is uploaded. */
export default function TeacherFace({ t, media, sizes = "(min-width:1280px) 18vw, (min-width:700px) 30vw, 50vw", className = "" }) {
  return (
    <div className={`media zoom ${className}`}>
      {t.photo_id ? <Img id={t.photo_id} media={media} sizes={sizes} alt={t.name} /> : <div className="monogram" aria-hidden="true">{initials(t.name)}</div>}
    </div>
  );
}
