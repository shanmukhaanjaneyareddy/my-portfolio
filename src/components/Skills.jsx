import React from "react";
import { motion } from "framer-motion";
import { Cpu } from "lucide-react";

export default function Skills({ skills }) {
  return (
    <section id="skills" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-xs font-mono uppercase tracking-widest text-accent-primary mb-2">
            Technical Stack
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-100">
            Skills &amp; Technologies
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {skills.map((group, idx) => (
            <motion.div
              key={group.id || group.category}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="rounded-2xl glass-card p-6 hover:border-accent-primary/30 transition-colors"
            >
              <div className="flex items-center gap-2.5 mb-5">
                <div className="p-2 rounded-lg bg-accent-primary/10 text-accent-primary">
                  <Cpu className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-semibold text-slate-100">
                  {group.category}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {group.items.map((skill) => (
                  <motion.span
                    key={skill}
                    whileHover={{ y: -2, scale: 1.03 }}
                    className="px-3 py-1.5 text-xs font-medium rounded-xl bg-dark-800/90 text-slate-200 border border-white/10 hover:border-accent-primary/50 hover:text-accent-primary transition-colors cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}