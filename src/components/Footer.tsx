export default function Footer({ name, tagline }: { name: string; tagline: string }) {
  return (
    <footer className="mt-24 flex flex-wrap justify-between gap-3 border-t border-divider pb-10 pt-6 text-[13px] text-neutral-700">
      <span>
        © {new Date().getFullYear()} {name}
      </span>
      <span>{tagline}</span>
    </footer>
  );
}
