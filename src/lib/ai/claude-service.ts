import Anthropic from '@anthropic-ai/sdk';
import prisma from '@/lib/prisma';

if (!process.env.ANTHROPIC_API_KEY) {
    console.warn("ANTHROPIC_API_KEY is missing from environment variables.");
}

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export interface MessageSuggestion {
    id: string;
    text: string;
    tone: string;        // "casual" | "warm" | "professional"
    confidence: number;  // 0-1 how confident the AI is this will land well
}

export interface ContactContext {
    name: string;
    category: string;
    daysSinceLastInteraction: number;
    lastTopics: string[];
    lastInteractionSummary: string | null;
    birthday: Date | null;
    company: string | null;
    role: string | null;
    notes: string | null;
    preferredChannel: string;
}

export async function generateOutreachMessages(
    context: ContactContext,
    userTone: string,      // from user settings
    count: number = 3
): Promise<MessageSuggestion[]> {

    const systemPrompt = `You are Ping's message composer. You write short, natural messages that real humans send to people they know. You are NOT an AI assistant — you are ghostwriting as the user.

ABSOLUTE RULES:
- Maximum 2 sentences for text/WhatsApp messages, 3-4 for email
- Sound like a real human texting, not a robot or a corporate email
- NEVER use phrases like "I hope this finds you well" or "Just checking in"
- NEVER start with "Hey! It's been a while" — that's what every bad app suggests
- Reference something SPECIFIC if context is available (their job, a past topic, something personal)
- Include exactly ONE question to invite a response
- Match the tone to the relationship category
- Use lowercase and casual punctuation for friends (no periods at end of texts)
- Use proper punctuation for professional contacts
- NO emojis for professional contacts, 0-1 emoji for friends/family
- If it's been a very long time (60+ days), acknowledge it naturally without making it weird`;

    const userPrompt = `Generate ${count} message options for me to send to ${context.name}.

RELATIONSHIP: ${context.category}
DAYS SINCE LAST TALK: ${context.daysSinceLastInteraction}
LAST TOPICS DISCUSSED: ${context.lastTopics.length > 0 ? context.lastTopics.join(', ') : 'Unknown'}
LAST INTERACTION SUMMARY: ${context.lastInteractionSummary || 'No summary available'}
THEIR COMPANY/ROLE: ${context.company ? `${context.role} at ${context.company}` : 'Unknown'}
MY NOTES ABOUT THEM: ${context.notes || 'None'}
UPCOMING BIRTHDAY: ${context.birthday ? formatBirthdayProximity(context.birthday) : 'Unknown'}
SENDING VIA: ${context.preferredChannel}
MY PREFERRED TONE: ${userTone}

Return ONLY a JSON array with ${count} objects. Each object has:
- "text": the message
- "tone": "casual" | "warm" | "professional"
- "confidence": 0.0 to 1.0

Order from most casual to most formal. No markdown, no backticks, just raw JSON.`;

    try {
        const response = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022', // Updated to latest available stable sonnet
            max_tokens: 1000,
            system: systemPrompt,
            messages: [{ role: 'user', content: userPrompt }],
        });

        const text = response.content[0].type === 'text' ? response.content[0].text : '';

        try {
            const suggestions = JSON.parse(text.trim());
            return suggestions.map((s: any, i: number) => ({
                id: `suggestion-${i}`,
                text: s.text,
                tone: s.tone,
                confidence: s.confidence,
            }));
        } catch {
            // Fallback if JSON parsing fails
            return [{
                id: 'suggestion-0',
                text: `Hey ${context.name}, been a minute — how are things going?`,
                tone: 'casual',
                confidence: 0.5,
            }];
        }
    } catch (error) {
        console.error("Claude API Error:", error);
        return [{
            id: 'error-suggestion',
            text: `Hey ${context.name}, wanted to catch up! How have you been?`,
            tone: 'casual',
            confidence: 0.5,
        }];
    }
}

export async function summarizeInteraction(
    contactName: string,
    messageText: string,
    direction: string
): Promise<{ summary: string; topics: string[]; sentiment: string }> {

    try {
        const response = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 500,
            system: 'You extract conversation metadata. Return ONLY valid JSON with keys: summary (1 sentence), topics (array of 1-5 short keywords), sentiment ("positive" | "neutral" | "negative"). No markdown.',
            messages: [{
                role: 'user',
                content: `${direction === 'outbound' ? 'I' : contactName} said: "${messageText}"\n\nExtract metadata as JSON.`,
            }],
        });

        const text = response.content[0].type === 'text' ? response.content[0].text : '{}';

        try {
            return JSON.parse(text.trim());
        } catch {
            return { summary: '', topics: [], sentiment: 'neutral' };
        }
    } catch (error) {
        console.error("Claude Summary Error:", error);
        return { summary: '', topics: [], sentiment: 'neutral' };
    }
}

function formatBirthdayProximity(birthday: Date): string {
    const today = new Date();
    const nextBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
    if (nextBirthday < today) nextBirthday.setFullYear(today.getFullYear() + 1);
    const daysUntil = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntil <= 7) return `In ${daysUntil} days!`;
    if (daysUntil <= 30) return `In ${daysUntil} days`;
    return 'Not soon';
}
