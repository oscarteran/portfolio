import type { CSSProperties } from "react";
import Contact from "@/components/Contact";
import DotBackground from "@/components/DotBackground";
import Experience from "@/components/Experience";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import PersonalProjects from "@/components/PersonalProjects";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Footer from "@/components/Footer";
import { personalProjects } from "@/data/personalProjects";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      {/* Resting spotlight sits on the hero's mountain peak until the pointer moves. */}
      <main id="contenido" tabIndex={-1} className="relative flex-1 outline-none" style={{ "--spot-x": "80%", "--spot-y": "485px" } as CSSProperties}>
        <DotBackground />
        <div className="relative">
          <Hero />
          <Projects />
          {personalProjects.length > 0 && <PersonalProjects />}
          <Experience />
          <Skills />
          <Contact />
          <Footer />
        </div>
      </main>
    </div>
  );
}
