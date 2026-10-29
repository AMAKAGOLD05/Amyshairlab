"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { btnHero } from "@/components/ui/styles";
import type { HeroSlide } from "@/types/content";

const INTERVAL_MS = 5000;
const DEFAULT_COLOR = "#FFFDF8";

export function HeroSlider({
  slides,
  eyebrow,
  align,
  textColor,
}: {
  slides: HeroSlide[];
  eyebrow: string;
  align: "left" | "center";
  textColor: string;
}) {
  const active = slides.filter((slide) => slide.enabled && slide.headline.trim());
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const current = active[index] ?? active[0];
  const centered = align !== "left";
  const color = textColor.trim() || DEFAULT_COLOR;
  const usesCustomColor = Boolean(textColor.trim());

  useEffect(() => {
    setMounted(true);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    setIndex(0);
  }, [active.length]);

  useEffect(() => {
    if (!mounted || active.length < 2 || paused || reduceMotion) return;
    const timer = window.setInterval(() => {
      setIndex((value) => (value + 1) % active.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [active.length, mounted, paused, reduceMotion]);

  if (!current) return null;

  const textStyle = usesCustomColor ? { color } : undefined;
  const animate = mounted && !reduceMotion;

  return (
    <div
      className={`flex w-full max-w-2xl flex-col ${
        centered ? "items-center text-center" : "items-start text-left"
      } ${usesCustomColor ? "" : "text-warm-white"}`}
      style={textStyle}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Homepage highlights"
    >
      <span aria-hidden="true" className="mb-2.5 block h-0.5 w-12 bg-gold sm:mb-3 sm:w-14" />
      {eyebrow ? (
        <p className="text-[0.62rem] uppercase tracking-[0.32em] text-gold sm:text-[0.65rem]">{eyebrow}</p>
      ) : null}
      <div
        key={current.id}
        className={animate ? "animate-[rise_0.55s_ease]" : undefined}
        aria-live="polite"
      >
        <h1
          className={`font-serif text-[clamp(1.85rem,4.8vw,3.25rem)] leading-[1.05] tracking-tight text-balance drop-shadow-sm ${
            eyebrow ? "mt-2" : ""
          }`}
          style={textStyle}
        >
          {current.headline}
        </h1>
        {current.supporting ? (
          <p
            className={`mt-2.5 max-w-md text-sm leading-6 text-pretty drop-shadow-sm opacity-95 sm:mt-3 sm:max-w-lg sm:text-[0.95rem] sm:leading-7 ${
              centered ? "mx-auto" : ""
            }`}
            style={textStyle}
          >
            {current.supporting}
          </p>
        ) : null}
        {current.buttonLabel && current.buttonHref ? (
          <div className={`mt-4 sm:mt-5 ${centered ? "flex justify-center" : ""}`}>
            <Link href={current.buttonHref} className={`${btnHero} whitespace-nowrap`}>
              {current.buttonLabel}
            </Link>
          </div>
        ) : null}
      </div>
      {active.length > 1 ? (
        <div
          className={`mt-5 flex gap-2 sm:mt-6 ${centered ? "justify-center" : ""}`}
          role="tablist"
          aria-label="Hero slides"
        >
          {active.map((slide, slideIndex) => {
            const selected = slideIndex === index;
            return (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-label={`Show slide ${slideIndex + 1}: ${slide.headline}`}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  selected ? "bg-gold" : "bg-warm-white/45 hover:bg-warm-white/75"
                }`}
                onClick={() => setIndex(slideIndex)}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
