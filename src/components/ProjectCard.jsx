import React, { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github, FolderGit2 } from "lucide-react";

export default function ProjectCard({ project }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative rounded-2xl glass-card p-6 flex flex-col justify-between overflow-hidden transition-colors duration-300 hover:border-accent-primary/40 ${
        project.featured ? "md:col-span-2" : "md:col-span-1"
      }`}
    >
      {/* Cursor-Tracking Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(56, 189, 248, 0.12), transparent 45%)`,
        }}
      />

      <div className="relative z-10">
        {/* Top Row: Category Badge & Links */}
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-accent-primary/10 text-accent-primary">
              <FolderGit2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono uppercase tracking-wider text-accent-primary">
              {project.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title} GitHub`}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title} Live Demo`}
                className="p-2 rounded-lg text-slate-400 hover:text-accent-primary hover:bg-white/10 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-bold text-slate-100 group-hover:text-accent-primary transition-colors mb-3">
          {project.title}
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed mb-6">
          {project.description}
        </p>
      </div>

      {/* Bottom Row: Tech Stack Pills */}
      <div className="relative z-10 flex flex-wrap gap-2 pt-4 border-t border-white/5">
        {project.tech.map((item) => (
          <span
            key={item}
            className="px-2.5 py-1 text-xs font-mono rounded-md bg-dark-800/90 text-slate-300 border border-white/5"
          >
            {item}
          </span>
        ))}
      </div>
    </motion.article>
  );
}
