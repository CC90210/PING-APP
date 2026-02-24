"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    Bell,
    BarChart3,
    Settings,
    PlusCircle,
    LogOut,
    ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
        label: "Settings",
        icon: Settings,
        href: "/dashboard/settings",
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [showMenu, setShowMenu] = useState(false);

    const userInitial = session?.user?.name?.charAt(0)?.toUpperCase() || session?.user?.email?.charAt(0)?.toUpperCase() || "?";
    const userName = session?.user?.name || "My Account";
    const userEmail = session?.user?.email || "";

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
                                pathname === route.href
                                    ? "text-white bg-white/10"
                                    : "text-zinc-400"
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
                <Link href="/dashboard/contacts?new=true">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-zinc-400 hover:text-white hover:bg-white/10 mb-4"
                    >
                        <PlusCircle className="h-5 w-5 mr-3 text-blue-500" />
                        Add Contact
                    </Button>
                </Link>

                {/* User menu */}
                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="flex items-center w-full p-3 hover:bg-white/5 rounded-lg transition border border-white/10"
                    >
                        {session?.user?.image ? (
                            <img
                                src={session.user.image}
                                alt=""
                                className="h-8 w-8 rounded-full object-cover"
                            />
                        ) : (
                            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
                                {userInitial}
                            </div>
                        )}
                        <div className="ml-3 flex flex-col items-start overflow-hidden flex-1">
                            <p className="text-sm font-medium text-white truncate w-full text-left">
                                {userName}
                            </p>
                            <p className="text-xs text-zinc-500 truncate w-full text-left">
                                {userEmail}
                            </p>
                        </div>
                        <ChevronDown
                            className={cn(
                                "h-4 w-4 text-zinc-500 transition-transform",
                                showMenu && "rotate-180"
                            )}
                        />
                    </button>

                    {showMenu && (
                        <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#1e293b] border border-white/10 rounded-lg shadow-xl overflow-hidden">
                            <button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="flex items-center w-full px-4 py-3 text-sm text-zinc-300 hover:bg-white/10 hover:text-white transition"
                            >
                                <LogOut className="h-4 w-4 mr-3" />
                                Sign out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
