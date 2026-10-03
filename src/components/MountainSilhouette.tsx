import type { CSSProperties } from "react";

const VIEWBOX = "0 0 1000 300";

// Both ridges stay below y≈226 wherever x < 560 so they never sit behind the hero text;
// all the relief lives in the empty right half. Irregular spacing and small notches keep
// the profile reading as rock rather than as a line chart.
const MAIN_RIDGE = [
  "M0 266",
  "C70 260 120 252 180 255",
  "C240 258 290 248 350 245",
  "C410 242 460 250 520 243",
  "C545 240 560 234 575 228",
  "L600 219 L618 222 L640 207 L662 200 L676 203",
  "L700 180 L714 176 L732 158 L744 161",
  "L762 132 L774 126 L788 98 L800 78",
  "L812 88 L822 86 L840 106 L853 110",
  "L872 128 L886 124 L906 142 L928 148",
  "C955 158 980 162 1000 166",
].join(" ");

const DISTANT_RIDGE = [
  "M0 272",
  "C150 266 300 262 450 254",
  "C510 250 545 244 575 236",
  "L600 224 L618 219 L640 196 L652 199 L672 160 L684 150 L694 128 L702 124",
  "L712 140 L726 146 L744 172 L760 178 L800 190 L850 186",
  "L880 150 L892 146 L908 118 L918 112 L930 96 L940 102 L954 118 L970 122",
  "L1000 138",
].join(" ");

// Snow caps: each upper edge follows its ridge around a peak; the lower edge is jagged
// and always stays below the ridge so the snow never pokes out of the silhouette.
const MAIN_SNOW =
  "M768 129 L774 126 L788 98 L800 78 L812 88 L822 86 L840 106 L853 110 L858 115 " +
  "L850 118 L842 113 L834 120 L826 110 L818 116 L810 106 L803 114 L796 104 L788 118 L782 121 L774 128 Z";
const DISTANT_SNOW = [
  "M689 139 L694 128 L702 124 L712 140 L706 137 L700 142 L695 136 Z",
  "M916 113 L918 112 L930 96 L940 102 L948 111 L941 112 L934 107 L927 113 L921 110 Z",
];

/** A conifer standing on the shoreline (y=300): stacked tiers that widen downward, on a short trunk. */
function pinePath(cx: number, height: number, width: number) {
  const base = 300;
  const top = base - height;
  const crownBottom = base - height * 0.12;
  const tiers = 5;
  const step = (crownBottom - top) / tiers;
  const half = (i: number) => (width / 2) * (0.3 + (0.7 * i) / tiers);
  const trunk = width * 0.06;
  const r = (n: number) => Math.round(n * 10) / 10;

  const right: string[] = [];
  const left: string[] = [];
  for (let i = 1; i <= tiers; i++) {
    const y = r(top + step * i);
    right.push(`L${r(cx + half(i))} ${y}`);
    left.unshift(`L${r(cx - half(i))} ${y}`);
    if (i < tiers) {
      right.push(`L${r(cx + half(i) * 0.5)} ${y}`);
      left.unshift(`L${r(cx - half(i) * 0.5)} ${y}`);
    }
  }
  const y = r(crownBottom);
  return [
    `M${cx} ${r(top)}`,
    ...right,
    `L${r(cx + trunk)} ${y} L${r(cx + trunk)} ${base} L${r(cx - trunk)} ${base} L${r(cx - trunk)} ${y}`,
    ...left,
    "Z",
  ].join(" ");
}

// [x, height, width] in viewBox units. Kept short enough to clear the hero text above them.
const PINES = [
  [14, 44, 15],
  [30, 60, 19],
  [47, 38, 13],
  [63, 70, 22],
  [82, 50, 16],
  [99, 34, 12],
  [117, 56, 18],
  [137, 42, 14],
  [156, 28, 10],
  [918, 36, 12],
  [934, 52, 17],
  [951, 40, 14],
  [968, 64, 20],
  [987, 46, 15],
].map(([x, h, w]) => pinePath(x, h, w));

function silhouetteMask(ridge: string, mirrored = false) {
  const path = `<path d='${ridge} L1000 300 L0 300 Z' fill='black'/>`;
  const body = mirrored ? `<g transform='translate(0 300) scale(1 -1)'>${path}</g>` : path;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='${VIEWBOX}' preserveAspectRatio='none'>${body}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

const MAIN_MASK = silhouetteMask(MAIN_RIDGE);
const DISTANT_MASK = silhouetteMask(DISTANT_RIDGE);
const MAIN_REFLECTION_MASK = silhouetteMask(MAIN_RIDGE, true);
const DISTANT_REFLECTION_MASK = silhouetteMask(DISTANT_RIDGE, true);

// --mountain-h and --lake-h come from the hero section, which also pads its text by them.
// The mountains stand on the shoreline, --lake-h above the hero's bottom edge; their
// mirror image hangs below the shoreline and fades out by the bottom edge.
// The reflection is foreshortened to REFLECTION_SCALE of the mountain's height so the
// mirrored summit lands inside the (much shorter) lake instead of below the hero.
const REFLECTION_SCALE = 0.45;
const SCENE_HEIGHT = "var(--mountain-h)";
const REFLECTION_HEIGHT = `calc(var(--mountain-h) * ${REFLECTION_SCALE})`;
const SCENE_POSITION = "left 0 bottom var(--lake-h)";
// Offset from the bottom, not `top calc(100% - …)`: in mask-position a percentage means
// "container minus image", which would park the reflection above the shoreline. With the
// image's bottom edge at (lake - its own height), its top edge lands exactly on the shore.
const REFLECTION_POSITION = `left 0 bottom calc(var(--lake-h) - ${REFLECTION_HEIGHT})`;
const SCENE_BOX: CSSProperties = { height: SCENE_HEIGHT, bottom: "var(--lake-h)" };
const REFLECTION_BOX: CSSProperties = { height: REFLECTION_HEIGHT, top: "calc(100% - var(--lake-h))" };

const SOLID = "linear-gradient(black, black)";
// Reflections stay at full strength for the first ~75% of the lake (where the mirrored
// summit lands), then fade out by the hero's bottom edge.
const FADE_INTO_WATER =
  "linear-gradient(to bottom, transparent calc(100% - var(--lake-h)), black calc(100% - var(--lake-h)), black calc(100% - var(--lake-h) * 0.25), transparent 100%)";
// Thin horizontal gaps that break the mirror image up, the way still water does.
const WATER_STRIPES = "repeating-linear-gradient(to bottom, black 0 4px, transparent 4px 5.5px)";
// The spotlight mirrored across the shoreline (and foreshortened like the reflection), so
// the lit part of the mountain lights its reflection too.
const MIRRORED_SPOT = `var(--spot-x) calc(100% - var(--lake-h) + (100% - var(--lake-h) - var(--spot-y)) * ${REFLECTION_SCALE})`;

/** Clips a layer to a silhouette placed at `position`, intersected with `extra` (a full-size layer: a fade or the spotlight). */
function clipTo(silhouette: string, position: string, extra = SOLID): CSSProperties {
  const height = position === REFLECTION_POSITION ? REFLECTION_HEIGHT : SCENE_HEIGHT;
  const image = `${silhouette}, ${extra}`;
  const size = `100% ${height}, 100% 100%`;
  const positions = `${position}, 0 0`;
  return {
    maskImage: image,
    maskSize: size,
    maskPosition: positions,
    maskRepeat: "no-repeat",
    maskComposite: "intersect",
    WebkitMaskImage: image,
    WebkitMaskSize: size,
    WebkitMaskPosition: positions,
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskComposite: "source-in",
  };
}

const dots = (color: string): CSSProperties => ({
  backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1.3px)`,
  backgroundSize: "14px 14px",
});

const SPOT = "var(--spot-x) var(--spot-y)";
const TREE_FILL = "color-mix(in oklab, var(--foreground) 11%, var(--background))";

const delay = (seconds: number): CSSProperties => ({ animationDelay: `${seconds}s` });

function Ridge({ d, opacity, drawDelay }: { d: string; opacity: number; drawDelay: number }) {
  return (
    <svg
      viewBox={VIEWBOX}
      preserveAspectRatio="none"
      className="mountain-draw absolute inset-x-0 w-full text-accent-2"
      style={{ ...SCENE_BOX, ...delay(drawDelay) }}
    >
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeOpacity={opacity}
        strokeWidth={1.2}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function Snow({ paths, opacity, fadeDelay }: { paths: string[]; opacity: number; fadeDelay: number }) {
  return (
    <svg
      viewBox={VIEWBOX}
      preserveAspectRatio="none"
      className="mountain-fade absolute inset-x-0 w-full text-foreground"
      style={{ ...SCENE_BOX, ...delay(fadeDelay) }}
    >
      {paths.map((d) => (
        <path key={d} d={d} fill="currentColor" fillOpacity={opacity} />
      ))}
    </svg>
  );
}

function Pines({ opacity = 1 }: { opacity?: number }) {
  return (
    <g style={{ fill: TREE_FILL }} opacity={opacity}>
      {PINES.map((d) => (
        <path key={d} d={d} />
      ))}
    </g>
  );
}

/** Mountain lake landscape drawn with a denser version of the page's dot grid: a main
 * mountain in front of a fainter distant range, both snow-capped, with pines on the
 * shore and a mirror reflection in the water below. The pointer spotlight
 * (--spot-x/--spot-y, set by <DotBackground> on an ancestor) turns gold only inside the
 * main mountain. Fills its `relative` parent from the top so the dots stay on the same
 * grid as <DotBackground>. On load the ridges draw in, then fill, snow, trees and the
 * reflection fade up. */
export default function MountainSilhouette() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block">
      {/* Distant range */}
      <div
        className="mountain-fade absolute inset-0"
        style={{
          ...dots("color-mix(in oklab, var(--foreground) 16%, transparent)"),
          ...clipTo(DISTANT_MASK, SCENE_POSITION),
          ...delay(1.1),
        }}
      />
      <Ridge d={DISTANT_RIDGE} opacity={0.22} drawDelay={0.8} />
      <Snow paths={DISTANT_SNOW} opacity={0.16} fadeDelay={1.8} />

      {/* Main mountain, over a solid backdrop so it hides the distant range behind it */}
      <div className="absolute inset-0 bg-background" style={clipTo(MAIN_MASK, SCENE_POSITION)} />
      <div
        className="mountain-fade absolute inset-0"
        style={{
          ...dots("color-mix(in oklab, var(--foreground) 34%, transparent)"),
          ...clipTo(MAIN_MASK, SCENE_POSITION),
          ...delay(1.2),
        }}
      />
      <div
        className="mountain-fade absolute inset-0"
        style={{
          background: `radial-gradient(380px circle at ${SPOT}, color-mix(in oklab, var(--accent-2) 22%, transparent), transparent 70%)`,
          ...clipTo(MAIN_MASK, SCENE_POSITION),
          ...delay(1.2),
        }}
      />
      <div
        className="mountain-fade absolute inset-0"
        style={{
          ...dots("var(--accent-2)"),
          ...clipTo(MAIN_MASK, SCENE_POSITION, `radial-gradient(240px circle at ${SPOT}, black, transparent 75%)`),
          ...delay(1.2),
        }}
      />
      <Snow paths={[MAIN_SNOW]} opacity={0.36} fadeDelay={1.7} />
      <Ridge d={MAIN_RIDGE} opacity={0.6} drawDelay={0.55} />

      {/* Pines on the shore, in front of everything */}
      <svg
        viewBox={VIEWBOX}
        preserveAspectRatio="none"
        className="mountain-fade absolute inset-x-0 w-full"
        style={{ ...SCENE_BOX, ...delay(1.5) }}
      >
        <Pines />
      </svg>

      {/* Lake */}
      <div className="mountain-fade absolute inset-0" style={delay(1.9)}>
        {/* Water surface: paler far away where it mirrors the sky, darker close to the viewer */}
        <div
          className="absolute inset-x-0 bottom-0"
          style={{
            top: "calc(100% - var(--lake-h))",
            background:
              "linear-gradient(to bottom, color-mix(in oklab, var(--foreground) 7%, transparent), color-mix(in oklab, var(--foreground) 3%, transparent) 45%, transparent)",
          }}
        />

        {/* Mirror image, broken into thin bands like a still-water reflection */}
        <div
          className="absolute inset-0"
          style={{ maskImage: WATER_STRIPES, WebkitMaskImage: WATER_STRIPES }}
        >
          {/* Smooth tints rather than dots: the dot grid and the stripes beat against each
              other and whole rows of dots vanish; a flat fill also reads as calmer water. */}
          <div
            className="absolute inset-0"
            style={{
              background: "color-mix(in oklab, var(--foreground) 6%, transparent)",
              ...clipTo(DISTANT_REFLECTION_MASK, REFLECTION_POSITION, FADE_INTO_WATER),
            }}
          />
          <div
            className="absolute inset-0 bg-background"
            style={clipTo(MAIN_REFLECTION_MASK, REFLECTION_POSITION, FADE_INTO_WATER)}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "color-mix(in oklab, var(--foreground) 13%, transparent)",
              ...clipTo(MAIN_REFLECTION_MASK, REFLECTION_POSITION, FADE_INTO_WATER),
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(300px circle at ${MIRRORED_SPOT}, color-mix(in oklab, var(--accent-2) 28%, transparent), transparent 70%)`,
              ...clipTo(MAIN_REFLECTION_MASK, REFLECTION_POSITION, FADE_INTO_WATER),
            }}
          />
          <svg
            viewBox={VIEWBOX}
            preserveAspectRatio="none"
            className="absolute inset-x-0 w-full text-accent-2"
            style={{
              ...REFLECTION_BOX,
              maskImage: "linear-gradient(to bottom, black calc(var(--lake-h) * 0.75), transparent var(--lake-h))",
              WebkitMaskImage: "linear-gradient(to bottom, black calc(var(--lake-h) * 0.75), transparent var(--lake-h))",
            }}
          >
            <g transform="translate(0 300) scale(1 -1)">
              <path d={DISTANT_RIDGE} fill="none" stroke="currentColor" strokeOpacity={0.14} strokeWidth={1} vectorEffect="non-scaling-stroke" />
              <path d={MAIN_RIDGE} fill="none" stroke="currentColor" strokeOpacity={0.4} strokeWidth={1} vectorEffect="non-scaling-stroke" />
              {[MAIN_SNOW, ...DISTANT_SNOW].map((d) => (
                <path key={d} d={d} className="text-foreground" fill="currentColor" fillOpacity={0.2} />
              ))}
              <Pines opacity={0.9} />
            </g>
          </svg>
        </div>

        {/* Shoreline and ripples */}
        <div
          className="absolute inset-x-0 h-px"
          style={{
            bottom: "var(--lake-h)",
            background: "linear-gradient(to right, transparent, color-mix(in oklab, var(--foreground) 22%, transparent) 25%)",
          }}
        />
        {[
          { depth: 0.12, left: "68%", width: "12%" },
          { depth: 0.2, left: "18%", width: "16%" },
          { depth: 0.3, left: "54%", width: "18%" },
          { depth: 0.42, left: "80%", width: "15%" },
          { depth: 0.55, left: "34%", width: "22%" },
          { depth: 0.7, left: "62%", width: "24%" },
          { depth: 0.84, left: "8%", width: "20%" },
        ].map((ripple) => (
          <div
            key={ripple.left}
            className="absolute h-px"
            style={{
              top: `calc(100% - var(--lake-h) * ${1 - ripple.depth})`,
              left: ripple.left,
              width: ripple.width,
              background: "linear-gradient(to right, transparent, color-mix(in oklab, var(--foreground) 18%, transparent), transparent)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
