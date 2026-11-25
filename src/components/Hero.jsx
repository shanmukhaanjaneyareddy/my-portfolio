import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Download, Github, Linkedin } from "lucide-react";
import { getDirectDriveDownloadUrl } from "../data/portfolioData";

export default function Hero({ personal }) {
  const { name, role, tagline, socials, defaultResumeUrl } = personal;
  const directDownloadUrl = getDirectDriveDownloadUrl(defaultResumeUrl);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent-primary/15 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent-secondary/15 rounded-full blur-[128px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 w-full relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] mb-6"
          >
            Hi, I&apos;m{" "}
            <span className="bg-gradient-to-r from-accent-primary via-sky-300 to-accent-secondary bg-clip-text text-transparent">
              {name}
            </span>
          </motion.h1>

          <motion.h2
            variants={itemVariants}
            className="text-xl sm:text-2xl font-semibold text-slate-200 mb-4"
          >
            {role}
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mb-9"
          >
            {tagline}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-4"
          >
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="#projects"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-accent-primary text-dark-950 font-semibold text-sm shadow-lg shadow-accent-primary/25 hover:bg-sky-300 transition-colors"
            >
              View Projects
              <ArrowRight className="w-4 h-4" />
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href={directDownloadUrl}
              download="Shanmukha_Anjaneya_Reddy_Resume.pdf"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl glass-card text-accent-primary border-accent-primary/30 font-semibold text-sm hover:bg-accent-primary/10 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Resume
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl glass-card text-slate-200 font-semibold text-sm hover:border-white/20 hover:text-white transition-colors"
            >
              Contact Me
            </motion.a>

            <div className="flex items-center gap-2 ml-1">
              <a
                href={socials.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="p-3 rounded-xl glass-card text-slate-300 hover:text-accent-primary hover:border-accent-primary/40 transition-all"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="p-3 rounded-xl glass-card text-slate-300 hover:text-accent-primary hover:border-accent-primary/40 transition-all"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}