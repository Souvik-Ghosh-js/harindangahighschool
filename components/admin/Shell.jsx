"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { UIProvider, Loading } from "./ui";
import { Icon } from "./icons";
import { api } from "./api";

const MeCtx = createContext(null);
export const useMe = () => useContext(MeCtx);

export const NAV = [
  { href: "/admin", label: "Dashboard", bn: "ড্যাশবোর্ড", icon: "home" },
  { href: "/admin/notices", label: "Notices", bn: "নোটিস", icon: "notice" },
  { href: "/admin/events", label: "Events", bn: "অনুষ্ঠান", icon: "calendar" },
  { href: "/admin/teachers", label: "Teachers & staff", bn: "শিক্ষক", icon: "people" },
  { href: "/admin/departments", label: "Departments", bn: "বিভাগ", icon: "tree" },
  { href: "/admin/albums", label: "Gallery", bn: "গ্যালারি", icon: "photo" },
  { href: "/admin/downloads", label: "Downloads", bn: "ডাউনলোড", icon: "download" },
  { href: "/admin/pages", label: "Website pages", bn: "ওয়েবসাইটের পাতা", icon: "pages" },
];
const SUPER = [
  { href: "/admin/users", label: "Admin users", icon: "users" },
  { href: "/admin/activity", label: "Activity log", icon: "activity" },
];

export default function Shell({ children }) {
  const path = usePathname();
  const [me, setMe] = useState(null);
  useEffect(() => {
    api("/api/admin/me").then(setMe, () => {});
  }, []);
  const active = (href) => (href === "/admin" ? path === "/admin" : path.startsWith(href));
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <UIProvider>
      <MeCtx.Provider value={me}>
        <div className="adm-shell">
          <aside className="adm-side">
            <div className="adm-brand">
              <span>
                Harindanga H.S.
                <small>Website admin</small>
              </span>
            </div>
            <nav className="adm-nav" aria-label="Admin">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} aria-current={active(n.href) ? "page" : undefined}>
                  <Icon name={n.icon} /> {n.label}
                </Link>
              ))}
              {me?.role === "super" && (
                <>
                  <div className="adm-nav__label">Super Admin</div>
                  {SUPER.map((n) => (
                    <Link key={n.href} href={n.href} aria-current={active(n.href) ? "page" : undefined}>
                      <Icon name={n.icon} /> {n.label}
                    </Link>
                  ))}
                </>
              )}
            </nav>
            <div className="adm-side__foot adm-nav">
              <a href="/" target="_blank" rel="noopener noreferrer">
                <Icon name="eye" /> View website
              </a>
              <Link href="/admin/account" aria-current={active("/admin/account") ? "page" : undefined}>
                <Icon name="key" /> My account
              </Link>
              <a href="#" onClick={(e) => (e.preventDefault(), logout())}>
                <Icon name="logout" /> Sign out
              </a>
            </div>
          </aside>
          <div className="adm-main">
            <header className="adm-top">
              <span className="adm-top__brand">Harindanga H.S. · Admin</span>
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="adm-top__user">
                  {me?.name || me?.email}
                  <br />
                  <small>{me ? (me.role === "super" ? "Super Admin" : "Editor") : ""}</small>
                </span>
                <a className="a-icon-btn" href="/" target="_blank" rel="noopener noreferrer" aria-label="View website">
                  <Icon name="eye" />
                </a>
              </span>
            </header>
            {me ? children : <Loading />}
          </div>
          <nav className="adm-bottom" aria-label="Admin quick">
            {[NAV[0], NAV[1], NAV[2], NAV[5], NAV[7]].map((n) => (
              <Link key={n.href} href={n.href} aria-current={active(n.href) ? "page" : undefined}>
                <Icon name={n.icon} />
                {n.label.split(" ")[0]}
              </Link>
            ))}
          </nav>
        </div>
      </MeCtx.Provider>
    </UIProvider>
  );
}
