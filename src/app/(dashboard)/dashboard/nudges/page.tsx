export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Bell,
    MessageCircle,
    Trash2,
    Calendar,
    Clock,
    Send,
    Zap
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

export default async function NudgesPage() {
    const user = await getOrCreateUser();

    const nudges = user ? await prisma.nudge.findMany({
        where: {
            userId: user.id,
            status: "PENDING"
        },
        include: {
            contact: true
        },
        orderBy: { scheduledFor: "asc" }
    }) : [];

    return (
        <div className="p-8 space-y-8 bg-zinc-50 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Active Nudges</h2>
                    <p className="text-muted-foreground">
                        People who need a ping from you today.
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-white p-1 rounded-lg border shadow-sm">
                    <Button variant="ghost" size="sm" className="bg-zinc-100 font-semibold">Active</Button>
                    <Button variant="ghost" size="sm" className="text-zinc-500">Dismissed</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {nudges.length > 0 ? (
                    nudges.map((nudge) => (
                        <Card key={nudge.id} className="relative overflow-hidden group hover:border-blue-400 transition-all border-zinc-200">
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between mb-2">
                                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-none uppercase text-[10px] tracking-wider">
                                        {nudge.type}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground flex items-center">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {formatDistanceToNow(new Date(nudge.scheduledFor))} ago
                                    </span>
                                </div>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    Ping {nudge.contact.name}
                                </CardTitle>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {nudge.body}
                                </p>
                            </CardHeader>
                            <CardContent className="pb-3">
                                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Context</p>
                                    <p className="text-sm font-medium text-zinc-700">{nudge.suggestedAction || nudge.title}</p>
                                </div>
                            </CardContent>
                            <CardFooter className="flex gap-2 pt-2">
                                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 font-bold px-6 py-5 h-auto">
                                    <Zap className="h-4 w-4 mr-2" />
                                    Action Ping
                                </Button>
                                <Button variant="outline" className="px-5 py-5 h-auto">
                                    Snooze
                                </Button>
                                <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-red-500 py-5 h-auto">
                                    <Trash2 className="h-5 w-5" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-2 py-20 bg-white rounded-3xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center text-center">
                        <div className="h-16 w-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
                            <Bell className="h-8 w-8 text-zinc-300" />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900">Your queue is empty</h3>
                        <p className="text-muted-foreground max-w-xs mx-auto mt-2">
                            Great job! You&apos;re currently on top of all your primary relationships.
                        </p>
                        <Button variant="link" className="mt-4 text-blue-600" asChild>
                            <Link href="/dashboard/dashboard">Refresh Dashboard</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
