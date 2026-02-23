import WebSocket from 'ws';

export interface OpenClawConfig {
    gatewayUrl: string;       // ws://127.0.0.1:18789
    apiKey?: string;
    reconnectInterval: number; // ms
    maxReconnectAttempts: number;
}

export interface InboundMessage {
    id: string;
    channel: string;          // "whatsapp" | "imessage" | "telegram"
    chatId: string;
    senderJid: string;        // platform-specific sender ID
    senderName: string;
    text: string;
    timestamp: number;        // unix ms
    isFromMe: boolean;
    messageType: string;      // "text" | "image" | "voice" | "video"
    metadata?: Record<string, any>;
}

class OpenClawGatewayClient {
    private ws: WebSocket | null = null;
    private config: OpenClawConfig;
    private reconnectAttempts: number = 0;
    private messageHandlers: ((msg: InboundMessage) => void)[] = [];
    private isConnected: boolean = false;

    constructor(config: OpenClawConfig) {
        this.config = config;
    }

    connect(): void {
        if (this.ws || this.reconnectAttempts >= this.config.maxReconnectAttempts) return;

        console.log(`Connecting to OpenClaw at ${this.config.gatewayUrl}...`);
        this.ws = new WebSocket(this.config.gatewayUrl);

        this.ws.on('open', () => {
            console.log('Connected to OpenClaw gateway');
            this.isConnected = true;
            this.reconnectAttempts = 0;

            // Send auth if API key is present
            if (this.config.apiKey) {
                this.ws?.send(JSON.stringify({ type: 'auth', apiKey: this.config.apiKey }));
            }
        });

        this.ws.on('message', (data: string) => {
            try {
                const payload = JSON.parse(data);
                if (payload.type === 'message') {
                    this.messageHandlers.forEach(handler => handler(payload.data));
                }
            } catch (err) {
                console.error('Error parsing OpenClaw message:', err);
            }
        });

        this.ws.on('close', () => {
            console.log('OpenClaw gateway connection closed');
            this.isConnected = false;
            this.ws = null;
            this.scheduleReconnect();
        });

        this.ws.on('error', (err) => {
            console.error('OpenClaw gateway error:', err);
        });
    }

    private scheduleReconnect(): void {
        this.reconnectAttempts++;
        const delay = Math.min(this.config.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1), 60000);
        console.log(`Scheduling reconnect to OpenClaw in ${delay}ms (Attempt ${this.reconnectAttempts})`);
        setTimeout(() => this.connect(), delay);
    }

    onMessage(handler: (msg: InboundMessage) => void): void {
        this.messageHandlers.push(handler);
    }

    async sendMessage(channel: string, to: string, text: string): Promise<boolean> {
        if (!this.isConnected || !this.ws) return false;

        return new Promise((resolve) => {
            this.ws?.send(JSON.stringify({
                type: 'send',
                channel,
                to,
                text
            }), (err) => {
                if (err) {
                    console.error(`Error sending message to ${to} via ${channel}:`, err);
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    }

    async getChannelStatus(): Promise<Record<string, string>> {
        // Mocking response for now as actual gateway API depends on implementation
        return {
            whatsapp: "connected",
            imessage: "disconnected",
            telegram: "connected"
        };
    }

    async getRecentChats(channel: string, limit: number = 20): Promise<any[]> {
        // This would typically be a request-response over WebSocket or a REST API
        return [];
    }

    async getChatHistory(channel: string, chatId: string, limit: number = 50): Promise<any[]> {
        return [];
    }

    disconnect(): void {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}

export const openclawClient = new OpenClawGatewayClient({
    gatewayUrl: process.env.OPENCLAW_GATEWAY_URL || 'ws://127.0.0.1:18789',
    apiKey: process.env.OPENCLAW_API_KEY,
    reconnectInterval: 5000,
    maxReconnectAttempts: 20,
});
