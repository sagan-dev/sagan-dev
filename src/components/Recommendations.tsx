"use client";

import Image from "next/image";
import { Quote } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export function Recommendations() {
  const { t } = useLanguage();

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl text-white mb-12"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t.recommendations.title}
          </motion.h2>

          <motion.div
            className="grid md:grid-cols-2 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
          >
            {t.recommendations.items.map((rec, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
                }}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10"
              >
                <div className="flex items-start gap-4 mb-4">
                  <Image
                    src={rec.image}
                    alt={rec.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full border-2 border-cyan-500/30"
                  />
                  <div className="flex-1">
                    <h3 className="text-white">{rec.name}</h3>
                    <p className="text-sm text-cyan-400">{rec.role}</p>
                    <p className="text-sm text-slate-400">{rec.company}</p>
                  </div>
                  <Quote className="w-8 h-8 text-cyan-500/30" />
                </div>

                <p className="text-slate-300 leading-relaxed mb-4 italic">
                  &ldquo;{rec.text}&rdquo;
                </p>

                <div className="text-sm text-slate-500">{rec.date}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
