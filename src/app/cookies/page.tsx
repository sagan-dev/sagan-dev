import type { Metadata } from "next";
import Link from "next/link";
import { ResetConsentButton } from "@/components/ResetConsentButton";
import { indexable, openGraph } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Cookie Policy for sagan.dev — how we use cookies and how to manage your preferences.",
  alternates: { canonical: "/cookies" },
  openGraph: openGraph("/cookies", {
    title: "Cookie Policy | Michał Sagan",
    description: "Cookie Policy for sagan.dev — how we use cookies and how to manage your preferences.",
  }),
  robots: indexable,
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-200">
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 mb-10 transition-colors"
        >
          ← Back to sagan.dev
        </Link>

        <h1 className="text-4xl font-bold text-white mb-2">Cookie Policy</h1>
        <p className="text-slate-400 text-sm mb-10">Last updated: April 2026</p>

        <div className="space-y-10 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. What are cookies?</h2>
            <p>
              Cookies are small text files stored on your device by your browser when you visit a
              website. They help sites remember your preferences and collect anonymous usage data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Cookies we use</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 pr-4 text-slate-400 font-medium">Cookie</th>
                    <th className="text-left py-3 pr-4 text-slate-400 font-medium">Provider</th>
                    <th className="text-left py-3 pr-4 text-slate-400 font-medium">Purpose</th>
                    <th className="text-left py-3 text-slate-400 font-medium">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr>
                    <td className="py-3 pr-4 font-mono text-cyan-400">cookie_consent</td>
                    <td className="py-3 pr-4">sagan.dev</td>
                    <td className="py-3 pr-4">Stores your cookie consent choice</td>
                    <td className="py-3">1 year</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-cyan-400">_ga</td>
                    <td className="py-3 pr-4">Google Analytics</td>
                    <td className="py-3 pr-4">Distinguishes unique users</td>
                    <td className="py-3">2 years</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-cyan-400">_ga_*</td>
                    <td className="py-3 pr-4">Google Analytics</td>
                    <td className="py-3 pr-4">Persists session state</td>
                    <td className="py-3">2 years</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-cyan-400">_gtm_*</td>
                    <td className="py-3 pr-4">Google Tag Manager</td>
                    <td className="py-3 pr-4">Manages tag firing</td>
                    <td className="py-3">Session</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Cookie categories</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-white mb-1">Essential (always active)</h3>
                <p className="text-sm">
                  Necessary for the website to function. These cannot be disabled.{" "}
                  <code className="font-mono text-cyan-400 text-xs">cookie_consent</code> falls
                  into this category.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-white mb-1">
                  Analytics (requires consent)
                </h3>
                <p className="text-sm">
                  Google Analytics cookies (
                  <code className="font-mono text-cyan-400 text-xs">_ga</code>,{" "}
                  <code className="font-mono text-cyan-400 text-xs">_ga_*</code>) help us
                  understand how visitors interact with the site. No personally identifiable
                  information is collected. These are only set if you accept cookies.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Legal basis (GDPR)</h2>
            <p>
              We process analytics data on the basis of your{" "}
              <strong className="text-white">consent</strong> (Article 6(1)(a) GDPR). You can
              withdraw consent at any time by clearing your cookies or using the button below.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Third-party services</h2>
            <p>
              Google Analytics and Google Tag Manager are operated by Google LLC. Data may be
              transferred to servers in the United States. Google is certified under the EU–US Data
              Privacy Framework.{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
              >
                Google Privacy Policy ↗
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Manage your preferences</h2>
            <p className="mb-4">
              You can withdraw or change your consent at any time. Clicking the button below will
              clear your stored choice and reload the consent banner.
            </p>
            <ResetConsentButton />
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Contact</h2>
            <p>
              Questions about this policy?{" "}
              <a
                href="mailto:michal@sagan.dev"
                className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
              >
                michal@sagan.dev
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
