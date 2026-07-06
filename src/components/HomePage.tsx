"use client";

import { Hero } from "@/components/Hero";
import { Profile } from "@/components/Profile";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { Toolbox } from "@/components/Toolbox";
import { Skills } from "@/components/Skills";
import { Awards } from "@/components/Awards";
import { Recommendations } from "@/components/Recommendations";
import { Contact } from "@/components/Contact";
import { ContactForm } from "@/components/ContactForm";
import { BookingDialog } from "@/components/BookingDialog";
import { ChatWidget } from "@/components/ChatWidget";
import { useContactForm } from "@/contexts/ContactFormContext";

interface HomePageProps {
  schemaJson: Record<string, unknown>;
}

export function HomePage({ schemaJson }: HomePageProps) {
  const { isOpen, isBookingOpen, openForm, closeForm, closeBooking } = useContactForm();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="fixed top-0 left-0 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative z-10">
          <Hero onOpenForm={openForm} />
          <Profile />
          <Experience />
          <Projects />
          <Toolbox />
          <Skills />
          <Awards />
          <Recommendations />
          <Contact />
        </div>
      </div>

      <ContactForm open={isOpen} onOpenChange={closeForm} />
      <BookingDialog open={isBookingOpen} onOpenChange={closeBooking} />
      <ChatWidget />
    </>
  );
}
