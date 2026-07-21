"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { prospect } from "@/config/prospect";
import type { FeatureKey } from "@/lib/tiers";
import { useHasFeature, useTier } from "@/components/tier/TierProvider";
import { DisclosureBanner } from "@/components/layout/DisclosureBanner";

type AdminItem = {
  href: string;
  label: string;
  icon: ReactNode;
  feature?: FeatureKey;
};

const iconProps = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  "aria-hidden": true,
};

const ITEMS: AdminItem[] = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: <svg {...iconProps}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  },
  {
    href: "/admin/roster",
    label: "Roster",
    icon: <svg {...iconProps}><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2M16 3.1a4 4 0 0 1 0 7.8M21 21v-2a4 4 0 0 0-3-3.9"/></svg>,
  },
  {
    href: "/admin/schedule",
    label: "Schedule",
    icon: <svg {...iconProps}><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M3 9h18"/></svg>,
  },
  {
    href: "/admin/seasons",
    label: "Seasons",
    feature: "seasons",
    icon: <svg {...iconProps}><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M3 9h18M8 13h3M13 13h3M8 17h3"/></svg>,
  },
  {
    href: "/admin/stats",
    label: "Statistics",
    feature: "stats",
    icon: <svg {...iconProps}><path d="M18 20V10M12 20V4M6 20v-6"/></svg>,
  },
  {
    href: "/admin/sponsors",
    label: "Sponsors",
    feature: "sponsors",
    icon: <svg {...iconProps}><path d="m12 3 7 4v10l-7 4-7-4V7l7-4Z"/><path d="m8.5 12 2.2 2.2 4.8-5"/></svg>,
  },
  {
    href: "/admin/store",
    label: "Shop",
    feature: "store",
    icon: <svg {...iconProps}><path d="M6 8V6a6 6 0 0 1 12 0v2M4 8h16l-1 13H5L4 8Z"/></svg>,
  },
  {
    href: "/admin/analytics",
    label: "Analytics",
    feature: "analytics",
    icon: <svg {...iconProps}><path d="M21 21H5a2 2 0 0 1-2-2V3M7 15l4-4 4 3 4-5"/></svg>,
  },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { tier } = useTier();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const flags = {
    seasons: useHasFeature("seasons"),
    stats: useHasFeature("stats"),
    sponsors: useHasFeature("sponsors"),
    store: useHasFeature("store"),
    analytics: useHasFeature("analytics"),
  };
  const visible = ITEMS.filter((item) => !item.feature || flags[item.feature as keyof typeof flags]);
  const title = ITEMS.find((item) => item.href === pathname)?.label ?? "Admin";
  const isActive = (href: string) => href === "/admin" ? pathname === href : pathname.startsWith(href);

  return (
    <div className="admin-app">
      <DisclosureBanner admin />

      {sidebarOpen && (
        <button
          className="admin-sidebar-scrim"
          aria-label="Close admin navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside id="admin-navigation" className="admin-sidebar" data-open={sidebarOpen}>
        <Link href="/" className="admin-brand" onClick={() => setSidebarOpen(false)}>
          <Image
            src={prospect.branding.crestOnDark ?? prospect.branding.crest}
            alt={`${prospect.club.name} crest`}
            width={42}
            height={42}
            priority
          />
          <span>
            {prospect.club.shortName}
            <small>Admin</small>
          </span>
        </Link>

        <nav aria-label="Admin navigation">
          {visible.map((item) => (
            <Link
              key={item.href}
              data-active={isActive(item.href)}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="admin-user">
          <span>CA</span>
          <p>
            Club Admin
            <small>Preview account · {tier}</small>
          </p>
        </div>
        <Link className="admin-view-site" href="/">
          <svg {...iconProps}><path d="M14 3h7v7M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg>
          View website
        </Link>
      </aside>

      <header className="admin-mobile-head">
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Open admin navigation"
          aria-controls="admin-navigation"
          aria-expanded={sidebarOpen}
        >
          <svg {...iconProps}><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        </button>
        <Image
          src={prospect.branding.crestOnDark ?? prospect.branding.crest}
          alt=""
          width={34}
          height={34}
          priority
        />
        <div>
          <small>{prospect.club.shortName} admin</small>
          <strong>{title}</strong>
        </div>
        <span className="tier-badge">{tier}</span>
      </header>

      <main className="admin-main">{children}</main>
    </div>
  );
}
