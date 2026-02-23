import prisma from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    LineChart,
    TrendingUp,
    TrendingDown,
    Target,
    Flame,
    BrainCircuit,
    Lightbulb,
    Zap,
    CheckCircle2
} from "lucide-react";

export default async function AnalyticsPage() {
    const user = await getOrCreateUser();
    if (!user) return null;

    const insights = await prisma.relationshipInsight.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 5
    });

    const patterns = await prisma.communicationPattern.findMany({
        where: { userId: user.id },
        include: { contact: true },
        orderBy: { calculatedAt: "desc" },
        take: 5
    });

    return (
        <div className="p-8 space-y-8 bg-zinc-50 min-h-screen">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Intelligence & Trends</h2>
                <p className="text-muted-foreground">
                    AI-driven insights into your relationship networking health.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Relationship Trajectory */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-none shadow-xl shadow-zinc-200/50 overflow-hidden">
                        <CardHeader className="bg-white border-b">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl">Network Vitality</CardTitle>
                                    <CardDescription>Overall relationship maintenance over the last 30 days</CardDescription>
                                </div>
                                <Badge variant="secondary" className="bg-green-100 text-green-700 font-bold border-none">
                                    <TrendingUp className="h-3 w-3 mr-1" /> +12% this month
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="h-[300px] flex items-center justify-center bg-zinc-50/50">
                            {/* Placeholder for actual Recharts graph */}
                            <div className="text-center text-zinc-400">
                                <LineChart className="h-12 w-12 mx-auto mb-2 opacity-20" />
                                <p className="text-sm font-medium">Trajectory Graph Loading...</p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Target className="h-4 w-4 text-blue-500" />
                                    Consistency Score
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">84 / 100</div>
                                <p className="text-xs text-muted-foreground mt-1">High across Inner Circle and Clients.</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Zap className="h-4 w-4 text-yellow-500" />
                                    Pings This Week
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">32</div>
                                <p className="text-xs text-muted-foreground mt-1">+8 from last week.</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Communication Patterns */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <BrainCircuit className="h-5 w-5 text-zinc-400" />
                            Communication Patterns
                        </h3>
                        <div className="space-y-3">
                            {patterns.length > 0 ? patterns.map((p: any) => (
                                <div key={p.id} className="bg-white p-4 rounded-2xl border flex items-center justify-between group hover:border-blue-300 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold">
                                            {p.contact.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold">{p.contact.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Responds best on {['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'][p.preferredDay || 0]} around {p.preferredHour}:00
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="text-[10px] bg-zinc-50">
                                        {Math.round((p.initiationRatio || 0) * 100)}% Initiated by you
                                    </Badge>
                                </div>
                            )) : (
                                <p className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-3xl">
                                    Gathering data to detect communication patterns...
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* AI Coaching & Insights */}
                <div className="space-y-6">
                    <Card className="bg-blue-600 text-white border-none shadow-xl shadow-blue-500/20 px-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <Lightbulb className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                Relationship Coach
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {insights.filter((i: any) => i.type === 'coaching').map((insight: any) => (
                                <div key={insight.id} className="bg-white/10 p-4 rounded-2xl border border-white/20 backdrop-blur-sm">
                                    <p className="font-bold text-lg mb-1">{insight.title}</p>
                                    <p className="text-sm text-blue-50 leading-relaxed mb-3">
                                        {insight.body}
                                    </p>
                                    {insight.actionable && (
                                        <Button variant="secondary" className="w-full h-8 text-xs font-bold" asChild>
                                            <Link href="/dashboard/nudges">{insight.actionText}</Link>
                                        </Button>
                                    )}
                                </div>
                            ))}
                            {insights.filter((i: any) => i.type === 'coaching').length === 0 && (
                                <p className="text-sm text-blue-100">Analyzing your network activities. Check back tomorrow for personalized coaching advice.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-sm">Relationship Health Predictions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-4 items-start border-l-4 border-yellow-400 pl-4 py-1">
                                <div>
                                    <p className="text-sm font-bold">Predictive Drift: Sarah K.</p>
                                    <p className="text-xs text-muted-foreground">Based on history, you usually go silent with Sarah in late February. Reach out now to break the pattern.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start border-l-4 border-red-400 pl-4 py-1">
                                <div>
                                    <p className="text-sm font-bold">Critical Drift: Mom</p>
                                    <p className="text-xs text-muted-foreground">Warmth score projected to hit DEAD within 3 days. High priority interaction recommended.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
