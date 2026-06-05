"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Linkedin, Phone, Download } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@apollo/client/react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useContactForm } from "@/contexts/ContactFormContext";
import { CONTACT_INFO_QUERY } from "@/lib/graphql/operations";

function ContactInfoSkeleton({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
      <div className="p-3 bg-cyan-500/10 rounded-lg">
        <div className="w-6 h-6 bg-slate-700 rounded animate-pulse" />
      </div>
      <div>
        <div className="text-sm text-slate-400">{label}</div>
        <div className="w-36 h-4 mt-1 bg-slate-700 rounded animate-pulse" />
      </div>
    </div>
  );
}

export function Contact() {
  const { t } = useLanguage();
  const { openForm, openBooking } = useContactForm();
  const sectionRef = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(false);
  const [timeReady, setTimeReady] = useState(false);
  const [inView, setInView] = useState(false);

  // 2-second page timer
  useEffect(() => {
    const id = setTimeout(() => setTimeReady(true), 2000);
    return () => clearTimeout(id);
  }, []);

  // IntersectionObserver for the section
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Trigger when both conditions are met
  useEffect(() => {
    if (!triggered && timeReady && inView) {
      setTriggered(true);
      window.dataLayer?.push({ event: "contact_info_revealed" });
    }
  }, [triggered, timeReady, inView]);

  type ContactInfoData = {
    contactInfo: { email: string; phone: string; mailto: string; tel: string };
  };
  const { data } = useQuery<ContactInfoData>(CONTACT_INFO_QUERY, { skip: !triggered });
  const contact = data?.contactInfo;
  return (
    <section ref={sectionRef} className="py-24 px-6 md:px-12 lg:px-24 bg-slate-900/50">
      <div className="w-full">
        <div className="max-w-none w-full">
          <motion.h2
            className="text-4xl md:text-5xl text-white mb-12"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t.contact.title}
          </motion.h2>

          <div className="mb-4 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-slate-300 leading-relaxed">
                {t.contact.description}
              </p>

              <div className="space-y-4 max-w-md">
                {/* Email */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  {contact ? (
                    <button
                      onClick={() => {
                        openForm();
                        window.dataLayer?.push({ event: "contact_form_opened_from_email" });
                      }}
                      className="w-full flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-cyan-500/50 transition-all group cursor-pointer"
                    >
                      <div className="p-3 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                        <Mail className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm text-slate-400">{t.contact.emailLabel}</div>
                        <div className="text-white">{contact.email}</div>
                      </div>
                    </button>
                  ) : (
                    <ContactInfoSkeleton label={t.contact.emailLabel} />
                  )}
                </motion.div>

                {/* Phone */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  {contact ? (
                    <button
                      onClick={() => {
                        openBooking();
                        window.dataLayer?.push({ event: "booking_dialog_opened_from_phone" });
                      }}
                      className="w-full flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-cyan-500/50 transition-all group text-left cursor-pointer"
                    >
                      <div className="p-3 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                        <Phone className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div>
                        <div className="text-sm text-slate-400">{t.contact.phoneLabel}</div>
                        <div className="text-white">{contact.phone}</div>
                      </div>
                    </button>
                  ) : (
                    <ContactInfoSkeleton label={t.contact.phoneLabel} />
                  )}
                </motion.div>

                {/* LinkedIn */}
                <motion.a
                  href={t.contact.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-cyan-500/50 transition-all group"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <div className="p-3 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                    <Linkedin className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">{t.contact.linkedinLabel}</div>
                    <div className="text-white">{t.contact.linkedinHandle}</div>
                  </div>
                </motion.a>

                {/* Download / Save as PDF */}
                <motion.button
                  onClick={() => window.print()}
                  className="flex items-center gap-4 p-4 w-full bg-slate-800/50 border border-slate-700 rounded-lg hover:border-cyan-500/50 transition-all group cursor-pointer"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.25 }}
                >
                  <div className="p-3 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                    <Download className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-slate-400">
                      {t.contact.downloadLabel}
                    </div>
                    <div className="text-white">{t.contact.saveLabel}</div>
                  </div>
                </motion.button>
              </div>
            </div>

            <motion.div
              className="flex justify-center items-end overflow-hidden -mb-4"
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full blur-3xl opacity-30 scale-75"></div>
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Image
                    src="/footer.png"
                    alt={t.contact.footerImageAlt}
                    width={384}
                    height={500}
                    className="relative w-80 h-auto md:w-100 object-contain object-bottom drop-shadow-2xl"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>

          <div className="pt-8 border-t border-slate-700">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400">
              <div>
                <p className="text-sm">
                  {t.contact.copyright}
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <Link
                  href="/cookies"
                  className="hover:text-cyan-400 transition-colors"
                >
                  {t.cookies.policyLink}
                </Link>
                <p>
                  {t.contact.roleAt}{" "}
                  <span className="text-cyan-400">{t.contact.currentCompany}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
