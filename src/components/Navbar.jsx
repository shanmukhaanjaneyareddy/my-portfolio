import React from "react";
import { Download } from "lucide-react";
import { getDirectDriveDownloadUrl } from "../data/portfolioData";

export default function Navbar({ personal }) {
  const resumeHref = getDirectDriveDownloadUrl(personal.defaultResumeUrl);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-dark-950/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a
          href="#"
          className="text-base sm:text-lg font-bold tracking-tight text-slate-100"
        >
          {personal.brandMain}
          <span className="text-accent-primary">{personal.brandAccent}</span>
        </a>

        <nav className="hidden md:flex items-center gap-7 text-sm text-slate-300">
          <a href="#projects" className="hover:text-white transition-colors">
            Projects
          </a>
          <a href="#skills" className="hover:text-white transition-colors">
            Skills
          </a>
          <a href="#credentials" className="hover:text-white transition-colors">
            Education &amp; Certs
          </a>
          <a href="#contact" className="hover:text-white transition-colors">
            Contact
          </a>
        </nav>

        <a
          href={resumeHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-primary text-dark-950 font-semibold text-xs sm:text-sm hover:bg-sky-300 transition-colors"
        >
          <Download className="w-4 h-4" />
          Resume
        </a>
      </div>
    </header>
  );
}