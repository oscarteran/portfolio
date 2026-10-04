import type { CSSProperties } from "react";
import type { Dictionary } from "@/data/ui";
import { EVENTS, TRACE_HEIGHT, TRACE_WIDTH, YEAR_TICKS, buildTrace } from "@/lib/seismogram";
import Blueprint from "./Blueprint";

type CareerEvent = { code: string; role: string; org: string };

// Built once at module load: the path is deterministic, so it's identical on every render.
const trace = buildTrace();

const paper: CSSProperties = {
  backgroundImage: [
    "repeating-linear-gradient(to right, color-mix(in srgb, var(--color-text) 6%, transparent) 0 1px, transparent 1px 2.5%)",
    "repeating-linear-gradient(to bottom, color-mix(in srgb, var(--color-text) 6%, transparent) 0 1px, transparent 1px 50px)",
  ].join(", "),
};

const AMPLITUDE_LABELS = [
  { label: "+A", top: 44 },
  { label: "0", top: 144 },
  { label: "−A", top: 244 },
];

function Plot() {
  return (
    <>
      <div className="grid grid-cols-[44px_minmax(0,1fr)]">
        <div className="relative border-r border-divider text-[11px] text-neutral-700">
          {AMPLITUDE_LABELS.map(({ label, top }) => (
            <span key={label} className="absolute right-1.5" style={{ top }}>
              {label}
            </span>
          ))}
        </div>
        <div className="relative h-[300px] overflow-hidden" style={paper}>
          <svg
            viewBox={`0 0 ${TRACE_WIDTH} ${TRACE_HEIGHT}`}
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
          >
            <line
              x1="0"
              y1={TRACE_HEIGHT / 2}
              x2={TRACE_WIDTH}
              y2={TRACE_HEIGHT / 2}
              stroke="var(--color-divider)"
              strokeWidth="1"
            />
            <path
              d={trace}
              fill="none"
              stroke="var(--color-accent-700)"
              strokeWidth="1.1"
              vectorEffect="non-scaling-stroke"
              className="trace-draw"
            />
          </svg>
          {EVENTS.map((event) => (
            <div key={event.p}>
              <div className="absolute inset-y-0 border-l border-dashed border-accent-700" style={{ left: `${event.p}%` }} />
              <div className="absolute inset-y-0 border-l border-dashed border-neutral-500" style={{ left: `${event.s}%` }} />
              <span className="absolute top-2 text-[12px] font-bold text-accent-700" style={{ left: `calc(${event.p}% + 4px)` }}>
                P
              </span>
              <span className="absolute top-2 text-[12px] font-bold text-neutral-700" style={{ left: `calc(${event.s}% + 4px)` }}>
                S
              </span>
              <span
                className="tag tag-accent absolute bottom-2.5"
                style={{ left: `calc(${event.magnitudeAt === "p" ? event.p : event.s}% + 4px)` }}
              >
                {event.magnitude}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[44px_minmax(0,1fr)] border-t border-divider">
        <span className="border-r border-divider" />
        <div className="relative h-7 text-[11px] text-neutral-700">
          {YEAR_TICKS.map(({ year, x }) => (
            <span key={year}>
              <span className="absolute top-0 h-1.5 border-l border-neutral-500" style={{ left: `${x}%` }} />
              <span className="absolute top-[9px]" style={{ left: `calc(${x}% - 14px)` }}>
                {year}
              </span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

/** Career timeline drawn as a seismogram: one P/S wave pair per role change. */
export default function Seismogram({ ui, events }: { ui: Dictionary; events: CareerEvent[] }) {
  const s = ui.seismogram;
  const headerCell = "whitespace-nowrap border-l border-divider px-5 py-2.5 text-neutral-700";

  return (
    <div className="mt-14">
      <Blueprint as="figure" aria-label={s.figureLabel}>
        <div className="flex flex-wrap border-b border-divider text-[12px] font-semibold uppercase tracking-[0.08em]">
          <span className="min-w-[220px] flex-1 px-5 py-2.5">{s.title}</span>
          <span className={headerCell}>{s.station}</span>
          <span className={headerCell}>{s.channel}</span>
          <span className={headerCell}>100 sps</span>
        </div>

        {/* Below ~720px the P/S marks and magnitude tags would collide, so the plot keeps a
            minimum width and scrolls sideways inside the figure instead. */}
        <div className="overflow-x-auto" aria-hidden="true">
          <div className="min-w-[720px]">
            <Plot />
          </div>
        </div>

        <ol className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] border-t border-divider">
          {events.map((event) => (
            <li key={event.code} className="flex flex-col gap-0.5 border-r border-divider px-5 py-3.5">
              <span className="text-[12px] font-semibold tracking-[0.08em] text-accent-700">{event.code}</span>
              <span className="text-[15px] font-medium">{event.role}</span>
              <span className="text-[13px] text-neutral-700">{event.org}</span>
            </li>
          ))}
        </ol>
      </Blueprint>
      <p className="mt-3 max-w-[90ch] text-[13px] leading-normal text-neutral-700">{s.caption}</p>
    </div>
  );
}
