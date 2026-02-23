"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    Bell,
    BarChart3,
    Plug,
    Settings,
    PlusCircle,
    Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserButton } from "@clerk/nextjs";

const routes = [
    {
        label: "Overview",
        icon: LayoutDashboard,
        href: "/dashboard",
        color: "text-sky-500",
    },
    {
        label: "Contacts",
        icon: Users,
        href: "/dashboard/contacts",
        color: "text-violet-500",
    },
    {
        label: "Nudges",
        icon: Bell,
        href: "/dashboard/nudges",
        color: "text-pink-700",
    },
    {
        label: "Analytics",
        icon: BarChart3,
        href: "/dashboard/analytics",
        color: "text-orange-700",
    },
    {
        label: "Channels",
        icon: Plug,
        href: "/dashboard/channels",
        color: "text-emerald-500",
    },
    {
        label: "Settings",
        icon: Settings,
        href: "/dashboard/settings",
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                    <div className="relative w-8 h-8 mr-4">
                        <div className="absolute inset-0 bg-blue-600 rounded-full animate-pulse" />
                        <div className="absolute inset-2 bg-white rounded-full" />
                    </div>
                    <h1 className="text-2xl font-bold">Ping</h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="px-3 py-2">
                <div className="flex items-center justify-between pl-3 pr-2 mb-2">
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                        Quick Actions
                    </p>
                </div>
                <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-white hover:bg-white/10 mb-4">
                    <PlusCircle className="h-5 w-5 mr-3 text-blue-500" />
                    Add Contact
                </Button>
                <div className="flex items-center p-3 w-full justify-start hover:bg-white/5 rounded-lg transition border border-white/10">
                    <UserButton afterSignOutUrl="/" />
                    <div className="ml-3 flex flex-col items-start overflow-hidden">
                        <p className="text-sm font-medium text-white truncate w-full">Account</p>
                        <p className="text-xs text-zinc-500 truncate w-full">Manage Profile</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
