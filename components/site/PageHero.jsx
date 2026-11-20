import Link from "next/link";
import Img from "../Img";
import JsonLd from "../JsonLd";
import { breadcrumbLd } from "@/lib/seo";

/* Compact blue title band for inner pages. If a photo is given it sits in a
   framed box beside the title — never behind the text. */
export default function PageHero({ title, intro, image, media, crumbs = [], eyebrow, plain = false }) {
  const photo = image && !plain;
  return (
    <section className={`phero${photo ? " phero--photo" : " phero--plain"}`}>
      <div className="wrap phero__in">
        <div>
          <nav aria-label="Breadcrumb">
            <ol className="crumbs">
              <li>
                <Link href="/">Home</Link>
              </li>
              {crumbs.map((c, i) => (
                <li key={c.path}>{i === crumbs.length - 1 ? <span aria-current="page">{c.name}</span> : <Link href={c.path}>{c.name}</Link>}</li>
              ))}
            </ol>
          </nav>
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1 className="h1">{title}</h1>
          {intro && <p className="lead">{intro}</p>}
        </div>
        {photo && (
          <div className="media phero__img">
            <Img id={image} media={media} priority sizes="(min-width:900px) 40vw, 100vw" alt="" />
          </div>
        )}
      </div>
      {crumbs.length > 0 && <JsonLd data={breadcrumbLd(crumbs)} />}
    </section>
  );
}
