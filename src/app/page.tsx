import Link from "next/link";
import {
  Flame,
  BrainCircuit,
  Zap,
  ArrowRight,
  Star,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  Smartphone,
  Clock,
  Mic,
  BarChart3,
  Check,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
      {/* ── Navbar ─────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative h-8 w-8">
              <div className="absolute inset-0 bg-blue-600 rounded-full" />
              <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-20" />
              <div className="absolute inset-[10px] bg-white rounded-full" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">Ping</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a>
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors px-4 py-2">
              Log in
            </Link>
            <Link
              href="/sign-up"
              className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:shadow-blue-600/30"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* ── Hero ──────────────────────────────────────────── */}
        <section className="pt-36 pb-20 px-6 bg-gradient-to-b from-white via-blue-50/30 to-white">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            {/* Ping Logo Animation */}
            <div className="flex justify-center mb-8">
              <div className="relative h-16 w-16">
                <div className="absolute inset-0 rounded-full bg-blue-600" />
                <div className="absolute inset-0 rounded-full bg-blue-400 ping-logo-ring" style={{ animationDelay: "0s" }} />
                <div className="absolute inset-0 rounded-full bg-blue-400 ping-logo-ring" style={{ animationDelay: "0.75s" }} />
                <div className="absolute inset-0 rounded-full bg-blue-400 ping-logo-ring" style={{ animationDelay: "1.5s" }} />
                <div className="absolute inset-[20px] rounded-full bg-white" />
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.08]">
              Never let a relationship
              <br />
              <span className="text-blue-600">go cold again.</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Ping monitors your connections across every platform and tells you
              exactly who needs your attention — and what to say.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/sign-up"
                className="inline-flex items-center h-14 px-8 bg-slate-900 text-white hover:bg-slate-800 text-lg font-bold rounded-2xl shadow-xl transition-all"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center h-14 px-8 text-lg font-bold rounded-2xl border-2 border-slate-200 text-slate-700 hover:border-slate-300 transition-all"
              >
                See How It Works
              </a>
            </div>

            <p className="text-sm text-slate-400">
              No credit card required · Free for up to 50 contacts
            </p>
          </div>
        </section>

        {/* ── How It Works ─────────────────────────────────── */}
        <section id="how-it-works" className="py-24 px-6 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-600">How It Works</p>
              <h2 className="text-4xl font-extrabold tracking-tight">Three steps to a stronger network.</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StepCard
                step={1}
                title="Connect Your Platforms"
                description="Sync WhatsApp, iMessage, Telegram, and more in seconds. We never read your messages."
                icon={Smartphone}
              />
              <StepCard
                step={2}
                title="We Track Relationships"
                description="Ping automatically monitors every conversation and scores relationship health in real-time."
                icon={BarChart3}
              />
              <StepCard
                step={3}
                title="Get Smart Nudges"
                description="Receive AI-powered reminders with personalized messages ready to send — one tap and done."
                icon={Sparkles}
              />
            </div>
          </div>
        </section>

        {/* ── Features (Bento Grid) ────────────────────────── */}
        <section id="features" className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-600">Features</p>
              <h2 className="text-4xl font-extrabold tracking-tight">
                Everything you need to stay connected.
              </h2>
              <p className="text-slate-500 text-lg">
                Stop using messy spreadsheets or outdated CRM tools. Ping is built for the way humans actually maintain relationships.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Large card — Warmth Scoring */}
              <div className="lg:col-span-2 bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl border border-orange-100 p-10 space-y-4">
                <div className="h-12 w-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <Flame className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-2xl font-extrabold">Warmth Scoring</h3>
                <p className="text-slate-600 max-w-lg">
                  See the health of every relationship at a glance. Our algorithm tracks interaction frequency, response patterns, and communication balance.
                </p>
                {/* Mini warmth gauge */}
                <div className="flex items-center gap-4 pt-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-500">
                      <span>Network Health</span>
                      <span className="text-green-600">84%</span>
                    </div>
                    <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400" style={{ width: "84%" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Ghostwriter */}
              <FeatureCard
                icon={BrainCircuit}
                color="text-blue-600"
                bg="bg-blue-50"
                borderColor="border-blue-100"
                title="AI Ghostwriter"
                description="One-tap messages that sound like you. Claude-powered drafts based on your relationship history and tone."
              />

              {/* Cross-Platform */}
              <FeatureCard
                icon={MessageSquare}
                color="text-violet-600"
                bg="bg-violet-50"
                borderColor="border-violet-100"
                title="Cross-Platform"
                description="Works where you already chat. WhatsApp, iMessage, Telegram, Gmail — Ping syncs everything."
              />

              {/* Voice Pings */}
              <FeatureCard
                icon={Mic}
                color="text-pink-600"
                bg="bg-pink-50"
                borderColor="border-pink-100"
                title="Voice Pings"
                description="Send a voice note in 10 seconds. The most personal way to stay connected."
              />

              {/* Large card — Relationship Coaching */}
              <div className="lg:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl border border-blue-100 p-10 flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1 space-y-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <Star className="h-6 w-6 text-blue-600 fill-blue-600" />
                  </div>
                  <h3 className="text-2xl font-extrabold">Relationship Coaching</h3>
                  <p className="text-slate-600">
                    Weekly insights that make you better at relationships. Actionable advice based on your communication patterns.
                  </p>
                </div>
                <div className="w-full md:w-72 bg-white rounded-2xl border border-slate-200 shadow-lg p-6 space-y-3 shrink-0">
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Weekly Insight</p>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">
                    &quot;You&apos;ve sent 12 pings this week, mostly to clients. Your &apos;Inner Circle&apos; is cooling off — reach out to 2 close mentors to re-balance.&quot;
                  </p>
                  <div className="flex gap-2">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">Pattern</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">Recommended</span>
                  </div>
                </div>
              </div>

              {/* Smart Scheduling */}
              <FeatureCard
                icon={Clock}
                color="text-amber-600"
                bg="bg-amber-50"
                borderColor="border-amber-100"
                title="Smart Scheduling"
                description="We know the perfect time to reach out. AI learns when your contacts are most responsive."
              />
            </div>
          </div>
        </section>

        {/* ── Pricing ──────────────────────────────────────── */}
        <section id="pricing" className="py-24 px-6 bg-slate-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-600">Pricing</p>
              <h2 className="text-4xl font-extrabold tracking-tight">Simple, transparent pricing.</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <PricingCard
                name="Free"
                price="$0"
                period="/mo"
                description="For getting started"
                features={[
                  "50 contacts",
                  "1 channel",
                  "5 AI messages/mo",
                  "Basic nudges",
                ]}
                cta="Get Started"
                ctaLink="/sign-up"
                highlighted={false}
              />
              <PricingCard
                name="Pro"
                price="$9.99"
                period="/mo"
                description="For power networkers"
                features={[
                  "Unlimited contacts",
                  "All channels",
                  "Unlimited AI messages",
                  "Advanced analytics",
                  "Voice notes",
                ]}
                cta="Start Pro Trial"
                ctaLink="/sign-up"
                highlighted={true}
              />
              <PricingCard
                name="Business"
                price="$29.99"
                period="/mo"
                description="For teams"
                features={[
                  "Everything in Pro",
                  "Team features",
                  "CRM integrations",
                  "Priority support",
                  "Custom branding",
                ]}
                cta="Contact Sales"
                ctaLink="/sign-up"
                highlighted={false}
              />
            </div>
          </div>
        </section>

        {/* ── Testimonial ──────────────────────────────────── */}
        <section className="py-24 bg-slate-900 text-white px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <blockquote className="text-2xl md:text-3xl font-bold leading-snug">
              &quot;Ping turned my messy networking spreadsheet into a live, intelligent dashboard. I&apos;ve never felt more in control of my relationships.&quot;
            </blockquote>
            <div>
              <p className="font-bold text-lg">Marcus Chen</p>
              <p className="text-slate-400">Founder, Velocity Labs</p>
            </div>
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────────── */}
        <section className="py-28 px-6">
          <div className="max-w-4xl mx-auto bg-blue-600 rounded-[2.5rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-600/20">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)]" />
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight relative z-10">
              Start nurturing your <br />relationships today.
            </h2>
            <p className="mt-6 text-xl text-blue-100 max-w-lg mx-auto relative z-10">
              Join 1,000+ professionals who use Ping to stay connected to the people who matter.
            </p>
            <div className="mt-8 relative z-10">
              <Link
                href="/sign-up"
                className="inline-flex items-center h-16 px-10 bg-white text-blue-600 hover:bg-blue-50 text-xl font-extrabold rounded-2xl shadow-xl transition-all"
              >
                Get Started Free
              </Link>
            </div>
            <p className="mt-4 text-sm text-blue-200 relative z-10">
              Questions? hello@pingapp.com
            </p>
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="py-12 px-6 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-blue-600 rounded-full flex items-center justify-center">
              <div className="h-1.5 w-1.5 bg-white rounded-full" />
            </div>
            <span className="font-bold text-slate-500">Ping</span>
          </div>
          <p>© 2026 Ping. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Terms</a>
          </div>
        </div>
      </footer>


    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────── */

function StepCard({ step, title, description, icon: Icon }: any) {
  return (
    <div className="relative bg-white rounded-3xl border border-slate-200 p-8 space-y-4 shadow-sm">
      <div className="absolute -top-4 left-8 h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-extrabold shadow-lg shadow-blue-600/30">
        {step}
      </div>
      <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center mt-2">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function FeatureCard({ icon: Icon, color, bg, borderColor, title, description }: any) {
  return (
    <div className={`${bg} rounded-3xl border ${borderColor} p-8 space-y-4`}>
      <div className={`h-12 w-12 ${bg} rounded-2xl flex items-center justify-center`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function PricingCard({ name, price, period, description, features, cta, ctaLink, highlighted }: any) {
  return (
    <div
      className={`rounded-3xl p-8 space-y-6 relative ${highlighted
        ? "bg-blue-600 text-white shadow-2xl shadow-blue-600/20 ring-4 ring-blue-600/10"
        : "bg-white border border-slate-200 shadow-sm"
        }`}
    >
      {highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-extrabold px-3 py-1 rounded-full shadow">
          POPULAR
        </span>
      )}
      <div>
        <p className={`font-bold ${highlighted ? "text-blue-100" : "text-slate-500"}`}>{name}</p>
        <div className="flex items-baseline gap-1 mt-2">
          <span className="text-4xl font-extrabold">{price}</span>
          <span className={`text-sm ${highlighted ? "text-blue-200" : "text-slate-400"}`}>{period}</span>
        </div>
        <p className={`text-sm mt-1 ${highlighted ? "text-blue-200" : "text-slate-500"}`}>{description}</p>
      </div>
      <ul className="space-y-3">
        {features.map((feature: string) => (
          <li key={feature} className="flex items-center gap-2 text-sm">
            <Check className={`h-4 w-4 shrink-0 ${highlighted ? "text-blue-200" : "text-green-500"}`} />
            {feature}
          </li>
        ))}
      </ul>
      <Link
        href={ctaLink}
        className={`block text-center font-bold py-3 rounded-xl transition-all ${highlighted
          ? "bg-white text-blue-600 hover:bg-blue-50"
          : "bg-slate-900 text-white hover:bg-slate-800"
          }`}
      >
        {cta}
      </Link>
    </div>
  );
}
