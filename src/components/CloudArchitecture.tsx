import type { CSSProperties, ReactNode } from "react";
import type { CloudArchitecture as Arch, CloudNode } from "@/data/cloudArchitecture";
import Blueprint from "./Blueprint";

const dotGrid: CSSProperties = {
  backgroundImage: "radial-gradient(color-mix(in srgb, var(--color-text) 12%, transparent) 1px, transparent 1px)",
  backgroundSize: "16px 16px",
};

const accentTint = "bg-[color-mix(in_srgb,var(--color-accent)_8%,var(--color-bg))]";

function Step({ n }: { n: number }) {
  return (
    <span className="inline-flex h-[18px] min-w-[18px] items-center justify-center bg-accent px-1 font-heading text-[12px] font-semibold leading-none text-bg">
      {n}
    </span>
  );
}

function Node({ node, className = "" }: { node: CloudNode; className?: string }) {
  const frame = {
    flow: "border border-accent",
    default: "border border-divider",
    optional: "border border-dashed border-neutral-500",
  }[node.kind];
  return (
    <li className={`${frame} flex flex-col gap-1 bg-bg px-3 py-2.5 ${className}`}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-[14px] font-semibold leading-[1.25]">{node.title}</span>
        {(node.tag || node.steps.length > 0) && (
          <span className="flex shrink-0 gap-1">
            {node.tag && <span className="tag tag-neutral px-1.5 py-0.5 text-[10px]">{node.tag}</span>}
            {node.steps.map((n) => (
              <Step key={n} n={n} />
            ))}
          </span>
        )}
      </div>
      <span className="text-[12px] leading-[1.4] text-neutral-700">{node.detail}</span>
    </li>
  );
}

function Zone({
  label,
  sublabel,
  className = "",
  children,
}: {
  label: string;
  sublabel?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-3 p-4 ${className}`}>
      <div className="flex flex-wrap items-baseline gap-x-2 text-[13px]">
        <span className="font-semibold">{label}</span>
        {sublabel && <span className="text-neutral-700">· {sublabel}</span>}
      </div>
      {children}
    </div>
  );
}

const nodeGrid = "grid grid-cols-[repeat(auto-fill,minmax(min(100%,190px),1fr))] gap-2.5";

function Steps({ label, items, numbered }: { label: string; items: string[]; numbered?: boolean }) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-neutral-700">{label}</span>
      <ol className="flex flex-col gap-2 text-[14px] leading-[1.45] text-neutral-800">
        {items.map((item, i) => (
          <li key={item} className="flex gap-2.5">
            {numbered ? (
              <Step n={i + 1} />
            ) : (
              <span aria-hidden="true" className="mt-[9px] h-px w-3 shrink-0 bg-neutral-500" />
            )}
            <span>{item}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Target cloud architecture of the featured case: users, the Mexico data region and the
 * US agent platform side by side on wide screens, stacked on narrow ones. */
export default function CloudArchitecture({ arch }: { arch: Arch }) {
  return (
    <Blueprint as="article" className="mt-7 flex flex-col gap-6 p-8 max-[479px]:p-5">
      <div className="flex flex-col gap-3">
        <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-accent-700">{arch.kicker}</span>
        <h3 className="text-[30px] uppercase tracking-[0.01em]">{arch.title}</h3>
        <p className="max-w-[760px] text-[16px] leading-[1.6] text-neutral-800">{arch.summary}</p>
        <div className="flex flex-wrap gap-2">
          {arch.facts.map((fact) => (
            <span key={fact} className="tag tag-outline">
              {fact}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 border border-divider p-4 max-[479px]:p-2.5" style={dotGrid}>
        <div className="grid gap-4 xl:grid-cols-[minmax(180px,0.6fr)_2.2fr_1.5fr]">
          <Zone label={arch.users.label} className="border border-divider bg-bg">
            <ul className="flex flex-col gap-2.5">
              {arch.users.nodes.map((node) => (
                <Node key={node.title} node={node} />
              ))}
            </ul>
          </Zone>

          <Zone label={arch.region.label} sublabel={arch.region.sublabel} className="border border-text/60 bg-bg">
            {arch.region.groups.map((group) => (
              <div key={group.label} className="flex flex-col gap-2">
                <span className="text-[11px] uppercase tracking-[0.08em] text-neutral-700">{group.label}</span>
                <ul className={nodeGrid}>
                  {group.nodes.map((node) => (
                    <Node key={node.title} node={node} />
                  ))}
                </ul>
              </div>
            ))}
          </Zone>

          <Zone label={arch.agent.label} sublabel={arch.agent.sublabel} className={`border border-accent ${accentTint}`}>
            <ul className={nodeGrid}>
              {arch.agent.nodes.map((node, i) => (
                // The agent spans the full zone width, as the hub of every query.
                <Node key={node.title} node={node} className={i === 0 ? "col-span-full" : ""} />
              ))}
            </ul>
            <p className="mt-auto text-[12px] leading-[1.45] text-neutral-700">{arch.agent.note}</p>
          </Zone>
        </div>

        <Zone label={arch.ops.label} className="border border-divider bg-surface">
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,170px),1fr))] gap-2.5">
            {arch.ops.items.map((item) => (
              <li key={item} className="border border-divider bg-bg px-3 py-2 text-[13px] font-semibold">
                {item}
              </li>
            ))}
          </ul>
        </Zone>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-x-10 gap-y-6">
        <Steps label={arch.flowLabel} items={arch.flow} numbered />
        <div className="flex flex-col gap-6">
          <Steps label={arch.ingestLabel} items={arch.ingest} />
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-neutral-700">
            <span className="flex items-center gap-2">
              <span aria-hidden="true" className="h-3.5 w-5 border border-accent" />
              {arch.legend.flow}
            </span>
            <span className="flex items-center gap-2">
              <span aria-hidden="true" className="h-3.5 w-5 border border-dashed border-neutral-500" />
              {arch.legend.optional}
            </span>
          </div>
        </div>
      </div>
    </Blueprint>
  );
}
