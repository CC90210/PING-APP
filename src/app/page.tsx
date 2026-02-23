"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Flame,
  BrainCircuit,
  Zap,
  ShieldCheck,
  Users,
  MessageSquare,
  Smartphone,
  ArrowRight,
  Star,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-blue-100">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
              <div className="h-3 w-3 bg-white rounded-full" />
            </div>
            <span className="text-xl font-bold tracking-tight">Ping</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
            <Link href="#features" className="hover:text-blue-600 transition">Features</Link>
            <Link href="#intelligence" className="hover:text-blue-600 transition">Intelligence</Link>
            <Link href="#pricing" className="hover:text-blue-600 transition">Pricing</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-sm font-semibold">Login</Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-50 border-blue-100 px-4 py-1 rounded-full text-sm font-semibold mb-6">
                <Sparkles className="h-3 w-3 mr-2 fill-blue-600" />
                AI-Powered Relationship Intelligence
              </Badge>
              <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight text-zinc-950 max-w-4xl mx-auto leading-[1.1]">
                Never let a relationship <br />
                <span className="text-blue-600">go cold again.</span>
              </h1>
              <p className="mt-8 text-xl text-zinc-600 max-w-2xl mx-auto leading-relaxed">
                Ping is the intelligence layer for your professional and personal network.
                We track communication warmth and nudge you when it's time to reconnect.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Link href="/dashboard">
                <Button size="lg" className="h-14 px-8 bg-zinc-950 text-white hover:bg-zinc-800 text-lg font-bold rounded-2xl shadow-xl">
                  Start Building Your Network
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold rounded-2xl border-2">
                Watch Demo
              </Button>
            </motion.div>

            {/* Hero Image / Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="pt-16 max-w-5xl mx-auto"
            >
              <div className="relative p-2 bg-zinc-200/50 rounded-[2.5rem] border border-zinc-200">
                <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-zinc-200">
                  <div className="bg-zinc-50 border-b p-4 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-zinc-300" />
                      <div className="h-3 w-3 rounded-full bg-zinc-300" />
                      <div className="h-3 w-3 rounded-full bg-zinc-300" />
                    </div>
                    <div className="bg-white border rounded px-4 py-1 text-[10px] text-zinc-400 font-mono w-64 mx-auto">
                      ping.app/dashboard
                    </div>
                  </div>
                  <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    <div className="space-y-4">
                      <div className="h-32 bg-zinc-50 rounded-2xl border p-4">
                        <p className="text-[10px] uppercase font-bold text-zinc-400 mb-2">Network Health</p>
                        <div className="text-3xl font-bold text-green-600">84%</div>
                        <div className="h-2 w-full bg-zinc-200 rounded-full mt-2">
                          <div className="h-full w-[84%] bg-green-500 rounded-full" />
                        </div>
                      </div>
                      <div className="h-12 w-full bg-blue-50 border border-blue-100 rounded-xl" />
                      <div className="h-12 w-full bg-zinc-50 border rounded-xl" />
                    </div>
                    <div className="md:col-span-2 space-y-4">
                      <div className="h-64 bg-zinc-50 rounded-2xl border p-6">
                        <div className="flex justify-between items-center mb-6">
                          <p className="font-bold text-sm">Today&apos;s High-Priority Pings</p>
                          <Badge className="bg-red-100 text-red-600 border-none">3 Critical</Badge>
                        </div>
                        <div className="space-y-3">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white p-3 rounded-xl border flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-blue-100" />
                                <div>
                                  <div className="h-2 w-24 bg-zinc-200 rounded" />
                                  <div className="h-1.5 w-16 bg-zinc-100 rounded mt-1" />
                                </div>
                              </div>
                              <div className="h-6 w-12 bg-zinc-50 rounded-md" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-zinc-50 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
              <h2 className="text-4xl font-bold tracking-tight">Everything you need to stay connected.</h2>
              <p className="text-zinc-600 text-lg">
                Stop using messy spreadsheets or outdated CRM tools. Ping is built for the way humans actually maintain relationships.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={Flame}
                color="text-orange-500"
                bg="bg-orange-50"
                title="Warmth Scoring"
                description="AI-driven metrics that track the health of every connection based on frequency and depth."
              />
              <FeatureCard
                icon={BrainCircuit}
                color="text-blue-500"
                bg="bg-blue-50"
                title="Relationship Coach"
                description="Personalized AI advice on who to reach out to and exactly what to say to break the ice."
              />
              <FeatureCard
                icon={Zap}
                color="text-yellow-500"
                bg="bg-yellow-50"
                title="Zero-Config Sync"
                description="Automatically track pings across WhatsApp, iMessage, and Email without manual data entry."
              />
            </div>
          </div>
        </section>

        {/* Intelligence Section */}
        <section id="intelligence" className="py-24 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Intelligence that feels <br /> like a superpower.</h2>
              <div className="space-y-6">
                <IntelligenceItem
                  title="Communication Patterns"
                  description="Ping learns when individual contacts are most likely to respond, optimizing your reach-out times."
                />
                <IntelligenceItem
                  title="Automatic Summarization"
                  description="Get a quick refresher on your last catch-up before jumping into a new conversation."
                />
                <IntelligenceItem
                  title="Priority Queuing"
                  description="Daily prioritized list of people who are cooling off and need your attention."
                />
              </div>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 h-14 px-8 text-lg font-bold rounded-2xl">
                Explore the Platform
              </Button>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-blue-500/10 blur-3xl rounded-full" />
              <Card className="relative border-2 border-zinc-100 shadow-2xl rounded-[2rem] overflow-hidden">
                <CardContent className="p-10 space-y-8">
                  <div className="flex items-center gap-4 border-b pb-6">
                    <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                      <BrainCircuit className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="font-bold text-xl leading-none mb-1">Weekly Coach Insight</p>
                      <p className="text-zinc-500 text-sm">Generated just for you</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-blue-600 font-bold flex items-center">
                      <Star className="h-4 w-4 mr-2 fill-blue-600" />
                      Strategic Recommendation
                    </p>
                    <p className="text-lg font-medium leading-relaxed text-zinc-800">
                      &quot;You&apos;ve sent 12 pings this week, mostly to clients. Your &apos;Inner Circle&apos; is cooling off. Reaching out to 2 close mentors would re-balance your network vitality.&quot;
                    </p>
                    <div className="pt-4 flex gap-2">
                      <Badge className="bg-blue-50 text-blue-600 border-none px-3 py-1">Pattern Detected</Badge>
                      <Badge className="bg-green-50 text-green-600 border-none px-3 py-1 font-bold">Recommended</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonial / Trust */}
        <section className="py-24 bg-zinc-950 text-white px-6">
          <div className="max-w-7xl mx-auto text-center space-y-12">
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-center gap-1 mb-6">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-6 w-6 text-yellow-400 fill-yellow-400" />)}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                &quot;Ping turned my messy networking spreadsheet into a live, intelligent dashboard. I&apos;ve never felt more in control of my relationships.&quot;
              </h2>
              <div className="mt-8">
                <p className="font-bold text-xl">Marcus Chen</p>
                <p className="text-zinc-500">Founder, Velocity Labs</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 px-6">
          <div className="max-w-5xl mx-auto bg-blue-600 rounded-[3rem] p-12 md:p-20 text-center text-white space-y-8 relative overflow-hidden shadow-2xl shadow-blue-500/20">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)]" />
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight relative z-10">
              Build a network that <br /> works for you.
            </h2>
            <p className="text-xl text-blue-100 max-w-xl mx-auto relative z-10">
              Join 1,000+ top performers who use Ping to maintain their human connection edge.
            </p>
            <div className="pt-4 relative z-10">
              <Button size="lg" className="h-16 px-10 bg-white text-blue-600 hover:bg-blue-50 text-xl font-extrabold rounded-2xl shadow-xl">
                Get Started for Free
              </Button>
            </div>
            <p className="text-sm text-blue-200 relative z-10">No credit card required. Sync your first channel in 60 seconds.</p>
          </div>
        </section>
      </main>

      <footer className="py-16 px-6 border-t bg-zinc-50">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center">
                <div className="h-2 w-2 bg-white rounded-full" />
              </div>
              <span className="text-lg font-bold uppercase tracking-widest text-zinc-400">Ping</span>
            </div>
            <p className="max-w-xs text-zinc-500 text-sm leading-relaxed">
              The relationship intelligence engine for people who care about their connections.
            </p>
          </div>
          <div className="space-y-4">
            <p className="font-bold text-sm uppercase tracking-widest text-zinc-400">Product</p>
            <ul className="space-y-2 text-sm text-zinc-600 font-medium">
              <li className="hover:text-blue-600 cursor-pointer">Features</li>
              <li className="hover:text-blue-600 cursor-pointer">Intelligence</li>
              <li className="hover:text-blue-600 cursor-pointer">Pricing</li>
            </ul>
          </div>
          <div className="space-y-4">
            <p className="font-bold text-sm uppercase tracking-widest text-zinc-400">Legal</p>
            <ul className="space-y-2 text-sm text-zinc-600 font-medium">
              <li className="hover:text-blue-600 cursor-pointer">Privacy</li>
              <li className="hover:text-blue-600 cursor-pointer">Terms</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, color, bg, title, description }: any) {
  return (
    <Card className="border-none shadow-xl shadow-zinc-200/50 rounded-[2rem] p-8 space-y-6 hover:-translate-y-2 transition-transform duration-300">
      <div className={`h-12 w-12 ${bg} rounded-2xl flex items-center justify-center`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
      </div>
    </Card>
  );
}

function IntelligenceItem({ title, description }: any) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
        <CheckCircle2 className="h-3 w-3 text-blue-600" />
      </div>
      <div>
        <p className="font-bold text-zinc-900">{title}</p>
        <p className="text-sm text-zinc-500">{description}</p>
      </div>
    </div>
  );
}

function Sparkles(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
