import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    MessageSquare,
    Smartphone,
    SendHorizontal,
    LineChart,
    Link as LinkIcon,
    CheckCircle2,
    AlertCircle,
    QrCode
} from "lucide-react";

const platforms = [
    {
        id: "whatsapp",
        name: "WhatsApp",
        icon: MessageSquare,
        color: "text-green-500",
        bg: "bg-green-50",
        description: "Automatic tracking via Baileys gateway",
        status: "connected",
        lastSync: "2 hours ago"
    },
    {
        id: "imessage",
        name: "iMessage",
        icon: Smartphone,
        color: "text-blue-500",
        bg: "bg-blue-50",
        description: "Native macOS tracking via imsg CLI",
        status: "disconnected"
    },
    {
        id: "telegram",
        name: "Telegram",
        icon: SendHorizontal,
        color: "text-sky-500",
        bg: "bg-sky-50",
        description: "Connect via the Ping Bot",
        status: "connected",
        lastSync: "15 mins ago"
    },
    {
        id: "google",
        name: "Google Contacts",
        icon: LinkIcon,
        color: "text-red-500",
        bg: "bg-red-50",
        description: "Daily contact and email sync",
        status: "connected",
        lastSync: "1 day ago"
    }
];

export default function ChannelsPage() {
    return (
        <div className="p-8 space-y-8 bg-zinc-50 min-h-screen">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Channels</h2>
                <p className="text-muted-foreground">
                    Manage your messaging platform connections.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {platforms.map((platform) => (
                    <Card key={platform.id} className="relative overflow-hidden group">
                        {platform.status === "connected" && (
                            <div className="absolute top-4 right-4 h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                        )}
                        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                            <div className={`p-3 rounded-2xl ${platform.bg}`}>
                                <platform.icon className={`h-6 w-6 ${platform.color}`} />
                            </div>
                            <div>
                                <CardTitle>{platform.name}</CardTitle>
                                <CardDescription>{platform.description}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2">
                                    {platform.status === "connected" ? (
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-none">
                                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                                Connected
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">Sync: {platform.lastSync}</span>
                                        </div>
                                    ) : (
                                        <Badge variant="outline" className="text-zinc-500">
                                            <AlertCircle className="h-3 w-3 mr-1" />
                                            Disconnected
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    {platform.id === "whatsapp" && platform.status === "disconnected" ? (
                                        <Button size="sm">
                                            <QrCode className="h-4 w-4 mr-2" />
                                            Scan QR
                                        </Button>
                                    ) : platform.status === "connected" ? (
                                        <>
                                            <Button variant="ghost" size="sm">Sync Now</Button>
                                            <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-600 border-red-100">
                                                Disconnect
                                            </Button>
                                        </>
                                    ) : (
                                        <Button size="sm">Connect</Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="bg-blue-600 text-white border-none shadow-xl">
                <CardHeader>
                    <CardTitle>How Automated Tracking Works</CardTitle>
                    <CardDescription className="text-blue-100 font-medium">
                        Privacy-first background monitoring for your relationships.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1">
                            <div className="font-bold">1. Zero Manual Entry</div>
                            <p className="text-sm text-blue-500/80 leading-relaxed bg-white/10 p-3 rounded-lg border border-white/20 text-white">
                                We monitor metadata (timestamps and direction) to calculate relationship warmth automatically.
                            </p>
                        </div>
                        <div className="space-y-1">
                            <div className="font-bold">2. Local Processing</div>
                            <p className="text-sm text-blue-500/80 leading-relaxed bg-white/10 p-3 rounded-lg border border-white/20 text-white">
                                For macOS users, iMessage tracking happens entirely on your machine via the open-source imsg gateway.
                            </p>
                        </div>
                        <div className="space-y-1">
                            <div className="font-bold">3. Privacy Focused</div>
                            <p className="text-sm text-blue-500/80 leading-relaxed bg-white/10 p-3 rounded-lg border border-white/20 text-white">
                                Ping NEVER stores your raw message content. We only process summaries ephemerally to help you reconnect.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
