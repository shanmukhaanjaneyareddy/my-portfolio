import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Award, ExternalLink } from "lucide-react";

const SECTION_LABELS = {
  education: "Education",
  internships: "Experience",
  certifications: "Certifications",
};

export default function Credentials({
  education = [],
  internships = [],
  certifications = [],
  order = ["education", "internships", "certifications"],
}) {
  const orderedKeys =
    Array.isArray(order) && order.length > 0
      ? order
      : ["education", "internships", "certifications"];

  const headingTitle = orderedKeys
    .map((key) => SECTION_LABELS[key] || key)
    .join(", ")
    .replace(/, ([^,]*)$/, " & $1");

  const renderSection = (key) => {
    if (key === "education") {
      return (
        <div key="education" className="space-y-4">
          <div className="flex items-center gap-2.5 text-slate-200 font-semibold">
            <div className="p-2 rounded-xl bg-accent-primary/10 text-accent-primary">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-lg">Education</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {education.map((edu, idx) => (
              <motion.div
                key={edu.id || idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="rounded-2xl glass-card p-6 space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-mono text-accent-primary">
                    {edu.period}
                  </span>
                  {edu.location && (
                    <span className="text-xs text-slate-400">
                      {edu.location}
                    </span>
                  )}
                </div>
                <h4 className="text-base font-bold text-slate-100">
                  {edu.degree}
                </h4>
                <p className="text-sm text-slate-300 font-medium">
                  {edu.institution}
                </p>
                {edu.highlights && (
                  <p className="text-xs text-slate-400 leading-relaxed pt-1">
                    {edu.highlights}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      );
    }

    if (key === "internships") {
      return (
        <div key="internships" className="space-y-4">
          <div className="flex items-center gap-2.5 text-slate-200 font-semibold">
            <div className="p-2 rounded-xl bg-accent-secondary/10 text-accent-secondary">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="text-lg">Internships &amp; Simulations</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {internships.map((item, idx) => (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="rounded-2xl glass-card p-6 space-y-2"
              >
                <span className="text-xs font-mono text-accent-secondary">
                  {item.period}
                </span>
                <h4 className="text-base font-bold text-slate-100">
                  {item.role}
                </h4>
                <p className="text-sm text-slate-300 font-medium">
                  {item.organization}
                </p>
                {item.description && (
                  <p className="text-xs text-slate-400 leading-relaxed pt-1">
                    {item.description}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      );
    }

    if (key === "certifications" && certifications.length > 0) {
      return (
        <div key="certifications" className="space-y-4">
          <div className="flex items-center gap-2.5 text-slate-200 font-semibold">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-lg">Certifications</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {certifications.map((cert, idx) => (
              <motion.div
                key={cert.id || idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className="rounded-2xl glass-card p-5 flex flex-col justify-between gap-3 hover:border-accent-primary/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-mono text-slate-400">
                      {cert.date}
                    </span>
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-accent-primary"
                        title="Verify Credential"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-100 leading-snug">
                    {cert.title}
                  </h4>
                </div>
                <p className="text-xs text-accent-primary font-medium">
                  {cert.issuer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <section id="credentials" className="py-24 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto space-y-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <p className="text-xs font-mono uppercase tracking-widest text-accent-primary mb-2">
            Background &amp; Credentials
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {headingTitle}
          </h2>
        </motion.div>

        <div className="space-y-12">
          {orderedKeys.map((key) => renderSection(key))}
        </div>
      </div>
    </section>
  );
}