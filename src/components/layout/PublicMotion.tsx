"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CARD_SELECTOR = [
  ".store-product-card",
  ".sponsor-card",
  ".fixture-row",
  ".match-side",
  ".stats-row:not(.header)",
].join(",");

export function PublicMotion() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const root = document.querySelector<HTMLElement>(".public-main");
    if (!root) return;

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add(
        {
          desktop: "(min-width: 801px)",
          mobile: "(max-width: 800px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (match) => {
          const { desktop, reduceMotion } = match.conditions as {
            desktop: boolean;
            mobile: boolean;
            reduceMotion: boolean;
          };

          if (reduceMotion) return;

          const distance = desktop ? 38 : 22;
          const duration = desktop ? 0.82 : 0.62;
          const stagger = desktop ? 0.085 : 0.055;
          const revealStart = desktop ? "top 86%" : "top 92%";
          const hero = root.querySelector<HTMLElement>(".hero");
          const interiorHero = root.querySelector<HTMLElement>(".interior-hero");

          if (hero) {
            const heroTimeline = gsap.timeline({
              defaults: { duration, ease: "power3.out" },
            });

            heroTimeline
              .from(
                ".hero-media",
                {
                  autoAlpha: 0,
                  x: desktop ? 56 : 0,
                  y: desktop ? 0 : -18,
                  scale: 0.97,
                  duration: desktop ? 1 : 0.72,
                },
              )
              .from(".hero h1", { autoAlpha: 0, x: desktop ? -48 : -24 }, "-=0.72")
              .from(".hero-intro", {
                autoAlpha: 0,
                y: desktop ? 14 : 9,
              }, "-=0.48")
              .from(
                ".hero-cta",
                { autoAlpha: 0, y: distance * 0.65 },
                "-=0.5",
              );

            const heroImage = hero.querySelector<HTMLElement>(".hero-media > img");
            if (heroImage) {
              gsap.set(heroImage, { scale: desktop ? 1.07 : 1.035 });
              gsap.to(heroImage, {
                yPercent: desktop ? 9 : 4,
                ease: "none",
                scrollTrigger: {
                  trigger: hero,
                  start: "top top",
                  end: "bottom top",
                  scrub: desktop ? 0.8 : 0.45,
                },
              });
            }
          }

          if (interiorHero) {
            const heroElements = interiorHero.querySelectorAll<HTMLElement>(
              ".eyebrow, h1, .schedule-controls",
            );
            gsap.from(heroElements, {
              autoAlpha: 0,
              y: distance,
              duration,
              ease: "power3.out",
              stagger,
            });
          }

          // .partner-home holds a continuously-scrolling logo marquee — it should
          // already be moving on first paint, not sit invisible until scrolled
          // into view like the rest of the page's fade-in sections.
          root.querySelectorAll<HTMLElement>("section:not(.hero):not(.partner-home)").forEach((section) => {
            gsap.from(section, {
              autoAlpha: 0,
              y: distance,
              duration,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: revealStart,
                once: true,
              },
            });

            const cards = section.querySelectorAll<HTMLElement>(CARD_SELECTOR);
            if (!cards.length) return;

            gsap.from(cards, {
              autoAlpha: 0,
              y: desktop ? 30 : 18,
              duration: duration * 0.9,
              ease: "power2.out",
              stagger,
              scrollTrigger: {
                trigger: section,
                start: revealStart,
                once: true,
              },
            });
          });

          const footerColumns = document.querySelectorAll<HTMLElement>(
            ".footer-main > *, .footer-partners > *, .footer-bottom > *",
          );
          const footer = document.querySelector<HTMLElement>(".site-footer");
          if (footer && footerColumns.length) {
            gsap.from(footerColumns, {
              autoAlpha: 0,
              y: desktop ? 24 : 14,
              duration: duration * 0.85,
              ease: "power2.out",
              stagger: stagger * 0.75,
              scrollTrigger: {
                trigger: footer,
                start: revealStart,
                once: true,
              },
            });
          }
        },
      );
    }, root);

    ScrollTrigger.refresh();

    // Images and fonts that finish loading after this point can shift layout,
    // which leaves ScrollTrigger's cached trigger positions stale. A once-only
    // trigger whose position is wrong can leave a section permanently hidden.
    // Re-run refresh() whenever late-loading assets settle so trigger math
    // reflects final layout.
    const refresh = () => ScrollTrigger.refresh();
    const images = Array.from(root.querySelectorAll("img"));
    const pendingImages = images.filter((img) => !img.complete);
    pendingImages.forEach((img) => img.addEventListener("load", refresh, { once: true }));

    window.addEventListener("load", refresh);
    document.fonts?.ready?.then(refresh);

    return () => {
      window.removeEventListener("load", refresh);
      pendingImages.forEach((img) => img.removeEventListener("load", refresh));
      media.revert();
      context.revert();
    };
  }, [pathname]);

  return null;
}
