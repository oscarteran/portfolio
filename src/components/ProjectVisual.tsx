"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { ProjectVisualKind } from "@/data/projects";
import { useSafeReducedMotion } from "@/lib/useSafeReducedMotion";

type VisualProps = {
  seed: string;
  reduceMotion: boolean;
};

const EASE = [0.16, 1, 0.3, 1] as const;

function transition(reduceMotion: boolean, duration: number, delay = 0) {
  return { duration: reduceMotion ? 0 : duration, delay: reduceMotion ? 0 : delay, ease: EASE };
}

/** Idle motion that kicks in once an element's entrance transition has settled.
 * Deliberately a plain <g> (never a motion.* node) carrying a CSS animation: Framer
 * Motion writes its own inline style on motion.* elements imperatively and doesn't
 * reliably re-sync unrelated style props (like a custom `animation`) after the
 * entrance settles, so gating this via a motion element's `style` prop is unreliable
 * under prefers-reduced-motion. A plain wrapper sidesteps that entirely — React's
 * normal reconciliation handles it, and the CSS animation only starts once its
 * `animationDelay` (= this element's own entrance delay + duration) elapses.
 *
 * `restStyle` carries the resting value for an *inherited* SVG property (namely
 * `strokeOpacity`) — the animated child no longer sets that attribute itself (an
 * element's own presentation attribute would otherwise win over the value this
 * wrapper inherits down to it), so the wrapper must supply the resting value even
 * when reduced motion skips the animation. */
function Idle({
  reduceMotion,
  animation,
  delay,
  duration,
  loop = 3,
  origin,
  restStyle,
  children,
}: {
  reduceMotion: boolean;
  animation: "visual-pulse" | "visual-flow" | "visual-scan" | "visual-roll" | "visual-grow";
  delay: number;
  duration: number;
  loop?: number;
  origin?: string;
  restStyle?: React.CSSProperties;
  children: ReactNode;
}) {
  if (reduceMotion) return restStyle ? <g style={restStyle}>{children}</g> : <>{children}</>;
  return (
    <g
      style={{
        ...restStyle,
        animation: `${animation} ${loop}s ease-in-out infinite`,
        animationDelay: `${(delay + duration).toFixed(2)}s`,
        transformOrigin: origin,
      }}
    >
      {children}
    </g>
  );
}

/** A dot travelling left-to-right along a horizontal link, looping — data in transit.
 * Skipped entirely under reduced motion (it's pure ornament, carries no information). */
function Packet({
  from,
  to,
  y,
  delay,
  reduceMotion,
}: {
  from: number;
  to: number;
  y: number;
  delay: number;
  reduceMotion: boolean;
}) {
  if (reduceMotion) return null;
  const distance = to - from;
  return (
    <motion.circle
      cx={from}
      cy={y}
      r={1.1}
      fill="currentColor"
      initial={{ x: 0, opacity: 0 }}
      animate={{ x: [0, distance * 0.2, distance * 0.8, distance], opacity: [0, 1, 1, 0] }}
      transition={{ duration: 1.5, delay, repeat: Infinity, repeatDelay: 0.8, ease: "linear", times: [0, 0.2, 0.8, 1] }}
    />
  );
}

function Link({ x1, x2, y, delay, reduceMotion }: { x1: number; x2: number; y: number; delay: number; reduceMotion: boolean }) {
  return (
    <Idle reduceMotion={reduceMotion} animation="visual-flow" delay={delay} duration={0.4} loop={3.2} restStyle={{ strokeOpacity: 0.5 }}>
      <motion.line
        x1={x1}
        y1={y}
        x2={x2}
        y2={y}
        stroke="currentColor"
        strokeWidth="1"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={transition(reduceMotion, 0.4, delay)}
      />
    </Idle>
  );
}

/** Source documents → agent hub → generated report — RAG agents in production. */
function RagVisual({ reduceMotion }: VisualProps) {
  const hub = { x: 50, y: 20 };
  const hubOrigin = `${hub.x}px ${hub.y}px`;
  const reportBars = [
    { x: 80, h: 5 },
    { x: 84.5, h: 9 },
    { x: 89, h: 7 },
  ];

  return (
    <>
      <motion.g
        initial={{ opacity: 0, y: 4 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={transition(reduceMotion, 0.4, 0)}
      >
        <rect x={6} y={7} width={14} height={18} rx={1.5} fill="none" stroke="currentColor" strokeWidth="1.1" strokeOpacity={0.5} />
        <rect x={10} y={11} width={14} height={18} rx={1.5} className="fill-card" stroke="currentColor" strokeWidth="1.3" />
        <line x1={13} y1={16} x2={21} y2={16} stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeOpacity={0.6} />
        <line x1={13} y1={20} x2={19} y2={20} stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeOpacity={0.6} />
        <line x1={13} y1={24} x2={21} y2={24} stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeOpacity={0.6} />
      </motion.g>

      <Link x1={24} x2={45} y={20} delay={0.25} reduceMotion={reduceMotion} />
      <Link x1={55} x2={76} y={20} delay={0.55} reduceMotion={reduceMotion} />
      <Packet from={24} to={45} y={20} delay={1} reduceMotion={reduceMotion} />
      <Packet from={55} to={76} y={20} delay={1.75} reduceMotion={reduceMotion} />

      <Idle reduceMotion={reduceMotion} animation="visual-pulse" delay={0.4} duration={0.4} loop={2.6} origin={hubOrigin}>
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={transition(reduceMotion, 0.4, 0.4)}
        >
          <circle cx={hub.x} cy={hub.y} r={5} fill="none" stroke="currentColor" strokeWidth="1.3" />
          <circle cx={hub.x} cy={hub.y} r={2} fill="currentColor" />
        </motion.g>
      </Idle>

      <motion.g
        initial={{ opacity: 0, y: 4 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={transition(reduceMotion, 0.4, 0.7)}
      >
        <rect x={76} y={9} width={18} height={22} rx={1.5} fill="none" stroke="currentColor" strokeWidth="1.3" />
        {reportBars.map((bar) => (
          <rect key={bar.x} x={bar.x} y={27 - bar.h} width={3} height={bar.h} fill="currentColor" fillOpacity={0.7} />
        ))}
      </motion.g>
    </>
  );
}

const FORECAST_TODAY = 64;
const FORECAST_END = 96;
// Fixed offsets (not Math.random) so server and client render identical points.
const FORECAST_NOISE = [0.8, -1.2, 1.5, -0.4, -1.6, 1.1, 0.3, -0.9, 1.4, -1.3, 0.6, -0.2, 1.0, -0.7, 0.9, -0.5];

function forecastModel(x: number) {
  return 27 - 0.13 * x + 4 * Math.sin(x / 4.5);
}

function toPoints(points: [number, number][]) {
  return points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
}

/** Noisy actual sales (solid) vs. the model's fit (dashed), which extends past "today"
 * into a forecast inside a widening confidence band — time-series forecasting. */
function TrendVisual({ reduceMotion }: VisualProps) {
  const xs = Array.from({ length: 24 }, (_, i) => 4 + i * 4);
  const futureXs = xs.filter((x) => x >= FORECAST_TODAY);
  const spread = (x: number) => ((x - FORECAST_TODAY) / (FORECAST_END - FORECAST_TODAY)) * 6;

  const actual = xs
    .filter((x) => x <= FORECAST_TODAY)
    .map((x, i): [number, number] => [x, forecastModel(x) + FORECAST_NOISE[i]]);
  const fit = xs.map((x): [number, number] => [x, forecastModel(x)]);
  const band = [
    ...futureXs.map((x): [number, number] => [x, forecastModel(x) - spread(x)]),
    ...[...futureXs].reverse().map((x): [number, number] => [x, forecastModel(x) + spread(x)]),
  ];
  const today = actual[actual.length - 1];
  const todayOrigin = `${today[0]}px ${today[1]}px`;

  return (
    <>
      <motion.polygon
        points={toPoints(band)}
        fill="currentColor"
        fillOpacity={0.14}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={transition(reduceMotion, 0.5, 0.8)}
      />
      <motion.line
        x1={FORECAST_TODAY}
        y1={3}
        x2={FORECAST_TODAY}
        y2={37}
        stroke="currentColor"
        strokeWidth="0.8"
        strokeOpacity={0.35}
        strokeDasharray="1.5 2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={transition(reduceMotion, 0.4, 0.6)}
      />
      {/* No `pathLength` on dashed lines: Framer Motion drives stroke-dasharray itself
          to animate pathLength, which would override the static dash pattern. */}
      <Idle reduceMotion={reduceMotion} animation="visual-flow" delay={0.7} duration={0.5} loop={4} restStyle={{ strokeOpacity: 0.7 }}>
        <motion.polyline
          points={toPoints(fit)}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="3 2.5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={transition(reduceMotion, 0.5, 0.7)}
        />
      </Idle>
      <motion.polyline
        points={toPoints(actual)}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={transition(reduceMotion, 0.8, 0.1)}
      />
      <Idle reduceMotion={reduceMotion} animation="visual-pulse" delay={0.85} duration={0.3} loop={2.6} origin={todayOrigin}>
        <motion.circle
          cx={today[0]}
          cy={today[1]}
          r={1.8}
          fill="currentColor"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={transition(reduceMotion, 0.3, 0.85)}
        />
      </Idle>
    </>
  );
}

/** Three databases converging into a KPI dashboard — ETL pipelines. */
function EtlVisual({ reduceMotion }: VisualProps) {
  const sources = [5, 16, 27];
  const merge = { x: 38, y: 20 };
  const baseline = 30;
  const bars = [
    { x: 65, h: 7 },
    { x: 72, h: 13 },
    { x: 79, h: 10 },
    { x: 86, h: 17 },
  ];

  return (
    <>
      {sources.map((cy, i) => (
        <motion.g
          key={cy}
          initial={{ opacity: 0, x: -3 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={transition(reduceMotion, 0.35, 0.08 * i)}
        >
          <ellipse cx={10} cy={cy} rx={5} ry={1.8} fill="none" stroke="currentColor" strokeWidth="1.2" />
          <path
            d={`M 5 ${cy} L 5 ${cy + 5} A 5 1.8 0 0 0 15 ${cy + 5} L 15 ${cy}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </motion.g>
      ))}

      {sources.map((cy, i) => {
        const delay = 0.3 + 0.08 * i;
        return (
          <Idle
            key={`link-${cy}`}
            reduceMotion={reduceMotion}
            animation="visual-flow"
            delay={delay}
            duration={0.4}
            loop={3.2}
            restStyle={{ strokeOpacity: 0.5 }}
          >
            <motion.line
              x1={15}
              y1={cy + 2.5}
              x2={merge.x}
              y2={merge.y}
              stroke="currentColor"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={transition(reduceMotion, 0.4, delay)}
            />
          </Idle>
        );
      })}

      <motion.circle
        cx={merge.x}
        cy={merge.y}
        r={1.8}
        fill="currentColor"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={transition(reduceMotion, 0.3, 0.6)}
      />
      <Link x1={merge.x} x2={58} y={merge.y} delay={0.65} reduceMotion={reduceMotion} />
      <Packet from={merge.x} to={58} y={merge.y} delay={1.2} reduceMotion={reduceMotion} />

      <motion.rect
        x={58}
        y={5}
        width={36}
        height={30}
        rx={2}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={transition(reduceMotion, 0.4, 0.7)}
      />
      {bars.map((bar, i) => {
        const delay = 0.85 + 0.08 * i;
        return (
          <Idle
            key={bar.x}
            reduceMotion={reduceMotion}
            animation="visual-grow"
            delay={delay + 0.2 * i}
            duration={0.4}
            loop={2.8}
            origin={`${bar.x + 2}px ${baseline}px`}
          >
            <motion.rect
              x={bar.x}
              y={baseline - bar.h}
              width={4}
              height={bar.h}
              fill="currentColor"
              fillOpacity={0.75}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={transition(reduceMotion, 0.4, delay)}
              style={{ originY: 1 }}
            />
          </Idle>
        );
      })}
    </>
  );
}

/** Camera viewfinder over a leaf, with a detection box locking onto a blemish — computer vision. */
function VisionVisual({ reduceMotion }: VisualProps) {
  const corner = 7;
  const corners: [number, number, number, number][] = [
    [4, 4, 1, 0],
    [96, 4, -1, 0],
    [4, 36, 1, 1],
    [96, 36, -1, 1],
  ];
  const spot = { x: 46, y: 18 };
  const box = { x: 40.5, y: 12.5, size: 11 };
  const veins = ["M 42.8 24.1 L 45 29", "M 54.8 18.4 L 58 24.5", "M 54.8 18.4 L 58 12"];
  const boxOrigin = `${box.x + box.size / 2}px ${box.y + box.size / 2}px`;

  return (
    <>
      {corners.map(([x, y, dx, dy], i) => (
        <motion.path
          key={i}
          d={`M ${x + dx * corner} ${y} L ${x} ${y} L ${x} ${y + (dy ? -corner : corner)}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.6 }}
          viewport={{ once: true }}
          transition={transition(reduceMotion, 0.4, 0.05 * i)}
        />
      ))}

      <motion.g
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={transition(reduceMotion, 0.5, 0.2)}
      >
        <path
          d="M 26 31 C 26 18, 44 8, 74 8 C 70 22, 54 33, 26 31 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path d="M 26 31 L 20 36" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M 26 31 Q 50 22 74 8" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity={0.5} />
        {veins.map((d) => (
          <path key={d} d={d} fill="none" stroke="currentColor" strokeWidth="0.8" strokeOpacity={0.4} strokeLinecap="round" />
        ))}
        <circle cx={spot.x} cy={spot.y} r={2} fill="currentColor" />
      </motion.g>

      <Idle reduceMotion={reduceMotion} animation="visual-scan" delay={0.5} duration={0.3} loop={3}>
        <motion.line
          x1={10}
          y1={8}
          x2={90}
          y2={8}
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity={0.35}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={transition(reduceMotion, 0.3, 0.5)}
        />
      </Idle>

      <Idle reduceMotion={reduceMotion} animation="visual-pulse" delay={0.8} duration={0.35} loop={2.4} origin={boxOrigin}>
        <motion.g
          initial={{ opacity: 0, scale: 1.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={transition(reduceMotion, 0.35, 0.8)}
        >
          <rect x={box.x} y={box.y} width={box.size} height={box.size} fill="none" stroke="currentColor" strokeWidth="1.3" />
          <rect x={box.x} y={box.y - 3.5} width={7} height={3.5} fill="currentColor" />
        </motion.g>
      </Idle>
    </>
  );
}

/** Browser page feeding a candlestick chart — scraping news and financial indicators. */
function ScrapeVisual({ reduceMotion }: VisualProps) {
  const candles = [
    { x: 62, open: 30, close: 25, high: 22, low: 33 },
    { x: 69, open: 26, close: 21, high: 18, low: 29 },
    { x: 76, open: 21, close: 24, high: 19, low: 27 },
    { x: 83, open: 23, close: 16, high: 13, low: 25 },
    { x: 90, open: 17, close: 11, high: 8, low: 20 },
  ];
  const textLines = [
    { y: 16, w: 24 },
    { y: 21, w: 18 },
    { y: 26, w: 22 },
  ];

  return (
    <>
      <motion.g
        initial={{ opacity: 0, y: 4 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={transition(reduceMotion, 0.4, 0)}
      >
        <rect x={6} y={6} width={36} height={28} rx={2} fill="none" stroke="currentColor" strokeWidth="1.3" />
        <line x1={6} y1={11} x2={42} y2={11} stroke="currentColor" strokeWidth="1" strokeOpacity={0.6} />
        {[9.5, 12.5, 15.5].map((cx) => (
          <circle key={cx} cx={cx} cy={8.5} r={0.8} fill="currentColor" />
        ))}
      </motion.g>
      {textLines.map((line, i) => (
        <motion.line
          key={line.y}
          x1={10}
          y1={line.y}
          x2={10 + line.w}
          y2={line.y}
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeOpacity={0.55}
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={transition(reduceMotion, 0.3, 0.2 + 0.08 * i)}
        />
      ))}

      <Link x1={42} x2={56} y={20} delay={0.45} reduceMotion={reduceMotion} />
      <Packet from={42} to={56} y={20} delay={1} reduceMotion={reduceMotion} />

      {candles.map((c, i) => {
        const delay = 0.6 + 0.1 * i;
        const rising = c.close < c.open;
        const top = Math.min(c.open, c.close);
        const height = Math.abs(c.open - c.close);
        return (
          <motion.g
            key={c.x}
            initial={{ opacity: 0, y: 3 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={transition(reduceMotion, 0.3, delay)}
          >
            <line x1={c.x} y1={c.high} x2={c.x} y2={c.low} stroke="currentColor" strokeWidth="1" />
            <rect
              x={c.x - 2}
              y={top}
              width={4}
              height={height}
              fill={rising ? "currentColor" : "none"}
              className={rising ? undefined : "fill-card"}
              stroke="currentColor"
              strokeWidth="1"
            />
          </motion.g>
        );
      })}
    </>
  );
}

/** Receipt with a scan line sweeping over it — OCR receipt scanning. */
function ReceiptVisual({ reduceMotion }: VisualProps) {
  const x0 = 34;
  const x1 = 66;
  const y0 = 6;
  const y1 = 34;
  const lineWidths = [20, 14, 22, 11];

  return (
    <>
      <motion.rect
        x={x0}
        y={y0}
        width={x1 - x0}
        height={y1 - y0}
        rx={2}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        initial={{ opacity: 0, y: 4 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={transition(reduceMotion, 0.4, 0.05)}
      />
      {lineWidths.map((width, i) => {
        const y = y0 + 7 + i * 5;
        return (
          <motion.line
            key={y}
            x1={x0 + 5}
            y1={y}
            x2={x0 + 5 + width}
            y2={y}
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeOpacity={0.55}
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={transition(reduceMotion, 0.3, 0.25 + 0.08 * i)}
          />
        );
      })}
      <Idle reduceMotion={reduceMotion} animation="visual-scan" delay={0.65} duration={0.3} loop={2.6}>
        <motion.line
          x1={x0 - 3}
          y1={y0 + 2}
          x2={x1 + 3}
          y2={y0 + 2}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={transition(reduceMotion, 0.3, 0.65)}
        />
      </Idle>
    </>
  );
}

/** Rolling die (the question) beside a chat bubble with a check (the verified rule) — board-game RAG agent. */
function DiceChatVisual({ reduceMotion }: VisualProps) {
  const dieOrigin = "20px 20px";
  const pips: [number, number][] = [
    [15, 15],
    [25, 15],
    [20, 20],
    [15, 25],
    [25, 25],
  ];

  return (
    <>
      <Idle reduceMotion={reduceMotion} animation="visual-roll" delay={0} duration={0.4} loop={3.2} origin={dieOrigin}>
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={transition(reduceMotion, 0.4, 0)}
          style={{ transformOrigin: dieOrigin }}
        >
          <rect x={10} y={10} width={20} height={20} rx={4} fill="none" stroke="currentColor" strokeWidth="1.3" />
          {pips.map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={1.6} fill="currentColor" />
          ))}
        </motion.g>
      </Idle>

      <motion.g
        initial={{ opacity: 0, y: 4 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={transition(reduceMotion, 0.4, 0.3)}
      >
        <rect x={46} y={7} width={46} height={21} rx={4} fill="none" stroke="currentColor" strokeWidth="1.3" />
        <path d="M 54 28 L 50 35 L 62 28" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      </motion.g>

      <Idle reduceMotion={reduceMotion} animation="visual-flow" delay={0.7} duration={0.4} loop={3} restStyle={{ strokeOpacity: 1 }}>
        <motion.path
          d="M 59 17.5 L 66 24 L 80 11"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={transition(reduceMotion, 0.4, 0.7)}
        />
      </Idle>
    </>
  );
}

const VISUALS: Record<ProjectVisualKind, (props: VisualProps) => React.JSX.Element> = {
  rag: RagVisual,
  trend: TrendVisual,
  etl: EtlVisual,
  vision: VisionVisual,
  scrape: ScrapeVisual,
  receipt: ReceiptVisual,
  diceChat: DiceChatVisual,
};

export default function ProjectVisual({ kind, seed }: { kind: ProjectVisualKind; seed: string }) {
  const reduceMotion = useSafeReducedMotion();
  const Visual = VISUALS[kind];
  return (
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-full w-full">
      <Visual seed={seed} reduceMotion={reduceMotion} />
    </svg>
  );
}
