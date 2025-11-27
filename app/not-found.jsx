// app/not-found.tsx (Next.js App Router)
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden text-white">
      {/* Radial depth background */}
      {/* Card */}
      <section className="relative z-10 mx-6 w-full max-w-4xl rounded-2xl border border-white/10 p-8 md:p-12 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_10px_40px_-10px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* 404 emblem */}
          <div className="flex-shrink-0 text-center md:text-left">
            <div className="relative inline-flex items-center justify-center w-36 h-36 md:w-44 md:h-44 rounded-full bg-white/5 ring-1 ring-white/10">
              {/* rotating rim */}
              <span
                aria-hidden
                className="absolute inset-0 rounded-full bg-[conic-gradient(from_180deg,rgba(124,58,237,0.15),rgba(6,182,212,0.2),rgba(255,122,182,0.15),rgba(124,58,237,0.15))] animate-[spin_12s_linear_infinite]"
              />
              <span className="relative z-10 text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#ffd86b] via-[#ff7ab6] to-[#7c3aed] drop-shadow-[0_2px_12px_rgba(124,58,237,0.25)]">
                404
              </span>
            </div>
          </div>

          {/* Copy & actions */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-extrabold mb-2 tracking-tight">Page Not Found</h1>
            <p className="text-white/70 mb-5 max-w-prose leading-relaxed">
              The page you’re looking for doesn’t exist, has been removed, or the URL is incorrect.
              Try returning home or visiting the dashboard.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link href="/" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full transition-transform duration-200 hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#7c3aed] focus-visible:ring-offset-black"
                  variant="primary"
                  aria-label="Return to homepage"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Return Home
                </Button>
              </Link>

              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="secondary"
                  className="px-6 py-3 rounded-full transition-transform duration-200 hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#06b6d4] focus-visible:ring-offset-black"
                  aria-label="Go to dashboard"
                >
                  Go to Dashboard
                </Button>
              </Link>
            </div>

            <p className="mt-5 text-[13px] text-white/60">
              If you think this is an error, check the URL or contact support.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
