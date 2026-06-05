"use client";

import Image from "next/image";
import { Mail, Linkedin, ChevronDown, PhoneCall } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useContactForm } from "@/contexts/ContactFormContext";

interface HeroProps {
  onOpenForm?: () => void;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export function Hero({ onOpenForm }: HeroProps) {
  const { t } = useLanguage();
  const { openBooking } = useContactForm();
  return (
    <section className="min-h-screen flex relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 lg:px-24 flex flex-col justify-center">
        <div className="grid md:grid-cols-2 gap-12 md:items-end min-h-screen">
          <motion.div
            className="order-1 md:order-2 space-y-6 self-center pt-[10%] text-center md:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="space-y-2" variants={fadeUp}>
              <h1 className="text-5xl md:text-6xl lg:text-7xl text-white tracking-tight">
                {t.hero.name}
              </h1>
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <div className="h-px bg-gradient-to-r from-cyan-500 to-transparent w-12"></div>
                <p className="text-xl md:text-2xl text-cyan-400 uppercase tracking-wider">
                  {t.hero.title}
                </p>
              </div>
            </motion.div>

            <motion.p
              className="text-lg text-slate-300 leading-relaxed max-w-xl"
              variants={fadeUp}
            >
              {t.hero.description}
            </motion.p>

            <motion.div
              className="flex gap-4 pt-4 justify-center md:justify-start"
              variants={fadeUp}
            >
              <button
                onClick={() => {
                  onOpenForm?.();
                  window.dataLayer?.push({ event: "contact_form_opened_from_hero" });
                }}
                className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-all hover:shadow-lg hover:shadow-cyan-500/50"
              >
                <Mail className="w-5 h-5" />
                <span>{t.hero.contactBtn}</span>
              </button>
              <button
                onClick={() => {
                  openBooking();
                  window.dataLayer?.push({ event: "booking_dialog_opened_from_hero" });
                }}
                className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-all"
                aria-label={t.contact.scheduleTitle}
              >
                <PhoneCall className="w-5 h-5" />
                <span>{t.hero.callBtn}</span>
              </button>
              <a
                href={t.contact.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-all"
              >
                <Linkedin className="w-5 h-5" />
                <span>{t.hero.linkedInLabel}</span>
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            className="order-2 md:order-1 flex justify-center items-end pt-[10%]"
            initial={{ opacity: 0, x: -120 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
          >
            <div className="relative">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-[70%] bg-gradient-to-t from-cyan-500 via-blue-600 to-transparent blur-3xl opacity-40"></div>
              <motion.div
                animate={{ x: [0, 14, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image
                  src="/hero_banner.png"
                  alt={t.hero.imageAlt}
                  width={448}
                  height={600}
                  priority
                  className="relative h-screen w-auto object-contain drop-shadow-2xl object-bottom"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="w-8 h-8 text-cyan-400" />
      </motion.div>
    </section>
  );
}
