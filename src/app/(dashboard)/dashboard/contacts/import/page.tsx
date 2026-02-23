"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Users,
    Mail,
    Globe,
    ArrowRight,
    ShieldCheck,
    Zap,
    Loader2
} from "lucide-react";
import axios from "axios";
import Link from "next/link";

export default function ImportPage() {
    const [loading, setLoading] = useState(false);

    const handleGoogleImport = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/api/google/auth-url");
            window.location.href = response.data.url;
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <div className="p-8 space-y-8 bg-zinc-50 min-h-screen max-w-4xl mx-auto">
            <div className="text-center space-y-2">
                <h2 className="text-4xl font-extrabold tracking-tight">Onboard your network</h2>
                <p className="text-muted-foreground text-lg">
                    Connect your existing accounts to populate Ping in seconds.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                <Card className="border-2 border-zinc-100 shadow-xl shadow-zinc-200/50 hover:border-blue-500 transition-all group overflow-hidden">
                    <div className="p-8 space-y-6">
                        <div className="h-14 w-14 bg-red-50 rounded-2xl flex items-center justify-center">
                            <Mail className="h-8 w-8 text-red-500" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl">Google Contacts</CardTitle>
                            <CardDescription className="text-base mt-2">
                                Import and sync your Google Contacts automatically. We&apos;ll match birthdays and company info too.
                            </CardDescription>
                        </div>
                        <ul className="space-y-3">
                            <li className="flex items-center text-sm text-zinc-600 gap-2">
                                <ShieldCheck className="h-4 w-4 text-green-500" /> Secure OAuth connection
                            </li>
                            <li className="flex items-center text-sm text-zinc-600 gap-2">
                                <Zap className="h-4 w-4 text-green-500" /> Instant sync of 500+ contacts
                            </li>
                        </ul>
                        <Button
                            onClick={handleGoogleImport}
                            disabled={loading}
                            className="w-full bg-zinc-900 text-white hover:bg-zinc-800 h-12 rounded-xl text-lg font-bold"
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Connect Google"}
                            {!loading && <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition" />}
                        </Button>
                    </div>
                </Card>

                <Card className="border-2 border-zinc-100 shadow-xl shadow-zinc-200/50 opacity-60">
                    <div className="p-8 space-y-6">
                        <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center">
                            <Globe className="h-8 w-8 text-blue-500" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl">LinkedIn</CardTitle>
                            <CardDescription className="text-base mt-2">
                                Import your LinkedIn professional network.
                            </CardDescription>
                        </div>
                        <div className="bg-zinc-100 p-4 rounded-xl text-center">
                            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Coming Soon (Phase 3)</span>
                        </div>
                        <Button disabled variant="outline" className="w-full h-12 rounded-xl text-lg font-bold">
                            Sync Network
                        </Button>
                    </div>
                </Card>
            </div>

            <div className="bg-white p-6 rounded-3xl border shadow-sm flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                    <p className="font-bold text-zinc-900">Manual Import?</p>
                    <p className="text-sm text-muted-foreground">You can also add contacts one-by-one from the main list.</p>
                </div>
                <Button variant="link" className="ml-auto text-blue-600 font-bold" asChild>
                    <Link href="/dashboard/contacts">Go to Contacts</Link>
                </Button>
            </div>
        </div>
    );
}
