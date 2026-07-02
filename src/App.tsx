import { MotionConfig } from "framer-motion";
import Nav from "./components/Nav";
import Hero from "./components/sections/Hero";
import Problem from "./components/sections/Problem";
import FlowDemo from "./components/sections/FlowDemo";
import Results from "./components/sections/Results";
import SystemParts from "./components/sections/SystemParts";
import AftrakIntegration from "./components/sections/AftrakIntegration";
import FieldDemo from "./components/sections/FieldDemo";
import Impact from "./components/sections/Impact";
import FutureWork from "./components/sections/FutureWork";
import Footer from "./components/sections/Footer";

/** Section registry drives both the sticky nav and the page order. */
export const sections = [
  { id: "problem", label: "Problem" },
  { id: "flow", label: "How it works" },
  { id: "results", label: "Results" },
  { id: "system", label: "The system" },
  { id: "aftrak", label: "Aftrak" },
  { id: "field", label: "In the field" },
  { id: "impact", label: "Impact" },
  { id: "future", label: "Future work" },
] as const;

export default function App() {
  return (
    // reducedMotion="user" makes every Framer Motion animation respect
    // the OS-level prefers-reduced-motion setting automatically.
    <MotionConfig reducedMotion="user">
      <Nav />
      <main>
        <Hero />
        <Problem />
        <FlowDemo />
        <Results />
        <SystemParts />
        <AftrakIntegration />
        <FieldDemo />
        <Impact />
        <FutureWork />
      </main>
      <Footer />
    </MotionConfig>
  );
}
