import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";

function normalizeUrl(url) {
  if (!url || url === "#") return "";
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export default function ProjectCard({ project, index }) {
  const liveHref = normalizeUrl(project.liveUrl);
  const githubHref = normalizeUrl(project.githubUrl);
  const primaryHref = liveHref || githubHref;

  const handleCardClick = (e) => {
    if (!primaryHref) return;
    if (e.target.closest("a, button")) return;
    window.open(primaryHref, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      onClick={handleCardClick}
      className={`group rounded-2xl glass-card p-6 sm:p-7 flex flex-col justify-between gap-6 transition-all duration-300 hover:border-accent-primary/40 hover:-translate-y-1 ${
        primaryHref ? "cursor-pointer" : ""
      } ${project.featured ? "md:col-span-2" : ""}`}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-accent-primary/10 text-accent-primary border border-accent-primary/20">
            {project.category}
          </span>

          <div className="flex items-center gap-2">
            {githubHref && (
              <a
                href={githubHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} GitHub Repository`}
                className="p-2 rounded-xl bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {liveHref && (
              <a
                href={liveHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${project.title}`}
                className="p-2 rounded-xl bg-accent-primary/15 text-accent-primary hover:bg-accent-primary hover:text-dark-950 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-100 group-hover:text-accent-primary transition-colors inline-flex items-center gap-1.5">
            {primaryHref ? (
              <a
                href={primaryHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5"
              >
                {project.title}
                <ArrowUpRight className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            ) : (
              project.title
            )}
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed mt-2">
            {project.description}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
        {(project.tech || []).map((item) => (
          <span
            key={item}
            className="px-2.5 py-1 rounded-lg bg-dark-900/90 border border-white/10 text-xs font-mono text-slate-300"
          >
            {item}
          </span>
        ))}
      </div>
    </motion.article>
  );
}