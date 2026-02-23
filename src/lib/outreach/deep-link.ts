// src/lib/outreach/deep-link.ts

export function generateDeepLink(
    channel: string,
    recipient: string,  // phone number, email, or handle
    message: string
): string {
    if (!recipient) return '';

    switch (channel.toLowerCase()) {
        case 'whatsapp':
            const phone = recipient.replace(/\D/g, '');
            return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        case 'imessage':
        case 'sms':
            // recipient for iMessage/SMS can be phone or email
            // Using & as separator for iOS compat, sometimes ; is used but & is safer for combined links
            return `sms:${recipient}&body=${encodeURIComponent(message)}`;
        case 'telegram':
            // Telegram handles usually start with @, format for link is without @
            const handle = recipient.replace('@', '');
            return `https://t.me/${handle}?text=${encodeURIComponent(message)}`;
        case 'email':
            return `mailto:${recipient}?body=${encodeURIComponent(message)}`;
        default:
            return '';
    }
}

export function copyToClipboard(text: string): boolean {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return false;
    navigator.clipboard.writeText(text);
    return true;
}
