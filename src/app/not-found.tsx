import type { Metadata } from "next";
import Link from "next/link";

// Only noindex: no canonical (a 404 is not a version of another page). Next.js also emits its own
// <meta name="robots" content="noindex"> for not-found responses, so robots is not repeated here.
export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-200 flex items-center">
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="text-sm font-mono text-cyan-400 mb-3">404</p>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Page not found</h1>
        <p className="mb-8 text-slate-400">The page you are looking for does not exist or has been moved.</p>
        <Link href="/" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2">
          Back to sagan.dev
        </Link>
      </div>
    </div>
  );
}
