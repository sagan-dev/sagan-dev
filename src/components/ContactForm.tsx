"use client";

import { useRef, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TerminalToast } from "@/components/ui/terminal-toast";
import { Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useContactForm } from "@/contexts/ContactFormContext";
import { CONTACT_INFO_QUERY, SEND_CONTACT_MESSAGE_MUTATION } from "@/lib/graphql/operations";

const formSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(2000),
  // Honeypot — must stay empty
  companyWebsite: z.string().max(0).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ContactFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SendResult = {
  sendContactMessage: { ok: boolean; message?: string | null };
};

type ContactInfoData = {
  contactInfo: { email: string; mailto: string };
};

export function ContactForm({ open, onOpenChange }: ContactFormProps) {
  const { t } = useLanguage();
  const { openBooking } = useContactForm();
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "error">("idle");
  const [serverMessage, setServerMessage] = useState<string>("");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const turnstileRef = useRef<TurnstileInstance>(null);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      companyWebsite: "",
    },
  });

  const handleEmailBlur = useCallback(
    (email: string) => {
      if (!email || form.getValues("name")) return;
      const local = email.split("@")[0];
      const name = local
        .split(/[._\-+]/)
        .filter(Boolean)
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
        .join(" ");
      if (name.length >= 2) form.setValue("name", name);
    },
    [form]
  );

  const [sendMessage, { loading }] = useMutation<SendResult>(
    SEND_CONTACT_MESSAGE_MUTATION
  );
  const { data: contactData } = useQuery<ContactInfoData>(CONTACT_INFO_QUERY, {
    skip: !open,
  });
  const contactEmail = contactData?.contactInfo.email ?? "michal@sagan.dev";
  const contactMailto = contactData?.contactInfo.mailto ?? `mailto:${contactEmail}`;

  async function onSubmit(values: FormValues) {
    if (!turnstileToken) return;

    try {
      const { data } = await sendMessage({
        variables: {
          input: {
            name: values.name,
            email: values.email,
            message: values.message,
            companyWebsite: values.companyWebsite ?? "",
            turnstileToken,
          },
        },
      });

      const result = data?.sendContactMessage;

      if (result?.ok) {
        window.dataLayer?.push({
          event: "contact_form_submitted",
          form_status: "success",
        });
        form.reset();
        handleOpenChange(false);
        setToastMessage(result.message ?? t.contact.formSuccess);
        setToastVisible(true);
      } else {
        setSubmitStatus("error");
        setServerMessage(result?.message ?? t.contact.formError);
        window.dataLayer?.push({
          event: "contact_form_error",
          error_message: result?.message,
        });
        turnstileRef.current?.reset();
        setTurnstileToken(null);
      }
    } catch {
      setSubmitStatus("error");
      setServerMessage(t.contact.formError);
      window.dataLayer?.push({
        event: "contact_form_error",
        error_message: "network_error",
      });
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    }
  }

  function handleOpenChange(value: boolean) {
    if (!value) {
      setSubmitStatus("idle");
      setServerMessage("");
    }
    onOpenChange(value);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="w-[96vw] max-w-lg bg-slate-900 border-slate-700 text-white">
          <DialogHeader className="sr-only">
            <DialogTitle>{t.contact.formTitle}</DialogTitle>
          </DialogHeader>
          <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-4">
              <h3 className="text-xl text-white">{t.contact.formTitle}</h3>
              <p className="text-sm text-slate-400 mt-2 mb-4">
                {t.contact.formReachMeAt}{" "}
                <a
                  href={contactMailto}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  {contactEmail}
                </a>
              </p>
              <button
                type="button"
                onClick={() => {
                  handleOpenChange(false);
                  openBooking();
                  window.dataLayer?.push({ event: "booking_dialog_opened_from_contact_form" });
                }}
                className="mb-4 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                {t.contact.scheduleTitle}
              </button>

              <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
                noValidate
              >
              {/* Honeypot — hidden from real users */}
              <div className="hidden" aria-hidden="true">
                <FormField
                  control={form.control}
                  name="companyWebsite"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          tabIndex={-1}
                          autoComplete="off"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">
                      {t.contact.formEmail}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t.contact.formEmailPlaceholder}
                        className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-500"
                        autoFocus
                        {...field}
                        onBlur={(e) => {
                          field.onBlur();
                          handleEmailBlur(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">
                      {t.contact.formName}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t.contact.formNamePlaceholder}
                        className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">
                      {t.contact.formMessage}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t.contact.formMessagePlaceholder}
                        rows={12}
                        className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-500 resize-y min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {siteKey && (
                <div className="flex justify-center">
                  <Turnstile
                    ref={turnstileRef}
                    siteKey={siteKey}
                    onSuccess={(token) => setTurnstileToken(token)}
                    onExpire={() => setTurnstileToken(null)}
                    onError={() => setTurnstileToken(null)}
                    options={{ theme: "dark" }}
                    scriptOptions={{ appendTo: "head" }}
                  />
                </div>
              )}

              {submitStatus === "error" && serverMessage && (
                <div className="text-sm text-red-400 text-center space-y-1">
                  <p>{serverMessage}</p>
                  <p>
                    <a
                      href="mailto:michal@sagan.dev?bcc=m+resend-issue@sagan.dev"
                      className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
                    >
                      Send directly via email →
                    </a>
                  </p>
                </div>
              )}

                <div className="flex justify-start">
                  <Button
                    type="submit"
                    disabled={loading || (!!siteKey && !turnstileToken)}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 text-white px-8 py-6 gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {loading ? t.contact.formSending : t.contact.formSubmit}
                  </Button>
                </div>
              </form>
              </Form>
          </div>
        </DialogContent>
      </Dialog>

      <TerminalToast
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
        type="success"
        message={toastMessage}
      />
    </>
  );
}
