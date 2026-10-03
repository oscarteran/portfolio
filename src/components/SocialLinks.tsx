import { Mail } from "lucide-react";
import { site } from "@/data/site";
import { GithubIcon, LinkedinIcon } from "./icons";

/** Icon-only GitHub / LinkedIn / email row, shared by the navbar and footer. */
export default function SocialLinks({ className = "", size = 18 }: { className?: string; size?: number }) {
  const linkClass = "transition-colors hover:text-foreground";
  return (
    <div className={`flex items-center gap-4 text-muted ${className}`}>
      {site.social.github && (
        <a href={site.social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={linkClass}>
          <GithubIcon size={size} />
        </a>
      )}
      {site.social.linkedin && (
        <a
          href={site.social.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className={linkClass}
        >
          <LinkedinIcon size={size} />
        </a>
      )}
      <a href={`mailto:${site.email}`} aria-label="Email" className={linkClass}>
        <Mail size={size} />
      </a>
    </div>
  );
}
