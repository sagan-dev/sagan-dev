"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { PhoneCall } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { CONTACT_INFO_QUERY } from "@/lib/graphql/operations";

const Cal = dynamic(() => import("@calcom/embed-react"), { ssr: false });

const CAL_ORIGIN = "https://cal.sagan.dev";
const CAL_EMBED_JS_URL = "https://cal.sagan.dev/embed/embed.js";

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ContactInfoData = {
  contactInfo: { tel: string };
};

export function BookingDialog({ open, onOpenChange }: BookingDialogProps) {
  const { t } = useLanguage();
  const { data } = useQuery<ContactInfoData>(CONTACT_INFO_QUERY, { skip: !open });

  // Build phone number client-side to avoid exposing a static tel string in HTML.
  const fallbackPhoneHref = useMemo(() => `tel:${["+48", "600", "341", "211"].join("")}`, []);
  const phoneHref = data?.contactInfo.tel || fallbackPhoneHref;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[96vw] max-w-[96vw] lg:max-w-4xl bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">{t.contact.scheduleTitle}</DialogTitle>
        </DialogHeader>

        <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-4">
          <p className="text-slate-300 leading-relaxed">{t.contact.scheduleDescription}</p>
          <div className="mt-5 rounded-lg overflow-hidden">
            {open && (
              <Cal
                calLink="michal/short"
                calOrigin={CAL_ORIGIN}
                embedJsUrl={CAL_EMBED_JS_URL}
                style={{ width: "100%", height: "100%", overflow: "scroll" }}
              />
            )}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="https://cal.sagan.dev/michal/short"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-3 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-cyan-500/40"
            >
              {t.contact.scheduleFallbackLink}
            </a>
            <a
              href={phoneHref}
              className="inline-flex items-center justify-center rounded-md border border-cyan-500/50 bg-slate-900 px-5 py-3 text-sm font-medium text-cyan-300 transition-colors hover:bg-slate-800 hover:text-cyan-200"
            >
              <PhoneCall className="mr-2 h-4 w-4" />
              {t.contact.callNowBtn}
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
