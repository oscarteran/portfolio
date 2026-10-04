/** Bullet list with an accent em dash as the marker. */
export default function DashList({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <ul className={`flex flex-col text-[15px] leading-[1.55] text-neutral-800 ${className}`}>
      {items.map((item) => (
        <li key={item} className="grid grid-cols-[16px_1fr]">
          <span aria-hidden="true" className="text-accent-700">
            —
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
