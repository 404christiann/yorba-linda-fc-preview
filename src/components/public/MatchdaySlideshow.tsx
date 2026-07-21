"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { prospect } from "@/config/prospect";

const SLIDES = (prospect.branding.galleryImages ?? []).map((slide) =>
  typeof slide === "string" ? { src: slide, orientation: "portrait" as const } : slide,
);
const SLIDE_DURATION = 4000;

export function MatchdaySlideshow() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (SLIDES.length < 2 || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      setCurrent((index) => (index + 1) % SLIDES.length);
    }, SLIDE_DURATION);

    return () => window.clearInterval(timer);
  }, [paused]);

  const selectSlide = (index: number) => setCurrent(index);
  const previousSlide = () => setCurrent((index) => (index - 1 + SLIDES.length) % SLIDES.length);
  const nextSlide = () => setCurrent((index) => (index + 1) % SLIDES.length);

  if (!SLIDES.length) return null;

  return (
    <section
      className="matchday-slideshow"
      aria-labelledby="matchday-slideshow-title"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="matchday-slides" aria-live="polite">
        {SLIDES.map((slide, index) => (
          <div
            className="matchday-slide"
            data-active={index === current}
            data-orientation={slide.orientation ?? "portrait"}
            key={slide.src}
            aria-hidden={index !== current}
          >
            <Image className="matchday-slide-backdrop" src={slide.src} alt="" fill sizes="100vw" />
            <div className="matchday-slide-shade" />
            <div className="matchday-slide-image">
              <Image
                src={slide.src}
                alt={slide.alt ?? `${prospect.club.name} matchday photo ${index + 1}`}
                fill
                sizes="(max-width: 800px) 100vw, 62vw"
                style={{ objectPosition: slide.objectPosition ?? "center" }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="matchday-copy">
        <h2 id="matchday-slideshow-title">{prospect.copy.home.gallerySectionHeadline[0]}<br/><em>{prospect.copy.home.gallerySectionHeadline[1]}</em></h2>
      </div>

      <div className="matchday-controls">
        <div className="matchday-arrows">
          <button type="button" onClick={previousSlide} aria-label="Previous matchday photo">←</button>
          <button type="button" onClick={nextSlide} aria-label="Next matchday photo">→</button>
        </div>
        <span className="matchday-count">{String(current + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}</span>
        <div className="matchday-progress" aria-label="Choose a matchday photo">
          {SLIDES.map((slide, index) => (
            <button
              type="button"
              key={slide.src}
              data-active={index === current}
              aria-label={`Show matchday photo ${index + 1}`}
              aria-current={index === current ? "true" : undefined}
              onClick={() => selectSlide(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
