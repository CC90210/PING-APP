"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Users,
    Sparkles,
    ArrowRight,
    ShieldCheck,
    Globe,
    Zap,
    Smartphone,
    MessageCircle,
    Mail,
    CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [fadeClass, setFadeClass] = useState("animate-fadeIn");

    const steps = [
        { title: "Welcome", icon: Sparkles },
        { title: "Import", icon: Users },
        { title: "Connect", icon: Globe },
        { title: "Ready", icon: Zap },
    ];

    const transition = (next: number) => {
        setFadeClass("animate-fadeOut");
        setTimeout(() => {
            setStep(next);
            setFadeClass("animate-fadeIn");
        }, 200);
    };

    const handleNext = () => transition(Math.min(step + 1, 4));
    const handleBack = () => transition(Math.max(step - 1, 1));

    const handleGoogleImport = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/google/auth-url");
            const data = await res.json();
            window.location.href = data.url;
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col">
            {/* Progress Header */}
            <div className="bg-white border-b px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-black text-xl leading-none">P</span>
                    </div>
                    <span className="font-bold text-xl tracking-tight">Ping</span>
                </div>
                <div className="flex items-center gap-4">
                    {steps.map((s, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div
                                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step > i + 1
                                        ? "bg-green-100 text-green-600"
                                        : step === i + 1
                                            ? "bg-blue-600 text-white"
                                            : "bg-zinc-100 text-zinc-400"
                                    }`}
                            >
                                {step > i + 1 ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                            </div>
                            <span
                                className={`text-sm font-medium hidden md:inline ${step === i + 1 ? "text-zinc-900" : "text-zinc-400"
                                    }`}
                            >
                                {s.title}
                            </span>
                            {i < 3 && <div className="h-px w-8 bg-zinc-200" />}
                        </div>
                    ))}
                </div>
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard">Skip</Link>
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
                <div className={`max-w-4xl mx-auto py-12 ${fadeClass}`}>
                    {step === 1 && (
                        <div className="space-y-8 text-center">
                            <div className="space-y-4">
                                <h1 className="text-5xl font-extrabold tracking-tight text-zinc-900">
                                    Never let a relationship <br /> go{" "}
                                    <span className="text-blue-600">cold.</span>
                                </h1>
                                <p className="text-xl text-zinc-500 max-w-2xl mx-auto">
                                    Ping is your personal relationship intelligence engine. We
                                    monitor your network and tell you exactly who to reach out to,
                                    and what to say.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                                <div className="p-6 bg-white rounded-3xl border shadow-sm space-y-2">
                                    <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                                        <Globe className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-bold">Auto-Tracking</h3>
                                    <p className="text-sm text-zinc-500">
                                        Log interactions passively via WhatsApp, iMessage, and more.
                                    </p>
                                </div>
                                <div className="p-6 bg-white rounded-3xl border shadow-sm space-y-2">
                                    <div className="h-12 w-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                                        <Sparkles className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-bold">AI Outreach</h3>
                                    <p className="text-sm text-zinc-500">
                                        Claude generates the perfect message based on your history.
                                    </p>
                                </div>
                                <div className="p-6 bg-white rounded-3xl border shadow-sm space-y-2">
                                    <div className="h-12 w-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                                        <Zap className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-bold">Smart Nudges</h3>
                                    <p className="text-sm text-zinc-500">
                                        Get notified the moment a key relationship starts cooling
                                        off.
                                    </p>
                                </div>
                            </div>
                            <div className="pt-8">
                                <Button
                                    onClick={handleNext}
                                    className="h-14 px-12 rounded-full text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20"
                                >
                                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8">
                            <div className="text-center space-y-2">
                                <h2 className="text-3xl font-bold tracking-tight">
                                    Step 2: Connect your people
                                </h2>
                                <p className="text-zinc-500">
                                    We&apos;ll build your relationship map based on your existing
                                    contacts.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card
                                    className="border-2 border-zinc-100 hover:border-blue-500 transition-all cursor-pointer group"
                                    onClick={handleGoogleImport}
                                >
                                    <CardContent className="p-8 space-y-4">
                                        <div className="h-12 w-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                                            <Mail className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-xl font-bold">
                                            Import Google Contacts
                                        </h3>
                                        <p className="text-sm text-zinc-500">
                                            The fastest way to get your network into Ping. One-tap
                                            secure OAuth sync.
                                        </p>
                                        <Button
                                            variant="outline"
                                            className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600"
                                        >
                                            {loading ? "Connecting..." : "Connect Google"}
                                        </Button>
                                    </CardContent>
                                </Card>
                                <Card className="border-2 border-zinc-100 opacity-60">
                                    <CardContent className="p-8 space-y-4">
                                        <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                            <Smartphone className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-xl font-bold">Scan Local Contacts</h3>
                                        <p className="text-sm text-zinc-500">
                                            Available on our mobile app. Coming soon to web via native
                                            contacts API.
                                        </p>
                                        <Button disabled variant="outline" className="w-full">
                                            Available on Mobile
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="flex justify-center pt-8 gap-4">
                                <Button variant="ghost" onClick={handleBack}>
                                    Back
                                </Button>
                                <Button
                                    onClick={handleNext}
                                    variant="secondary"
                                    className="px-12 font-bold bg-white border border-zinc-200"
                                >
                                    Skip for now
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-8 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tight">
                                    Step 3: Auto-Track interactions
                                </h2>
                                <p className="text-zinc-500">
                                    Connect your messaging accounts to establish warmth scores
                                    automatically.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {["whatsapp", "imessage", "telegram"].map((platform) => (
                                    <div
                                        key={platform}
                                        className="p-6 bg-white rounded-3xl border border-zinc-100 shadow-sm space-y-4"
                                    >
                                        <div
                                            className={`h-12 w-12 rounded-2xl flex items-center justify-center mx-auto ${platform === "whatsapp"
                                                    ? "bg-green-50 text-green-600"
                                                    : platform === "imessage"
                                                        ? "bg-blue-50 text-blue-600"
                                                        : "bg-sky-50 text-sky-600"
                                                }`}
                                        >
                                            {platform === "whatsapp" ? (
                                                <MessageCircle />
                                            ) : platform === "imessage" ? (
                                                <Smartphone />
                                            ) : (
                                                <Globe />
                                            )}
                                        </div>
                                        <h3 className="font-bold capitalize">{platform}</h3>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="rounded-full w-full"
                                        >
                                            Connect
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex items-center gap-4 text-left">
                                <ShieldCheck className="h-8 w-8 text-blue-600 shrink-0" />
                                <div>
                                    <p className="font-bold text-blue-900">Privacy First</p>
                                    <p className="text-sm text-blue-700">
                                        We never store your raw messages. We only track who you talk
                                        to and when, to keep your dashboard accurate.
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-center pt-8 gap-4">
                                <Button variant="ghost" onClick={handleBack}>
                                    Back
                                </Button>
                                <Button
                                    onClick={handleNext}
                                    className="bg-blue-600 px-12 font-bold"
                                >
                                    Continue
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-8 text-center">
                            <div className="space-y-4">
                                <div className="h-24 w-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="h-12 w-12" />
                                </div>
                                <h2 className="text-4xl font-extrabold tracking-tight">
                                    You&apos;re ready to Ping.
                                </h2>
                                <p className="text-xl text-zinc-500 max-w-lg mx-auto">
                                    Your relationship engine is live. We&apos;ve analyzed your
                                    network and identified people you should reach out to today.
                                </p>
                            </div>
                            <div className="pt-8">
                                <Button
                                    asChild
                                    className="h-16 px-16 rounded-full text-xl font-black bg-blue-600 hover:bg-blue-700 shadow-2xl shadow-blue-500/30 group"
                                >
                                    <Link href="/dashboard">
                                        Launch Dashboard{" "}
                                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition" />
                                    </Link>
                                </Button>
                            </div>
                            <p className="text-sm text-zinc-400">
                                Recommended: Download the mobile app to receive daily morning
                                digests.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
