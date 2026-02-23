export const dynamic = "force-dynamic";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Users,
    Flame,
    IceCream,
    MessageSquare,
    ArrowRight
} from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user";
import { formatDistanceToNow } from "date-fns";
import { AddContactButton } from "@/components/contacts/AddContactButton";

export default async function DashboardPage() {
    const user = await getOrCreateUser();

    // Real stats from DB (handle null user safely)
    const totalContacts = user ? await prisma.contact.count({ where: { userId: user.id } }) : 0;
    const greenContacts = user ? await prisma.contact.count({ where: { userId: user.id, warmthStatus: "GREEN" } }) : 0;
    const yellowContacts = user ? await prisma.contact.count({ where: { userId: user.id, warmthStatus: "YELLOW" } }) : 0;
    const redContacts = user ? await prisma.contact.count({ where: { userId: user.id, warmthStatus: "RED" } }) : 0;

    const stats = [
        {
            label: "Total Contacts",
            value: totalContacts.toString(),
            icon: Users,
            color: "text-blue-500",
        },
        {
            label: "Warm (Green)",
            value: greenContacts.toString(),
            icon: Flame,
            color: "text-green-500",
        },
        {
            label: "Cooling (Yellow)",
            value: yellowContacts.toString(),
            icon: Flame,
            color: "text-yellow-500",
        },
        {
            label: "Cold (Red)",
            value: redContacts.toString(),
            icon: IceCream,
            color: "text-red-500",
        },
    ];

    // Fetch contacts that need attention
    const attentionContacts = user ? await prisma.contact.findMany({
        where: {
            userId: user.id,
            warmthStatus: { in: ["RED", "DEAD", "YELLOW"] }
        },
        take: 5,
        orderBy: [
            { priority: "desc" },
            { warmthScore: "asc" }
        ]
    }) : [];

    return (
        <div className="p-8 space-y-8 bg-zinc-50 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
                    <p className="text-muted-foreground">
                        Monitor and manage your relationship health.
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" asChild>
                        <Link href="/dashboard/contacts/import">
                            Import
                        </Link>
                    </Button>
                    <AddContactButton />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Card key={stat.label}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.label}
                            </CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Today&apos;s Queue</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Prioritized people to reach out to today.
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {attentionContacts.length > 0 ? (
                                attentionContacts.map((contact) => (
                                    <Link key={contact.id} href={`/dashboard/contacts/${contact.id}`}>
                                        <div className="flex items-center justify-between p-4 border rounded-xl hover:bg-zinc-100 transition cursor-pointer group mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold uppercase">
                                                    {contact.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-zinc-900">{contact.name}</p>
                                                    <p className="text-xs text-muted-foreground flex items-center">
                                                        <MessageSquare className="h-3 w-3 mr-1" />
                                                        {contact.lastInteractionAt
                                                            ? `Last talked ${formatDistanceToNow(new Date(contact.lastInteractionAt))} ago`
                                                            : "No history logged"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge
                                                    variant={
                                                        contact.warmthStatus === "RED" || contact.warmthStatus === "DEAD" ? "destructive" :
                                                            contact.warmthStatus === "YELLOW" ? "warning" : "secondary"
                                                    }
                                                    className="font-medium"
                                                >
                                                    {contact.warmthStatus}
                                                </Badge>
                                                <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-1 transition" />
                                            </div>
                                        </div>
                                    </Link>
                                )
                                )) : (
                                <div className="text-center py-10 border-2 border-dashed rounded-xl">
                                    <Flame className="h-10 w-10 text-zinc-300 mx-auto mb-3" />
                                    <p className="text-zinc-500">All your relationships are currently warm!</p>
                                    <Button variant="link" asChild className="mt-2">
                                        <Link href="/dashboard/contacts">View all contacts</Link>
                                    </Button>
                                </div>
                            )}
                            {attentionContacts.length > 0 && (
                                <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                    <Link href="/dashboard/nudges">View All Nudges</Link>
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Weekly Report</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Your connection streak this week.
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col items-center justify-center py-6">
                            <div className="text-5xl font-extrabold text-green-600 mb-2">
                                {totalContacts > 0 ? Math.round((greenContacts / totalContacts) * 100) : 0}%
                            </div>
                            <p className="text-sm font-medium text-zinc-600 text-center">
                                Relationship Health
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Pings sent</span>
                                <span className="font-bold">0</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Pings received</span>
                                <span className="font-bold">0</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Contacts cooled</span>
                                <span className="font-bold text-red-500">{redContacts}</span>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full">
                            Full Weekly Insight
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
