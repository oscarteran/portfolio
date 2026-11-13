import type { Site } from "@/data/site";
import type { Dictionary } from "@/data/ui";
import type { Locale } from "@/lib/i18n";
import CvMenu from "./CvMenu";
import LanguageSwitch from "./LanguageSwitch";
import ThemeToggle from "./ThemeToggle";

export default function Navbar({ site, ui, locale }: { site: Site; ui: Dictionary; locale: Locale }) {
  return (
    <header className="sticky top-0 z-10 border-b border-divider bg-bg">
      <div className="flex flex-wrap items-center gap-x-[14px] gap-y-3 px-[clamp(20px,5vw,72px)] py-4">
        <a
          href="#inicio"
          className="mr-auto font-heading text-[18px] font-semibold uppercase tracking-[0.04em] text-text no-underline hover:text-text"
        >
          {site.name}
        </a>
        <nav aria-label={ui.mainNav} className="flex items-center gap-[14px] max-[479px]:hidden">
          {ui.nav.map((item) => (
            <a key={item.href} href={item.href} className="text-[14px] text-text no-underline hover:text-accent">
              {item.label}
            </a>
          ))}
        </nav>
        <LanguageSwitch locale={locale} label={ui.languageLabel} />
        <ThemeToggle label={ui.themeToggle} />
        <CvMenu cvs={site.cvs} label={ui.cv} />
      </div>
    </header>
  );
}
