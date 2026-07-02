# Data audit — every hard-coded value and where it lives

All values are defined in `src/data.ts` and imported by components —
no component hard-codes a number. Check each against the dissertation
("Designing an Off-Grid Mobile Irrigation System for Sub-Saharan
Africa", F231082).

## `outletConfigs` (per outlet size: 1.5 / 2.0 / 3.0 mm)

| Field | 1.5 mm | 2 mm | 3 mm | Report source |
|---|---|---|---|---|
| `boomLmin` (mean boom discharge) | 2.93 | 3.33 | 9.47 | §5.2, Fig 13 |
| `returnLmin` (mean return flow) | 14.3 | 14.0 | 8.8 | §5.3, Fig 14 |
| `boomFraction` | 0.1705 | 0.1924 | 0.5179 | §5.3 (mean boom fraction) |
| `cuPercent` (Christiansen CU) | 96.1 | 80.0 | 90.6 | §5.1 |
| `coveragesTo16mm` (250 m² zone) | 91 | 80 | 28 | §5.4, Fig 18 |
| `eventTimeMin` (net 1.6 mm incl. 5–10% loss) | 143.6–151.5 | 126.3–133.4 | 44.5–47 | §5.4 / §6.2 |
| `sectionLminPerHole` (B1-4/B5-8/B9-12/B13-16) | .200/.183/.175/.183 | .267/.167/.167/.233 | .683/.617/.483/.600 | Fig 12 + CU% analysis workbook |

Used by: FlowDemo (split animation, discharge readout, dribble
weighting), Results (all four charts), FieldDemo (coverage counters),
Hero (headline chip).

## `predictedVsMeasured`

| Value | Where | Report source |
|---|---|---|
| 34.6 L/min predicted (3 mm, Cd 0.62 @ 1 bar) | Results honesty card | Table 9 / §6.1 |
| 9.47 L/min measured; 73% error | Results honesty card | §6.1 |
| Back-calculated Cd 0.18–0.31 | Results honesty card | §6.1 |

## `stressBuffering`

| Value | Report source |
|---|---|
| 8.0 days to stress, no irrigation | Table 12 |
| 9.73 days on 2-day rotation | Table 12 / §6.3 |
| 12.41 days with daily operation | §6.6 |
| 4.5 mm/day depletion | Table 12 (Allen, 1998) |
| Gain sensitivity 1.1–2.9 days | §6.3 |

Used by: Results (timeline), Impact (+1.7 / +4.4 day stats).

## `fieldOps`

| Value | Report source |
|---|---|
| 5 km/h tractor speed | §5.4 (Aftrak, 2025) |
| 2 m wetted strip | §5.4 |
| 250 m² zone (25 × 10 m); four zones per 0.1 ha | §5.4 |
| 1.6 mm target event depth | §1.4 / §5.5 |
| 2-day rotation | §2.2 / Table 12 |

Used by: FieldDemo engine (all motion and depth arithmetic).

## `costs`

| Value | Report source |
|---|---|
| £435.57 total purchased cost | §7.2 / Table 13 |
| 75.9% pump + tank share (= £330.60) | §6.6 |
| £104.97 remaining hydraulic + electrical parts | §6.6 |

Used by: SystemParts (cost bar), Impact, Hero chip.

## `systemParts`, `aftrak`, `problem`, `futureWork`

Descriptive text drawn from §§1–3 (components, platform, context) and
§§6.5/7.3 (roadmap). Notable specifics: SEAFLO 51-series 5.0 GPM pump
(§3.3.1), 25 A fuse / 4 mm² cable / BS 7671 (§3.6.2), 400 kg trailer
payload (§3.3.2/§6.5), U-hook frame with no permanent modification
(§3.6.1), 16 outlets (§3.6.3), 52 V integration priority (§7.3).

## Simulation-only constants (visual, not claims)

- `flowEngine.ts`: particle spawn rate (2.4 particles/s per L/min),
  particle speeds, pseudo-gravity — purely visual pacing; the *ratios*
  (boom vs return, per-outlet weighting) come from measured data.
- `fieldEngine.ts`: sim-speed multipliers (60/150/500×) — the elapsed
  time counter always reports real operating minutes derived from
  5 km/h and the measured coverage counts.
