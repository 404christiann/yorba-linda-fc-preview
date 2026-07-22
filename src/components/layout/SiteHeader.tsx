"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import { prospect } from "@/config/prospect";
import type { FeatureKey } from "@/lib/tiers";
import { useHasFeature } from "@/components/tier/TierProvider";

const NAV_ITEMS: { href: string; label: string; feature?: FeatureKey }[] = [
  { href: "/", label: "Home" }, { href: "/club", label: "About" }, { href: "/roster", label: "Roster" }, { href: "/schedule", label: "Schedule" },
  { href: "/store", label: "Store", feature: "store" },
];

// Pages that open on a full-bleed dark hero — the header starts transparent
// with light text over it, then goes solid on scroll, same as the homepage.
const TRANSPARENT_HERO_PATHS = new Set(["/", "/store", "/sponsors", "/club"]);

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const store = useHasFeature("store");
  const available = (feature?: FeatureKey) => !feature || store;
  const hasTransparentHero = TRANSPARENT_HERO_PATHS.has(pathname);
  useLayoutEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > (hasTransparentHero ? 0 : 24));
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, [pathname, hasTransparentHero]);
  useLayoutEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const showWhiteMarks = hasTransparentHero && !scrolled;
  const affiliations = prospect.branding.affiliations ?? [];
  return <header className="site-header" data-transparent-hero={hasTransparentHero} data-scrolled={scrolled}><div className="brand-cluster"><Link className="brand-lockup" href="/" aria-label={`${prospect.club.name} home`} onClick={() => setOpen(false)}><Image src={prospect.branding.crest} alt="" width={108} height={107} priority/></Link>{affiliations.length > 0 && <><span className="brand-divider" aria-hidden="true"/><div className="brand-affiliations">{affiliations.map((logo) => <span className="brand-affiliation-logo" key={logo.name}><Image src={showWhiteMarks ? logo.whiteLogo : logo.colorLogo} alt={logo.name} width={140} height={140} priority/></span>)}</div></>}</div><nav className="desktop-nav" aria-label="Main navigation">{NAV_ITEMS.filter((item) => available(item.feature)).map((item) => <Link data-active={pathname === item.href} key={item.href} href={item.href}>{item.label}</Link>)}</nav><div className="header-actions"><Link href="/admin" className="admin-link">Admin preview</Link><button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close navigation" : "Open navigation"}><span/><span/></button></div>{open && <div className="mobile-menu" id="mobile-navigation"><div>{NAV_ITEMS.filter((item) => available(item.feature)).map((item, index) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)}><small>0{index + 1}</small>{item.label}</Link>)}</div><Link className="mobile-admin" href="/admin" onClick={() => setOpen(false)}>Open admin preview</Link></div>}</header>;
}
