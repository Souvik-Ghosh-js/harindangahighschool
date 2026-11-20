import Link from "next/link";
import { getBlock, getLatestNotices, getEvents, splitEvents, getTeacherTree, getRecentPhotos, getDownloads, withMedia, getSite } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import { paragraphs, initials, fileKind, fileSize } from "@/lib/format";
import { mediaUrl } from "@/lib/media-url";
import Img from "@/components/Img";
import NoticeRow from "@/components/site/NoticeRow";
import EventCard from "@/components/site/EventCard";
import TeacherFace from "@/components/site/TeacherFace";
import { Arrow, Download, Phone, Pin, Mail, ICON_MAP } from "@/components/Icons";
import { facilityIcon, theme } from "@/components/site/facility";

export const revalidate = 3600;

export async function generateMetadata() {
  const { seo } = await getSite();
  return pageMeta({ title: null, description: seo.description, path: "/" });
}

function Head({ eyebrow, title, lead, center, children, id, tone }) {
  return (
    <div className={`sec-head${center ? " sec-head--center" : children ? " sec-head--split" : ""}`}>
      <div>
        {eyebrow && <span className={`eyebrow ${tone || ""}`}>{eyebrow}</span>}
        <h2 className="h2" id={id} data-reveal>
          {title}
        </h2>
        {lead && (
          <p className="lead" style={{ marginTop: 14 }}>
            {lead}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

export default async function Home() {
  const [{ site }, hero, intro, journey, culture, show, leader, admission, about, academics, notices, events, tree, photos, downloads] = await Promise.all([
    getSite(),
    getBlock("home.hero"),
    getBlock("home.intro"),
    getBlock("home.journey"),
    getBlock("home.culture"),
    getBlock("home.sections"),
    getBlock("leadership"),
    getBlock("admission"),
    getBlock("about"),
    getBlock("academics"),
    getLatestNotices(6),
    getEvents(),
    getTeacherTree(),
    getRecentPhotos(5),
    getDownloads(),
  ]);
  const { upcoming, past } = splitEvents(events);
  const featuredEvents = [...upcoming, ...past].slice(0, 3);
  const faces = tree.teaching.slice(0, 5);
  const slides = (hero.slides || []).filter((s) => s.image).slice(0, 3);
  const chapters = (culture.chapters || []).filter((c) => c.title).slice(0, 4);
  const milestones = (journey.milestones || []).filter((m) => m.title);
  const facilities = (about.facilities || []).filter((f) => f.title).slice(0, 5);
  const steps = (admission.steps || []).filter((s) => s.title).slice(0, 4);
  const topDownloads = downloads.slice(0, 4);
  const media = await withMedia(slides, intro, milestones, chapters, leader.portrait, faces.map((t) => t.photo_id), featuredEvents.map((e) => e.cover_id), photos.map((p) => p.media_id));
  const today = new Date().toISOString().slice(0, 10);
  const tiles = (show.quick_links || []).filter((q) => q.label && q.href).slice(0, 8);
  const stages = (academics.stages || []).filter((s) => s.title);
  const checks = (about.values || []).filter((v) => v.title);
  const chips = (about.glance || []).slice(0, 3);
  const lines = String(hero.title || "").split("\n");
  const secondPhoto = chapters[2]?.image || chapters[1]?.image;
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.map_query || site.name)}`;

  /* Last word of the headline gets the hand-drawn underline. */
  const renderLine = (l, last) => {
    if (!last) return l;
    const w = l.trim().split(" ");
    const end = w.pop();
    return (
      <em>
        {w.join(" ")} <span className="squig">{end}</span>
      </em>
    );
  };

  return (
    <>
      {/* PURPOSE: tell a parent who we are in 5 seconds, and start admission. */}
      <section className="hero" aria-label="Welcome">
        <div className="wrap hero__in">
          <div>
            {hero.eyebrow && <span className="eyebrow">{hero.eyebrow}</span>}
            <h1 className="display">
              {lines.map((l, i) => (
                <span key={i} style={{ display: "block" }}>
                  {renderLine(l, i === lines.length - 1 && lines.length > 1)}
                </span>
              ))}
            </h1>
            {hero.subtitle && <p className="hero__sub">{hero.subtitle}</p>}
            <div className="hero__actions">
              {hero.primary_label && hero.primary_href && (
                <Link href={hero.primary_href} className="btn btn--gold">
                  {hero.primary_label} <Arrow className="arr" />
                </Link>
              )}
              {hero.secondary_label && hero.secondary_href && (
                <Link href={hero.secondary_href} className="btn btn--ghost">
                  {hero.secondary_label}
                </Link>
              )}
            </div>
            {chips.length > 0 && (
              <div className="hero__chips">
                {chips.map((c, i) => (
                  <span key={i}>
                    {c.label} {c.value}
                  </span>
                ))}
              </div>
            )}
          </div>
          {slides.length > 0 && (
            <div className="hero__photos">
              {slides.map((s, i) => (
                <div className="media" key={s.image + i}>
                  <Img id={s.image} media={media} priority={i === 0} sizes={i === 0 ? "(min-width:980px) 40vw, 90vw" : "(min-width:980px) 18vw, 40vw"} quality={75} alt={s.caption || ""} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PURPOSE: get parents and students to their most common task in one click. */}
      {show.quicklinks && tiles.length > 0 && (
        <section className="tiles-wrap" aria-label="Quick access">
          <div className="wrap">
            <div className="tiles" data-stagger>
              {tiles.map((q, i) => {
                const Icon = ICON_MAP[q.icon] || ICON_MAP.link;
                return (
                  <Link key={q.href + q.label} href={q.href} className={`tile ${theme(i)}`}>
                    <Arrow className="tile__go" />
                    <span className="tile__icon">
                      <Icon />
                    </span>
                    <span className="tile__t">{q.label}</span>
                    {q.text && <span className="tile__s">{q.text}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* PURPOSE: build trust — who the school is and what it stands for. */}
      {show.intro && (
        <section className="section" aria-labelledby="about-title" style={{ paddingTop: 24 }}>
          <div className="wrap">
            <div className="grid-2">
              <div>
                {intro.eyebrow && <span className="eyebrow">{intro.eyebrow}</span>}
                <h2 className="h2" id="about-title" data-reveal style={{ marginBottom: 22 }}>
                  {intro.title}
                </h2>
                <div className="prose" data-reveal>
                  {paragraphs(intro.body).slice(0, 2).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                {checks.length > 0 && (
                  <ul className="checks" data-reveal>
                    {checks.map((v, i) => (
                      <li key={i}>
                        <span>
                          <strong>{v.title}.</strong> {v.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                {intro.cta_label && intro.cta_href && (
                  <Link href={intro.cta_href} className="btn">
                    {intro.cta_label} <Arrow className="arr" />
                  </Link>
                )}
              </div>
              {intro.image && (
                <div className="collage" data-reveal>
                  <div className="media">
                    <Img id={intro.image} media={media} sizes="(min-width:900px) 42vw, 92vw" quality={75} />
                  </div>
                  {secondPhoto && (
                    <div className="media">
                      <Img id={secondPhoto} media={media} sizes="(min-width:900px) 18vw, 40vw" alt="" />
                    </div>
                  )}
                  <div className="collage__chip">
                    <b>{site.established || 1948}</b>
                    Our school since
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* PURPOSE: prove it with numbers. */}
      {(intro.stats || []).length > 0 && (
        <section className="band-navy" aria-label="The school in numbers" style={{ padding: "clamp(40px,6vw,72px) 0" }}>
          <div className="wrap">
            <div className="stats stats--band" data-stagger>
              {intro.stats.map((s, i) => (
                <div className="stat" key={i}>
                  <div className="stat__n">
                    <span data-count={s.value ?? 0}>{s.value ?? 0}</span>
                    {s.suffix}
                  </div>
                  <div className="stat__l">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PURPOSE: show what a child gets here — the facilities that matter to parents. */}
      {facilities.length > 0 && (
        <section className="section" aria-labelledby="fac-title">
          <div className="wrap">
            <Head center eyebrow="Why Harindanga" tone="t-green" id="fac-title" title="Everything a student needs to grow" lead="Laboratories, culture, sport and support for scholarships — all under one roof." />
            <div className="bento" data-stagger>
              {facilities.map((f, i) => {
                const Icon = facilityIcon(f.title);
                return (
                  <article className={`feature ${theme(i)}`} key={i}>
                    <span className="feature__icon">
                      <Icon />
                    </span>
                    <h3>{f.title}</h3>
                    <p>{f.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* PURPOSE: show the learning path from Class V to XII, link to syllabus. */}
      {stages.length > 0 && (
        <section className="section band-blue" aria-labelledby="stages-title">
          <div className="wrap">
            <Head center eyebrow="Academics" id="stages-title" title="Your child's path from Class V to XII" lead={academics.intro} />
            <div className="stages" data-stagger>
              {stages.map((s, i) => (
                <article className={`stage ${["t-blue", "t-gold", "t-green"][i % 3]}`} key={i}>
                  <span className="stage__label">Class {s.label}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </article>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 40 }}>
              <Link href="/academics" className="btn btn--dark">
                Syllabus & downloads <Arrow className="arr" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* PURPOSE: put a human face on the school. */}
      {show.leadership && leader.name && (
        <section className="section" aria-labelledby="leader-title">
          <div className="wrap">
            <div className="leader-card" data-reveal>
              <div className="media">
                {leader.portrait ? <Img id={leader.portrait} media={media} sizes="(min-width:900px) 40vw, 100vw" alt={leader.name} /> : <div className="photo-placeholder" style={{ background: "var(--blue-2)", color: "#fff" }}>{initials(leader.name)}</div>}
              </div>
              <div className="leader-card__body">
                <span className="eyebrow" style={{ alignSelf: "flex-start", background: "rgba(255,255,255,.14)", color: "#fff" }}>
                  Head of Institution
                </span>
                {leader.quote ? (
                  <blockquote className="quote" style={{ margin: "8px 0 20px" }}>
                    <span className="quote__mark" aria-hidden="true">
                      “
                    </span>
                    {leader.quote}
                  </blockquote>
                ) : (
                  <h2 id="leader-title" style={{ color: "#fff", margin: "8px 0 20px" }} className="h2">
                    Leading Harindanga into its next chapter.
                  </h2>
                )}
                <div className="signature">
                  <b>{leader.name}</b>
                  <span>{leader.designation}</span>
                </div>
                <div style={{ marginTop: 24 }}>
                  <Link href="/leadership" className="btn btn--light">
                    {leader.message ? "Read the full message" : "Know more"} <Arrow className="arr" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* PURPOSE: convert interest into an application — four simple steps. */}
      {show.admission && steps.length > 0 && (
        <section className="section band-gold" aria-labelledby="apply-title">
          <div className="wrap apply">
            <div>
              <span className="eyebrow">Admissions</span>
              <h2 className="h2" id="apply-title" data-reveal style={{ marginBottom: 14 }}>
                Apply in {steps.length} simple steps
              </h2>
              <p style={{ marginBottom: 26 }}>{admission.status_text || admission.intro}</p>
              <div className="hero__actions">
                <Link href="/admission" className="btn btn--dark">
                  Admission details <Arrow className="arr" />
                </Link>
                <Link href="/notices?category=Admission" className="btn btn--ghost-dark">
                  Admission notices
                </Link>
              </div>
            </div>
            <ol className="apply__steps" data-stagger>
              {steps.map((s, i) => (
                <li key={i}>
                  <b>{s.title}</b>
                  <span>{s.text}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* PURPOSE: keep parents informed — latest notices plus the documents they ask for most. */}
      {show.notices && notices.length > 0 && (
        <section className="section" aria-labelledby="notices-title">
          <div className="wrap">
            <Head eyebrow="Notice board" tone="t-coral" id="notices-title" title="Latest from the school office">
              <div>
                <Link href="/notices" className="link">
                  All notices <Arrow width={16} />
                </Link>
              </div>
            </Head>
            <div className="split">
              <ul className="notice-list" data-stagger>
                {notices.map((n) => (
                  <NoticeRow key={n.id} n={n} today={today} />
                ))}
              </ul>
              {topDownloads.length > 0 && (
                <aside className="dl-card" data-reveal>
                  <h3>Quick downloads</h3>
                  <p>Syllabus, routines and forms.</p>
                  <ul className="dl-list">
                    {topDownloads.map((d) => (
                      <li key={d.id}>
                        <a href={mediaUrl(d.file_id, d.file_name)} target="_blank" rel="noopener noreferrer">
                          <span>
                            <b>{d.title}</b>
                            <small>
                              {fileKind(d.file_mime)} · {fileSize(d.file_size)}
                            </small>
                          </span>
                          <span className="dl-icon" aria-hidden="true">
                            <Download />
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                  <Link href="/academics#downloads" className="link" style={{ marginTop: 18 }}>
                    All downloads <Arrow width={16} />
                  </Link>
                </aside>
              )}
            </div>
          </div>
        </section>
      )}

      {/* PURPOSE: show the school's character — culture, science, sport. */}
      {show.culture && chapters.length > 0 && (
        <section className="section band-sand" aria-labelledby="life-title">
          <div className="wrap">
            <Head center eyebrow={culture.eyebrow || "Life at Harindanga"} tone="t-coral" id="life-title" title={culture.title} />
            <div className="frames" data-stagger>
              {chapters.map((c, i) => (
                <article className={`frame ${theme(i)}`} key={i}>
                  <div className="media">
                    {c.image ? <Img id={c.image} media={media} sizes="(min-width:1100px) 22vw, (min-width:640px) 45vw, 100vw" alt={c.title} /> : <div className="photo-placeholder">{i + 1}</div>}
                  </div>
                  {c.kicker && <small>{c.kicker}</small>}
                  <h3>{c.title}</h3>
                  {c.text && <p>{c.text}</p>}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PURPOSE: introduce the teachers who will teach their child. */}
      {show.teachers && faces.length > 0 && (
        <section className="section" aria-labelledby="faculty-title">
          <div className="wrap">
            <Head eyebrow="Our teachers" id="faculty-title" title={`${tree.teaching.length} teachers in ${tree.groups.length} departments`}>
              <div>
                <Link href="/teachers" className="link">
                  Meet all teachers <Arrow width={16} />
                </Link>
              </div>
            </Head>
            <div className="faculty" data-stagger>
              {faces.map((t) => (
                <Link key={t.id} href={`/teachers/${t.slug}`} className="tcard">
                  <TeacherFace t={t} media={media} />
                  <div className="tcard__name">{t.name}</div>
                  <div className="tcard__role">{t.designation}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PURPOSE: what is happening at school — only shown when there are events. */}
      {show.events && featuredEvents.length > 0 && (
        <section className="section band-blue" aria-labelledby="events-title">
          <div className="wrap">
            <Head eyebrow={upcoming.length ? "Coming up" : "Events"} id="events-title" title="Events & activities">
              <div>
                <Link href="/events" className="link">
                  All events <Arrow width={16} />
                </Link>
              </div>
            </Head>
            <div className="cards-3" data-stagger>
              {featuredEvents.map((e) => (
                <EventCard key={e.id} e={e} media={media} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PURPOSE: 75 years of heritage in a glance. */}
      {show.journey && milestones.length > 0 && (
        <section className="section band-green" aria-labelledby="journey-title">
          <div className="wrap">
            <Head center eyebrow={journey.eyebrow || "Our journey"} tone="t-green" id="journey-title" title={journey.title} lead={journey.intro} />
            <ol className="timeline">
              {milestones.map((m, i) => (
                <li key={i} data-reveal>
                  <div className="tl-card">
                    {m.image && (
                      <div className="media">
                        <Img id={m.image} media={media} sizes="(min-width:900px) 24vw, 90vw" alt={m.title} />
                      </div>
                    )}
                    <div className="tl-card__body">
                      <span className="tl-year">{m.year}</span>
                      <h3>{m.title}</h3>
                      {m.text && <p>{m.text}</p>}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* PURPOSE: let visitors see the school for themselves. */}
      {show.gallery && photos.length > 0 && (
        <section className="section" aria-labelledby="gallery-title">
          <div className="wrap">
            <Head eyebrow="Gallery" id="gallery-title" title="Moments from school life">
              <div>
                <Link href="/gallery" className="link">
                  Open the gallery <Arrow width={16} />
                </Link>
              </div>
            </Head>
            <div className="mosaic" data-stagger>
              {photos.map((p, i) => (
                <Link key={i} href={`/gallery/${p.album_slug}`} aria-label={p.caption || "Open album"}>
                  <div className="media zoom">
                    <Img id={p.media_id} media={media} sizes="(min-width:900px) 30vw, 50vw" alt={p.caption} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PURPOSE: the final push — visit, call or apply. */}
      <section className="section band-navy" aria-labelledby="visit-title">
        <div className="wrap">
          <div className="visit">
            <div>
              <span className="eyebrow">Visit us</span>
              <h2 className="h2" id="visit-title">
                Come and see Harindanga for yourself
              </h2>
              <ul className="visit__list">
                {site.address && (
                  <li>
                    <Pin />
                    <span style={{ whiteSpace: "pre-line" }}>{site.address}</span>
                  </li>
                )}
                {site.phone && (
                  <li>
                    <Phone />
                    <span>
                      {site.phone}
                      {site.phone_note ? ` · ${site.phone_note}` : ""}
                    </span>
                  </li>
                )}
                {site.email && (
                  <li>
                    <Mail />
                    <span>{site.email}</span>
                  </li>
                )}
              </ul>
              <div className="visit__actions">
                {site.phone && (
                  <a href={`tel:${site.phone}`} className="btn btn--gold">
                    Call the office <Arrow className="arr" />
                  </a>
                )}
                <a href={mapHref} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
                  Get directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
