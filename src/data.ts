/**
 * data.ts — single source of truth for every real data value on the site.
 *
 * All values come from the final-year report:
 *   "Designing an Off-Grid Mobile Irrigation System for Sub-Saharan Africa"
 *   (F231082, Loughborough University, 25WS50META, 2026)
 * Section / table references are noted per value so they can be checked
 * against the report. Nothing on the site should hard-code a number —
 * import it from here instead. See DATA_SOURCES.md for the full audit list.
 */

/* ------------------------------------------------------------------ */
/* Identity                                                            */
/* ------------------------------------------------------------------ */

export const identity = {
  name: "Joseph McCarthy",
  degree: "MEng Mechanical Engineering",
  university: "Loughborough University",
  collaboration: "in collaboration with Aftrak",
  supervisor: "Dr Toby Williams (Aftrak)",
  projectTitle: "Off-Grid Mobile Irrigation for Sub-Saharan Africa",
  positioning:
    "A low-cost, solar-powered mobile irrigation system designed to buffer smallholder crops against dry spells in Sub-Saharan Africa.",
  links: {
    email: "mailto:jwtm2004@gmail.com",
    linkedin: "https://www.linkedin.com/in/joseph-mccarthy-874786213/",
    github: "https://github.com/jwtm2004/aftrak-irrigation-portfolio",
  },
};

/* ------------------------------------------------------------------ */
/* Outlet configurations — the core experimental results               */
/* ------------------------------------------------------------------ */

export interface OutletConfig {
  id: "1.5" | "2.0" | "3.0";
  label: string;
  holeDiameterMm: number;
  /** Mean boom discharge, L/min — report Section 5.2 / Figure 13 */
  boomLmin: number;
  /** Mean open-return flow, L/min — report Section 5.3 / Figure 14 */
  returnLmin: number;
  /** Share of pumped flow discharged by the boom (0–1) — Section 5.3 */
  boomFraction: number;
  /** Christiansen Uniformity Coefficient, % — Section 5.1 */
  cuPercent: number;
  /** Full-zone coverages to build a 1.6 mm event on 250 m² — Figure 18 */
  coveragesTo16mm: number;
  /** Minutes to deliver a net 1.6 mm event incl. 5–10% field loss — Section 5.4 */
  eventTimeMin: [number, number];
  /**
   * Measured mean discharge per hole (L/min) for boom sections
   * B1-4 / B5-8 / B9-12 / B13-16 — the end-high, centre-low pattern
   * (report Figure 12; raw values from the CU% analysis workbook).
   */
  sectionLminPerHole: [number, number, number, number];
  selected: boolean;
}

export const outletConfigs: OutletConfig[] = [
  {
    id: "1.5",
    label: "1.5 mm",
    holeDiameterMm: 1.5,
    boomLmin: 2.93,
    returnLmin: 14.3,
    boomFraction: 0.1705,
    cuPercent: 96.1,
    coveragesTo16mm: 91,
    eventTimeMin: [143.6, 151.5],
    sectionLminPerHole: [0.2, 0.183, 0.175, 0.183],
    selected: false,
  },
  {
    id: "2.0",
    label: "2 mm",
    holeDiameterMm: 2.0,
    boomLmin: 3.33,
    returnLmin: 14.0,
    boomFraction: 0.1924,
    cuPercent: 80.0,
    coveragesTo16mm: 80,
    eventTimeMin: [126.3, 133.4],
    sectionLminPerHole: [0.267, 0.167, 0.167, 0.233],
    selected: false,
  },
  {
    id: "3.0",
    label: "3 mm",
    holeDiameterMm: 3.0,
    boomLmin: 9.47,
    returnLmin: 8.8,
    boomFraction: 0.5179,
    cuPercent: 90.6,
    coveragesTo16mm: 28,
    eventTimeMin: [44.5, 47],
    sectionLminPerHole: [0.683, 0.617, 0.483, 0.6],
    selected: true, // the configuration that met the design requirement
  },
];

/* ------------------------------------------------------------------ */
/* Predicted vs measured — the engineering-judgement story             */
/* ------------------------------------------------------------------ */

export const predictedVsMeasured = {
  /** Idealised orifice model, 3 mm boom @ Cd 0.62, 1 bar — Table 9 */
  predictedLmin: 34.6,
  /** Measured mean, 3 mm boom — Section 5.2 */
  measuredLmin: 9.47,
  /** Section 6.1 */
  errorPercent: 73,
  explanation:
    "The system ran well below the assumed 1 bar, and the open-return relief path is invisible to a single-outlet orifice model. Back-calculated discharge coefficients for the drilled PVC bores were 0.18–0.31 — roughly a quarter to half of the textbook sharp-edged value.",
};

/* ------------------------------------------------------------------ */
/* Agronomic payoff — soil-moisture stress buffering (Table 12, §6.3)  */
/* ------------------------------------------------------------------ */

export const stressBuffering = {
  /** Days to readily-available-water stress threshold, no irrigation */
  daysNoIrrigation: 8.0,
  /** With 3 mm config on a 2-day rotation */
  daysTwoDayRotation: 9.73,
  /** With daily operation — Section 6.6 */
  daysDaily: 12.41,
  /** Assumed net soil-moisture depletion, mm/day (Allen, 1998) */
  depletionMmDay: 4.5,
  /** Sensitivity range for the 2-day-rotation buffering gain, days — §6.3 */
  gainSensitivityDays: [1.1, 2.9] as [number, number],
};

/* ------------------------------------------------------------------ */
/* Field operation parameters (report Section 5.4)                     */
/* ------------------------------------------------------------------ */

export const fieldOps = {
  tractorSpeedKmh: 5, // Aftrak AFT-e1 working speed used in the simulation
  wettedStripM: 2, // wetted strip width laid down per pass
  zoneAreaM2: 250, // one irrigation zone: 25 m × 10 m
  zoneLengthM: 25,
  zoneWidthM: 10,
  targetEventDepthMm: 1.6, // design requirement per event
  fieldZones: 4, // four 250 m² zones inside a 0.1 ha field
  rotationDays: 2, // each zone revisited every 2 days
};

/* ------------------------------------------------------------------ */
/* Bill of materials / cost story (report Table 13, Section 6.6)       */
/* ------------------------------------------------------------------ */

export const costs = {
  totalGbp: 435.57,
  /** Pump + tank share of total spend — Section 6.6 */
  pumpTankSharePercent: 75.9,
  pumpTankGbp: 330.6, // = 75.9% of £435.57
  /** Everything needed to build the dribble bar itself (hydraulic +
   *  electrical parts excluding pump & tank) — Section 6.6 */
  dribbleBarPartsGbp: 104.97,
};

/* ------------------------------------------------------------------ */
/* System components (report Sections 3.3–3.6)                         */
/* ------------------------------------------------------------------ */

export interface SystemPart {
  id: string;
  name: string;
  role: string;
  spec: string;
  cost: string;
  group: "hydraulic" | "structure" | "electrical";
}

export const systemParts: SystemPart[] = [
  {
    id: "tank",
    name: "400 L flat baffled MDPE tank",
    role: "Water storage sized to the trailer payload and supplemental-irrigation duty",
    spec: "Low-profile geometry lowers towing centre of gravity; internal baffles cut sloshing; translucent walls show water level; 1″ BSP outlet",
    cost: "Pump + tank together: £330.60 (75.9% of build)",
    group: "hydraulic",
  },
  {
    id: "pump",
    name: "SEAFLO 51-series 12 V DC diaphragm pump",
    role: "Self-priming low-pressure supply matched to the dribble bar duty point",
    spec: "~5.0 GPM (18.9 L/min) open flow, 60 PSI cut-off; no loss of prime across all tests",
    cost: "Included in £330.60 pump + tank",
    group: "hydraulic",
  },
  {
    id: "boom",
    name: "21.5 mm PVC boom + solvent-weld fittings",
    role: "The dribble bar itself — cheap, light, easy to modify between test iterations",
    spec: "Overflow-grade PVC accepted as a prototype trade-off; PN10 pressure-rated recommended for field durability",
    cost: "Within £104.97 dribble-bar parts",
    group: "hydraulic",
  },
  {
    id: "tee",
    name: "Central tee junction",
    role: "Splits pumped flow into equal left / right boom arms",
    spec: "Threaded tee; equal-length arms keep the split symmetric",
    cost: "Within £104.97 dribble-bar parts",
    group: "hydraulic",
  },
  {
    id: "outlets",
    name: "16 drilled outlets",
    role: "The hydraulic control variable — outlet size sets the boom / return split",
    spec: "Tested at 1.5, 2 and 3 mm; final configuration 3 mm",
    cost: "—",
    group: "hydraulic",
  },
  {
    id: "returns",
    name: "Open-return hoses (both arm ends)",
    role: "Passive pressure relief routing excess flow back to the tank — not a leak",
    spec: "½″ bore, fully open; kept boom pressure low and stable",
    cost: "Within £104.97 dribble-bar parts",
    group: "hydraulic",
  },
  {
    id: "valve",
    name: "Ball valve",
    role: "Flow control and isolation during testing",
    spec: "Full-bore; half-open test showed outlet geometry, not the valve, governs the split",
    cost: "Within £104.97 dribble-bar parts",
    group: "hydraulic",
  },
  {
    id: "frame",
    name: "Removable steel mounting frame",
    role: "Clamps the whole system to the Aftrak trailer with zero permanent modification",
    spec: "5 mild-steel members — guillotined, bent, welded; secured with U-hooks",
    cost: "Fabricated in-house (workshop stock)",
    group: "structure",
  },
  {
    id: "electrics",
    name: "12 V DC electrical circuit",
    role: "Deliberately simple power circuit with basic overcurrent protection",
    spec: "25 A inline blade fuse, manual battery isolator, 4 mm² conductors sized to BS 7671 for the pump's 17 A max draw",
    cost: "Within £104.97 dribble-bar parts",
    group: "electrical",
  },
];

/* ------------------------------------------------------------------ */
/* Aftrak platform context (report Section 1.2, Table 1)               */
/* ------------------------------------------------------------------ */

export const aftrak = {
  platform: "Aftrak AFT-e1 electric micro-tractor",
  facts: [
    "Low-cost, walk-behind electric micro-tractor designed for fragmented SSA smallholder terrain",
    "Solar-charged battery power with a PTO output for implements",
    "Trailer rated to a 400 kg payload — the full 400 L tank must respect a marked max fill level",
    "Currently in field trials in Malawi",
  ],
  integrationStatus:
    "The prototype ran on a standalone 12 V DC supply for laboratory testing. Integrating with the tractor's 52 V DC electrical architecture is the immediate future-work priority, so the whole tractor-implement system runs off one solar-charged battery at near-zero running cost.",
};

/* ------------------------------------------------------------------ */
/* Problem framing (report Sections 1–2)                               */
/* ------------------------------------------------------------------ */

export const problem = {
  drySpellDefinition:
    "Five or more consecutive days below a critical rainfall threshold — occurring inside otherwise adequate wet seasons",
  malawiContext: [
    "Fragmented plots under 2 ha",
    "Limited or no grid electricity",
    "Limited water infrastructure",
    "Rain-fed farming dominates",
  ],
  gap: "No existing irrigation option is simultaneously low-cost, mobile, off-grid and low-labour. Manual methods don't scale; petrol pumps add fuel dependency; drip and sprinkler systems cost too much and demand too much pressure, filtration and maintenance.",
};

/* ------------------------------------------------------------------ */
/* Future work roadmap (report Sections 6.5, 7.3)                      */
/* ------------------------------------------------------------------ */

export const futureWork = [
  {
    title: "52 V DC integration with the Aftrak battery",
    detail:
      "Move off the standalone 12 V lab supply so tractor and implement share one solar-charged battery. Immediate priority.",
    priority: true,
  },
  {
    title: "Field trials in Malawi",
    detail:
      "Validate lab predictions against real soil, terrain and water quality — and measure the site-specific crop and soil parameters the sensitivity analysis flagged.",
    priority: false,
  },
  {
    title: "Purpose-built implement",
    detail:
      "Integrate tank, pump and boom into a single unit, replacing the retrofit trailer arrangement and enabling scaling to larger plots.",
    priority: false,
  },
  {
    title: "Variable orifice sizing along the boom",
    detail:
      "Larger holes at the boom centre, smaller at the ends, to counter the measured end-high / centre-low pattern and lift uniformity.",
    priority: false,
  },
  {
    title: "Adjustable return-line valves",
    detail:
      "Tune the boom-discharge fraction in the field without re-drilling outlets.",
    priority: false,
  },
  {
    title: "Flexible outlet tube extensions",
    detail:
      "Deliver water at root level to cut evaporation and wind-drift losses — a step toward a low-pressure surface-drip concept.",
    priority: false,
  },
  {
    title: "Field-ready pipework and fill marking",
    detail:
      "PN10 pressure-rated pipework and a marked maximum fill level to stay within the 400 kg trailer payload.",
    priority: false,
  },
];

/* ------------------------------------------------------------------ */
/* Site assets (in /public/assets). Alt text doubles as the caption.   */
/* ------------------------------------------------------------------ */

export const assets = {
  report: {
    path: "assets/Joseph-McCarthy-MEng-Dissertation.pdf",
    label: "Full dissertation report (PDF, 61 pages)",
  },
  poster: {
    path: "assets/poster.jpg",
    label: "Dissertation poster summarising the project — design, testing and results",
  },
  render: {
    path: "assets/prototype-render.jpg",
    label:
      "Concept visualisation of the trailer-mounted system in a Malawi field: 400 L tank, SEAFLO pump, 16-outlet dribble bar and clear open-return hoses (AI-assisted render)",
  },
  fabrication: {
    path: "assets/fabrication-frame.jpg",
    label:
      "The removable steel mounting frame during fabrication in the Wolfson workshop — cut, bent and welded mild-steel members",
  },
  aftrakPlatform: {
    path: "assets/aftrak-afte1.jpg",
    label: "The Aftrak AFT-e1 walk-behind electric micro-tractor",
  },
};
