"use client";

import { ExternalLink, GitBranch, Users, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const icons: LucideIcon[] = [GitBranch, Users, Zap, ExternalLink, GitBranch, Zap];

export function Projects() {
  const { t } = useLanguage();

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-slate-900/50">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl text-white mb-12"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t.projects.title}
          </motion.h2>

          <motion.div
            className="grid lg:grid-cols-2 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09 } } }}
          >
            {t.projects.items.map((project, index) => {
              const Icon = icons[index];
              return (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 36, rotate: -1 },
                  visible: { opacity: 1, y: 0, rotate: 0, transition: { duration: 0.5, ease: "easeOut" } },
                }}
                className="group bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-colors">
                    <Icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl text-white mb-1">{project.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <span>{project.company}</span>
                      <span>•</span>
                      <span>{project.period}</span>
                    </div>
                  </div>
                </div>

                <p className="text-slate-300 mb-4 leading-relaxed">
                  {project.description}
                </p>

                <div className="mb-4">
                  <h4 className="text-sm text-cyan-400 uppercase tracking-wider mb-2">
                    {t.projects.impactTitle}
                  </h4>
                  <ul className="space-y-1">
                    {project.impact.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-slate-300"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-slate-700/50 text-cyan-300 rounded text-xs border border-slate-600"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            );})}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
