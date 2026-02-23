export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
    Calendar,
    Mail,
    Phone,
    Building2,
    MapPin,
    Clock,
    MessageSquare,
    ArrowLeft,
    Flame,
    Info
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { OutreachPanel } from "@/components/outreach/OutreachPanel";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ContactPageProps {
    params: {
        id: string;
    };
}

export default async function ContactDetailPage({ params }: ContactPageProps) {
    const user = await getOrCreateUser();
    if (!user) return null;

    const contact = await prisma.contact.findUnique({
        where: {
            id: params.id,
            userId: user.id,
        },
        include: {
            interactions: {
                orderBy: { occurredAt: "desc" },
                take: 10,
            },
        },
    });

    if (!contact) {
        notFound();
    }

    return (
        <div className="p-8 space-y-8 bg-zinc-50 min-h-screen">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="rounded-full">
                    <Link href="/dashboard/contacts">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{contact.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="capitalize">
                            {contact.category.toLowerCase().replace("_", " ")}
                        </Badge>
                        <Badge
                            className={
                                contact.warmthStatus === "GREEN" ? "bg-green-100 text-green-700" :
                                    contact.warmthStatus === "YELLOW" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                            }
                        >
                            {contact.warmthStatus}
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Outreach Section */}
                    <Card className="border-2 border-blue-100 shadow-xl shadow-blue-500/5 bg-white overflow-hidden">
                        <CardContent className="p-8">
                            <OutreachPanel contactId={contact.id} contactName={contact.name} />
                        </CardContent>
                    </Card>

                    {/* Interaction History */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Clock className="h-5 w-5 text-zinc-400" />
                            Recent Interactions
                        </h3>
                        <div className="space-y-4">
                            {contact.interactions.length > 0 ? (
                                contact.interactions.map((interaction) => (
                                    <div key={interaction.id} className="flex gap-4 group">
                                        <div className="flex flex-col items-center">
                                            <div className="h-10 w-10 rounded-full bg-white border-2 border-zinc-200 flex items-center justify-center z-10">
                                                {interaction.type === "MESSAGE" ? (
                                                    <MessageSquare className="h-5 w-5 text-zinc-400" />
                                                ) : (
                                                    <Phone className="h-5 w-5 text-zinc-400" />
                                                )}
                                            </div>
                                            <div className="w-0.5 h-full bg-zinc-200 -mt-1 group-last:hidden" />
                                        </div>
                                        <div className="flex-1 pb-8">
                                            <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
                                                <div className="flex items-center justify-between mb-2">
                                                    <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 font-medium">
                                                        {interaction.channel}
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground">
                                                        {format(new Date(interaction.occurredAt), "MMM d, yyyy · h:mm a")}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-semibold capitalize bg-zinc-50 px-2 py-1 inline-block rounded mb-2">
                                                    {interaction.direction} {interaction.type.toLowerCase()}
                                                </p>
                                                {interaction.summary && (
                                                    <p className="text-sm text-zinc-600 leading-relaxed italic">
                                                        &ldquo;{interaction.summary}&rdquo;
                                                    </p>
                                                )}
                                                {interaction.topicsDiscussed.length > 0 && (
                                                    <div className="flex gap-2 mt-3">
                                                        {interaction.topicsDiscussed.map(topic => (
                                                            <Badge key={topic} variant="outline" className="text-[10px] bg-white">
                                                                {topic}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 border-2 border-dashed rounded-3xl">
                                    <p className="text-muted-foreground">No interactions logged yet.</p>
                                    {/* Link to connect channels? */}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Relationship Health</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col items-center justify-center p-6 bg-zinc-50 rounded-2xl border border-zinc-100">
                                <div className="relative h-32 w-32 flex items-center justify-center">
                                    <svg className="h-full w-full rotate-[-90deg]">
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r="58"
                                            fill="transparent"
                                            stroke="#e2e8f0"
                                            strokeWidth="12"
                                        />
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r="58"
                                            fill="transparent"
                                            stroke={contact.warmthScore > 60 ? "#22c55e" : contact.warmthScore > 30 ? "#eab308" : "#ef4444"}
                                            strokeWidth="12"
                                            strokeDasharray={364.42}
                                            strokeDashoffset={364.42 - (364.42 * contact.warmthScore) / 100}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl font-bold">{Math.round(contact.warmthScore)}</span>
                                        <span className="text-[10px] uppercase tracking-tighter text-muted-foreground font-bold">Warmth</span>
                                    </div>
                                </div>
                                <div className="mt-4 text-center">
                                    <p className="text-sm font-semibold text-zinc-700">
                                        Target: Every {contact.desiredFrequencyDays} days
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Decays by {Math.round(100 / contact.desiredFrequencyDays)} points per day
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center">
                                        <Phone className="h-4 w-4 text-zinc-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Phone</p>
                                        <p className="text-zinc-500">{contact.phone || "Not set"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center">
                                        <Mail className="h-4 w-4 text-zinc-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Email</p>
                                        <p className="text-zinc-500">{contact.email || "Not set"}</p>
                                    </div>
                                </div>
                                {contact.company && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center">
                                            <Building2 className="h-4 w-4 text-zinc-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Company</p>
                                            <p className="text-zinc-500">{contact.role ? `${contact.role} @ ` : ""}{contact.company}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Personal Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-zinc-600 leading-relaxed">
                                {contact.notes || "No notes available for this contact."}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
