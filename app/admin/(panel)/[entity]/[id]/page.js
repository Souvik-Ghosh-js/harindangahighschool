"use client";

import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { ENTITIES } from "@/lib/entities";
import { api } from "@/components/admin/api";
import { useUI, Loading, StatusBadge } from "@/components/admin/ui";
import { FormFields, initialData, useDirty, SaveBar, okToLeave } from "@/components/admin/Form";
import { useMe } from "@/components/admin/Shell";
import { Icon } from "@/components/admin/icons";

export default function EntityEditor({ params }) {
  const { entity, id } = use(params);
  const def = ENTITIES[entity];
  if (!def) notFound();
  const isNew = id === "new";
  const router = useRouter();
  const me = useMe();
  const { toast, confirm } = useUI();
  const fields = useMemo(() => def.fields.filter((f) => f.name !== "status"), [def]);
  const [data, setData] = useState(isNew ? initialData(fields) : null);
  const [saved, setSaved] = useState(isNew ? initialData(fields) : null);
  const [meta, setMeta] = useState({ status: "draft", slug: "" });
  const [saving, setSaving] = useState(false);
  const dirty = useDirty(data, saved);

  useEffect(() => {
    if (isNew) return;
    api(`/api/admin/e/${entity}/${id}`).then(
      ({ item }) => {
        const d = initialData(fields, item);
        setData(d);
        setSaved(d);
        setMeta({ status: item.status, slug: item.slug, kind: item.kind });
      },
      (e) => toast(e.message, "error")
    );
  }, [entity, id, isNew, fields, toast]);

  const save = async (status) => {
    const missing = fields.find((f) => f.required && (data[f.name] == null || data[f.name] === ""));
    if (missing) return toast(`Please fill in “${missing.label}”.`, "error");
    setSaving(true);
    try {
      const body = { ...data, status };
      const r = isNew ? await api(`/api/admin/e/${entity}`, { method: "POST", body }) : await api(`/api/admin/e/${entity}/${id}`, { method: "PUT", body });
      setSaved(data);
      setMeta((m) => ({ ...m, status, slug: r.slug || m.slug }));
      toast(status === "published" ? "Published — it is now on the website." : "Saved as draft.");
      if (isNew) router.replace(`/admin/${entity}/${r.id}`);
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const archive = async () => {
    if (!(await confirm({ title: `Remove this ${def.singular.toLowerCase()} from the website?`, message: "It will be moved to Archived. You can restore it at any time.", ok: "Remove from website", danger: true }))) return;
    try {
      await api(`/api/admin/e/${entity}/${id}`, { method: "DELETE" });
      toast("Moved to archive.");
      router.push(`/admin/${entity}`);
    } catch (e) {
      toast(e.message, "error");
    }
  };
  const destroy = async () => {
    if (!(await confirm({ title: "Delete permanently?", message: "This cannot be undone.", ok: "Delete forever", danger: true }))) return;
    try {
      await api(`/api/admin/e/${entity}/${id}?permanent=1`, { method: "DELETE" });
      toast("Deleted.");
      router.push(`/admin/${entity}`);
    } catch (e) {
      toast(e.message, "error");
    }
  };

  if (!data) return <Loading />;
  const published = meta.status === "published";
  const publicPath = !isNew && published && meta.slug ? def.publicPath({ slug: meta.slug, kind: data.kind ?? meta.kind }) : null;

  return (
    <div className="adm-page">
      <Link href={`/admin/${entity}`} className="adm-back" onClick={(e) => !okToLeave(dirty) && e.preventDefault()}>
        <Icon name="back" /> All {def.label.toLowerCase()}
      </Link>
      <div className="adm-head">
        <div>
          <h1>{isNew ? `New ${def.singular.toLowerCase()}` : data[def.titleField] || def.singular}</h1>
          <p style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            {!isNew && <StatusBadge status={meta.status} />}
            {publicPath && (
              <a href={publicPath} target="_blank" rel="noopener noreferrer">
                View on website ↗
              </a>
            )}
          </p>
        </div>
      </div>

      {meta.status === "archived" && (
        <div className="a-alert" style={{ marginBottom: 16 }}>
          This {def.singular.toLowerCase()} is archived and not shown on the website. Press <b>Publish</b> to restore it.
        </div>
      )}

      <FormFields fields={fields} data={data} setData={setData} />

      <SaveBar dirty={dirty || isNew} saving={saving}>
        {!isNew && meta.status !== "archived" && (
          <button className="a-btn a-btn--danger" onClick={archive} disabled={saving}>
            <Icon name="trash" /> Remove
          </button>
        )}
        {!isNew && meta.status === "archived" && me?.role === "super" && (
          <button className="a-btn a-btn--danger" onClick={destroy} disabled={saving}>
            Delete forever
          </button>
        )}
        <button className="a-btn a-btn--big" onClick={() => save("draft")} disabled={saving}>
          {published ? "Hide (draft)" : "Save draft"}
        </button>
        <button className="a-btn a-btn--go a-btn--big" onClick={() => save("published")} disabled={saving}>
          {saving ? "Saving…" : published ? "Save changes" : "Publish"}
        </button>
      </SaveBar>
    </div>
  );
}
