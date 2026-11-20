"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { BLOCKS } from "@/lib/blocks";
import { api } from "@/components/admin/api";
import { useUI, Loading } from "@/components/admin/ui";
import { FormFields, initialData, useDirty, SaveBar, okToLeave } from "@/components/admin/Form";
import { Icon } from "@/components/admin/icons";

const PUBLIC = {
  site: "/", seo: "/", announcement: "/", popup: "/", navigation: "/", links: "/", policies: "/policies/privacy",
  "home.hero": "/", "home.intro": "/", "home.journey": "/", "home.culture": "/", "home.sections": "/",
  leadership: "/leadership", about: "/about", administration: "/administration", teachers_page: "/teachers",
  academics: "/academics", admission: "/admission", contact: "/contact", notices_page: "/notices", events_page: "/events", gallery_page: "/gallery",
};

export default function BlockEditor({ params }) {
  const { key } = use(params);
  const def = BLOCKS[key];
  if (!def) notFound();
  const { toast } = useUI();
  const [data, setData] = useState(null);
  const [saved, setSaved] = useState(null);
  const [saving, setSaving] = useState(false);
  const dirty = useDirty(data, saved);

  useEffect(() => {
    api(`/api/admin/blocks/${key}`).then(
      (r) => {
        const d = initialData(def.fields, r.data);
        setData(d);
        setSaved(d);
      },
      (e) => toast(e.message, "error")
    );
  }, [key, def, toast]);

  const save = async () => {
    setSaving(true);
    try {
      await api(`/api/admin/blocks/${key}`, { method: "PUT", body: { data } });
      setSaved(data);
      toast("Saved — the website is updated.");
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (!data) return <Loading />;
  return (
    <div className="adm-page">
      <Link href="/admin/pages" className="adm-back" onClick={(e) => !okToLeave(dirty) && e.preventDefault()}>
        <Icon name="back" /> Website pages
      </Link>
      <div className="adm-head">
        <div>
          <h1>
            {def.label} <span className="adm-bn">· {def.bn}</span>
          </h1>
          <p>{def.description}</p>
        </div>
        <a className="a-btn" href={PUBLIC[key] || "/"} target="_blank" rel="noopener noreferrer">
          <Icon name="eye" /> View page
        </a>
      </div>
      <FormFields fields={def.fields} data={data} setData={setData} />
      <SaveBar dirty={dirty} saving={saving} onSave={save} label="Save & publish" />
    </div>
  );
}
