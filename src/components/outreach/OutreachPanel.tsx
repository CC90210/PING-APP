"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Loader2,
    Sparkles,
    Send,
    Copy,
    Check,
    RotateCcw,
    MessageCircle,
    Mail,
    Smartphone,
    SendHorizontal
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import axios from "axios";
import { generateDeepLink, copyToClipboard } from "@/lib/outreach/deep-link";
import { cn } from "@/lib/utils";

interface MessageSuggestion {
    id: string;
    text: string;
    tone: string;
    confidence: number;
}

interface OutreachPanelProps {
    contactId: string;
    contactName: string;
    onClose?: () => void;
    onSent?: () => void;
}

export function OutreachPanel({ contactId, contactName, onClose, onSent }: OutreachPanelProps) {
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<MessageSuggestion[]>([]);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState<number | null>(null);
    const [messageText, setMessageText] = useState("");
    const [channel, setChannel] = useState("whatsapp");
    const [recipient, setRecipient] = useState("");
    const [copied, setCopied] = useState(false);
    const [sending, setSending] = useState(false);

    const fetchSuggestions = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.post("/api/ai/suggest-message", { contactId });
            setSuggestions(response.data.suggestions);
            setChannel(response.data.contact.preferredChannel || "whatsapp");
            // Note: Recipient should ideally come from the API (phone or email)
            // For now we'll assume we need to handle it or it's fetched with contact detail
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }, [contactId]);

    useEffect(() => {
        fetchSuggestions();
    }, [fetchSuggestions]);

    useEffect(() => {
        if (selectedSuggestionIndex !== null && suggestions[selectedSuggestionIndex]) {
            setMessageText(suggestions[selectedSuggestionIndex].text);
        }
    }, [selectedSuggestionIndex, suggestions]);

    const handleCopy = () => {
        copyToClipboard(messageText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSend = () => {
        // Mode A: Deep Link
        const link = generateDeepLink(channel, recipient || "1234567890", messageText); // Hardcoded fallback for demo
        window.open(link, "_blank");

        // Log interaction would follow here
        if (onSent) onSent();
    };

    if (loading) {
        return (
            <Card className="border-none shadow-none bg-transparent">
                <CardHeader className="px-0">
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="px-0 space-y-4">
                    <Skeleton className="h-32 w-full rounded-xl" />
                    <div className="grid grid-cols-3 gap-2">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-blue-500" />
                        Reach out to {contactName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Claude has prepared these personalized pings for you.
                    </p>
                </div>
                <Button variant="ghost" size="sm" onClick={fetchSuggestions} disabled={loading}>
                    <RotateCcw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                    Regenerate
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {suggestions.map((suggestion, index) => (
                    <div
                        key={suggestion.id}
                        onClick={() => setSelectedSuggestionIndex(index)}
                        className={cn(
                            "p-4 rounded-xl border-2 transition cursor-pointer hover:border-blue-500 group relative",
                            selectedSuggestionIndex === index ? "border-blue-600 bg-blue-50/50" : "border-zinc-200 bg-white"
                        )}
                    >
                        <Badge variant="outline" className="mb-2 uppercase text-[10px] tracking-widest">
                            {suggestion.tone}
                        </Badge>
                        <p className="text-sm line-clamp-3 text-zinc-700 leading-relaxed font-medium">
                            &quot;{suggestion.text}&quot;
                        </p>
                        {selectedSuggestionIndex === index && (
                            <div className="absolute top-2 right-2 h-4 w-4 bg-blue-600 rounded-full flex items-center justify-center">
                                <Check className="h-2 w-2 text-white" />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="space-y-4 bg-white p-6 rounded-2xl border-2 border-zinc-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="message">Final Message</Label>
                    <div className="flex items-center gap-2">
                        <Select value={channel} onValueChange={setChannel}>
                            <SelectTrigger className="w-[140px] h-8 text-xs">
                                <SelectValue placeholder="Channel" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="whatsapp">
                                    <span className="flex items-center"><MessageCircle className="h-3 w-3 mr-2 text-green-500" /> WhatsApp</span>
                                </SelectItem>
                                <SelectItem value="imessage">
                                    <span className="flex items-center"><Smartphone className="h-3 w-3 mr-2 text-blue-500" /> iMessage</span>
                                </SelectItem>
                                <SelectItem value="telegram">
                                    <span className="flex items-center"><SendHorizontal className="h-3 w-3 mr-2 text-sky-500" /> Telegram</span>
                                </SelectItem>
                                <SelectItem value="email">
                                    <span className="flex items-center"><Mail className="h-3 w-3 mr-2 text-red-500" /> Email</span>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <Textarea
                    id="message"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Select a suggestion above or start typing..."
                    className="min-h-[120px] rounded-xl border-zinc-200 focus-visible:ring-blue-500 resize-none text-base"
                />
                <div className="flex items-center justify-between pt-2">
                    <Button variant="outline" onClick={handleCopy} className="rounded-full">
                        {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                        {copied ? "Copied" : "Copy"}
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={onClose} className="rounded-full">
                            Skip
                        </Button>
                        <Button onClick={handleSend} className="bg-blue-600 hover:bg-blue-700 rounded-full px-8 font-bold">
                            <Send className="h-4 w-4 mr-2" />
                            Send Ping
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Internal Label component since I didn't check if it was exported or needed shadcn add
function Label({ children, className, ...props }: any) {
    return (
        <label className={cn("text-sm font-semibold text-zinc-700", className)} {...props}>
            {children}
        </label>
    );
}
