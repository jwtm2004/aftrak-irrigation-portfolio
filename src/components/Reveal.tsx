import { ReactNode } from "react";
import { motion } from "framer-motion";

interface RevealProps {
  children: ReactNode;
  /** Stagger delay in seconds */
  delay?: number;
  className?: string;
}

/**
 * Scroll-triggered reveal used across all sections. Animates once,
 * slightly before the element fully enters the viewport.
 * (MotionConfig reducedMotion="user" in App.tsx disables it for users
 * who prefer reduced motion.)
 */
export default function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
