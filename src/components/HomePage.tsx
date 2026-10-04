import { certification, getCareerEvents, getEducation, getExperience } from "@/data/experience";
import { getMetrics } from "@/data/metrics";
import { getPersonalProjects } from "@/data/personalProjects";
import { getArchitecture, getProjects } from "@/data/projects";
import { getSite } from "@/data/site";
import { getSkills } from "@/data/skills";
import { getUi } from "@/data/ui";
import type { Locale } from "@/lib/i18n";
import Contact from "./Contact";
import Experience from "./Experience";
import Footer from "./Footer";
import Hero from "./Hero";
import Metrics from "./Metrics";
import Navbar from "./Navbar";
import PersonalProjects from "./PersonalProjects";
import Projects from "./Projects";
import Reveal from "./Reveal";
import Seismogram from "./Seismogram";
import Skills from "./Skills";

export default function HomePage({ locale }: { locale: Locale }) {
  const site = getSite(locale);
  const ui = getUi(locale);
  const personalProjects = getPersonalProjects(locale);

  return (
    <>
      <Navbar site={site} ui={ui} locale={locale} />
      <main id="contenido" tabIndex={-1} className="mx-auto w-full max-w-[1440px] flex-1 px-[clamp(20px,5vw,72px)] outline-none">
        <Hero site={site} ui={ui} />
        <Seismogram ui={ui} events={getCareerEvents(locale)} />
        <Reveal>
          <Metrics label={ui.sections.metrics} metrics={getMetrics(locale)} />
        </Reveal>
        <Reveal>
          <Projects projects={getProjects(locale)} arch={getArchitecture(locale)} ui={ui} />
        </Reveal>
        {personalProjects.length > 0 && (
          <Reveal>
            <PersonalProjects ui={ui} projects={personalProjects} />
          </Reveal>
        )}
        <Reveal>
          <Experience
            ui={ui}
            experience={getExperience(locale)}
            education={getEducation(locale)}
            certification={certification}
          />
        </Reveal>
        <Reveal>
          <Skills label={ui.sections.skills} skills={getSkills(locale)} />
        </Reveal>
        <Reveal>
          <Contact site={site} ui={ui} locale={locale} />
        </Reveal>
        <Footer name={site.name} tagline={ui.footer} />
      </main>
    </>
  );
}
