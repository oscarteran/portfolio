/** Career seismogram: a deterministic synthetic trace (no runtime randomness, so server and
 * client render the same path) with one P/S wave pair per career event. */

export const TRACE_WIDTH = 1300;
export const TRACE_HEIGHT = 300;

/** Time axis spans 2020.5 → 2026.5: x = (year − 2020.5) / 6. */
export const YEAR_TICKS = [
  { year: "2021", x: 8.3 },
  { year: "2022", x: 25 },
  { year: "2023", x: 41.7 },
  { year: "2024", x: 58.3 },
  { year: "2025", x: 75 },
  { year: "2026", x: 91.7 },
];

/** UNAM (Dec 2021), CBPI (Jun 2022), Minsait (Jul 2024). Positions are % of the width; the
 * S wave arrives 2.2 % after the P wave. Magnitudes are a visual device, not data: they grow
 * with the scope of each stage. `magnitudeAt` says which arrival the tag sits next to. */
export const EVENTS = [
  { p: 24.2, s: 26.4, amplitude: 34, magnitude: "Mw 3.8", magnitudeAt: "p" },
  { p: 32.5, s: 34.7, amplitude: 58, magnitude: "Mw 5.1", magnitudeAt: "s" },
  { p: 66.7, s: 68.9, amplitude: 96, magnitude: "Mw 6.7", magnitudeAt: "s" },
] as const;

export function buildTrace() {
  const mid = TRACE_HEIGHT / 2;
  const samples = 1400;
  const rnd = (i: number) => {
    const s = Math.sin(i * 12.9898) * 43758.5453;
    return s - Math.floor(s) - 0.5;
  };

  let d = "";
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    let y = rnd(i) * 3 + Math.sin(i * 0.31) * 1.2;
    for (const event of EVENTS) {
      const p = event.p / 100;
      const a = event.amplitude;
      // P wave: small amplitude, high frequency, fast decay.
      if (t > p) {
        const dt = t - p;
        y += a * 0.32 * Math.exp(-dt * 90) * Math.sin(dt * 2600) * (0.6 + Math.abs(rnd(i + 7)));
      }
      // S wave: larger, lower frequency, with a long coda.
      const s = event.s / 100;
      if (t > s) {
        const dt = t - s;
        const envelope = Math.min(1, dt * 400) * Math.exp(-dt * 28);
        y += a * envelope * Math.sin(dt * 1100 + rnd(i) * 0.6) * (0.65 + 0.7 * Math.abs(rnd(i + 31)));
      }
    }
    const clamped = Math.max(4, Math.min(TRACE_HEIGHT - 4, mid + y));
    d += `${i ? "L" : "M"}${(t * TRACE_WIDTH).toFixed(1)} ${clamped.toFixed(1)}`;
  }
  return d;
}
