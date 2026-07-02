import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { sections } from "../App";

/**
 * Sticky top navigation with a scroll-progress bar and active-section
 * highlighting. Links are plain anchors so keyboard + smooth-scroll
 * behaviour comes for free from the browser.
 */
export default function Nav() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28 });
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      // A narrow band around the upper-middle of the viewport decides
      // which section counts as "current".
      { rootMargin: "-35% 0px -55% 0px" },
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-edge/70 bg-ink/85 backdrop-blur">
      <motion.div
        aria-hidden
        className="absolute inset-x-0 top-0 h-0.5 origin-left bg-gradient-to-r from-leaf via-water to-ember"
        style={{ scaleX: progress }}
      />
      <nav
        className="wrap flex h-14 items-center justify-between gap-4"
        aria-label="Sections"
      >
        <a
          href="#top"
          className="font-display text-sm font-semibold tracking-tight text-mist"
        >
          <span className="text-leaf-bright">Aftrak</span> Irrigation
          <span className="hidden text-fog sm:inline"> · MEng Dissertation</span>
        </a>
        <ul className="hidden items-center gap-1 md:flex">
          {sections.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={active === id ? "true" : undefined}
                className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                  active === id
                    ? "bg-leaf/15 text-leaf-bright"
                    : "text-fog hover:text-mist"
                }`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        {/* Mobile: jump straight to the centrepiece demo */}
        <a
          href="#flow"
          className="rounded-full border border-leaf/50 px-3 py-1.5 text-sm text-leaf-bright md:hidden"
        >
          How it works
        </a>
      </nav>
    </header>
  );
}
