import { checkRateLimit } from "@/lib/rate-limit";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { sendContactEmail } from "@/lib/resend";
import { getSiteContent } from "@/lib/cms";

interface ContactInfo {
  email: string;
  phone: string;
  mailto: string;
  tel: string;
}

interface ContactMessageInput {
  name: string;
  email: string;
  message: string;
  companyWebsite?: string;
  turnstileToken: string;
  clientNonce?: string;
}

interface ContactMessageResult {
  ok: boolean;
  message: string;
}

interface ResolverContext {
  ip?: string;
}

export const resolvers = {
  Query: {
    contactInfo: async (_: unknown, __: unknown, ctx: ResolverContext): Promise<ContactInfo> => {
      const ip = ctx.ip ?? "unknown";
      if (!checkRateLimit(`contactInfo:${ip}`, 10, 60_000)) {
        throw new Error("Too many requests. Please try again later.");
      }

      const siteContent = await getSiteContent();
      const email = siteContent.contact.email || process.env.CONTACT_EMAIL || "";
      const phone = siteContent.contact.phone || process.env.CONTACT_PHONE || "";

      return {
        email,
        phone,
        mailto: email ? `mailto:${email}` : "",
        tel: phone ? `tel:${phone.replace(/\s/g, "")}` : "",
      };
    },
  },

  Mutation: {
    sendContactMessage: async (
      _: unknown,
      args: { input: ContactMessageInput },
      ctx: ResolverContext
    ): Promise<ContactMessageResult> => {
      const { input } = args;
      const ip = ctx.ip ?? "unknown";

      // Honeypot: silently succeed if bot fills hidden field
      if (input.companyWebsite) {
        return { ok: true, message: "Message sent." };
      }

      // Rate limit: 3 per 15 minutes per IP
      if (!checkRateLimit(`sendContactMessage:${ip}`, 3, 15 * 60_000)) {
        return {
          ok: false,
          message: "Too many requests. Please try again later.",
        };
      }

      // Verify Turnstile token
      const turnstileResult = await verifyTurnstileToken(
        input.turnstileToken,
        ip
      );
      if (!turnstileResult.success) {
        return {
          ok: false,
          message: "Verification failed. Please try again.",
        };
      }

      // Send email via Resend
      try {
        await sendContactEmail({
          name: input.name.trim(),
          email: input.email.trim(),
          message: input.message.trim(),
        });
      } catch (err) {
        console.error("[sendContactMessage] email error:", err);
        return {
          ok: false,
          message: "Failed to send message. Please try again later.",
        };
      }

      return { ok: true, message: "Your message has been sent. Thank you!" };
    },
  },
};
