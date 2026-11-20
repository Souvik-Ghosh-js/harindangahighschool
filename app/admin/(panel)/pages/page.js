"use client";

import Link from "next/link";
import { BLOCKS, BLOCK_GROUPS } from "@/lib/blocks";
import { useMe } from "@/components/admin/Shell";
import { Icon } from "@/components/admin/icons";

const SUPER_ONLY = new Set(["navigation", "seo", "policies"]);

export default function PagesIndex() {
  const me = useMe();
  return (
    <div className="adm-page">
      <div className="adm-head">
        <div>
          <h1>
            Website pages <span className="adm-bn">· ওয়েবসাইটের পাতা</span>
          </h1>
          <p>Change any text or photo on the website. Choose what you want to edit.</p>
        </div>
      </div>
      {BLOCK_GROUPS.map((g) => (
        <section key={g.id} style={{ marginBottom: 28 }}>
          <h2 style={{ marginBottom: 12 }}>
            {g.label} <span className="adm-bn">· {g.bn}</span>
          </h2>
          <ul className="a-list">
            {Object.entries(BLOCKS)
              .filter(([k, b]) => b.group === g.id && (me?.role === "super" || !SUPER_ONLY.has(k)))
              .map(([k, b]) => (
                <li className="a-row" key={k}>
                  <Link href={`/admin/pages/${k}`} className="a-row__main">
                    <span className="a-thumb">
                      <Icon name="pages" width={22} />
                    </span>
                    <span>
                      <b>
                        {b.label} <span className="adm-bn">· {b.bn}</span>
                      </b>
                      <small>{b.description}</small>
                    </span>
                  </Link>
                  <Icon name="right" width={20} />
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
