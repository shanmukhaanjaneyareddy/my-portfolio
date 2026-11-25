import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Copy, Check, Github, Linkedin, ArrowUpRight } from "lucide-react";

export default function Contact({ personal, contact }) {
  const [copied, setCopied] = useState(false);
  const { name, email, location, socials } = personal;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <footer id="contact" className="pt-24 pb-12 relative border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl glass-card p-8 sm:p-12 text-center relative overflow-hidden mb-16"
        >
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-accent-primary/15 rounded-full blur-[100px] pointer-events-none" />

          <p className="text-xs font-mono uppercase tracking-widest text-accent-primary mb-3">
            {contact.eyebrow}
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold text-slate-100 mb-4">
            {contact.heading}
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-8 text-sm sm:text-base">
            {contact.subtext}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-accent-primary text-dark-950 font-semibold text-sm hover:bg-sky-300 transition-colors shadow-lg shadow-accent-primary/20"
            >
              <Mail className="w-4 h-4" />
              {contact.ctaLabel}
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl glass-card text-slate-200 font-semibold text-sm hover:border-white/25 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied {email}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Email</span>
                </>
              )}
            </button>
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} {name} · {location}
          </p>
          <div className="flex items-center gap-4">
            <a
              href={socials.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-accent-primary transition-colors"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
            <a
              href={socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-accent-primary transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}