import prisma from '@/lib/prisma';
import { getGooglePeopleClient } from './auth';

export async function importGoogleContacts(
    userId: string,
    accessToken: string
): Promise<{ imported: number; merged: number; skipped: number }> {
    try {
        const people = getGooglePeopleClient(accessToken);

        const response = await people.people.connections.list({
            resourceName: 'people/me',
            pageSize: 1000,
            personFields: 'names,phoneNumbers,emailAddresses,birthdays,organizations,photos',
        });

        const connections = response.data.connections || [];
        let imported = 0, merged = 0, skipped = 0;

        for (const person of connections) {
            const name = person.names?.[0]?.displayName;
            if (!name) {
                skipped++;
                continue;
            }

            const phone = person.phoneNumbers?.[0]?.value;
            const email = person.emailAddresses?.[0]?.value;
            const birthday = person.birthdays?.[0]?.date;
            const company = person.organizations?.[0]?.name;
            const role = person.organizations?.[0]?.title;
            const avatarUrl = person.photos?.[0]?.url;

            const normalizedPhone = phone ? phone.replace(/[^\d+]/g, '') : null;

            // Check for existing contact
            const existing = await prisma.contact.findFirst({
                where: {
                    userId,
                    OR: [
                        normalizedPhone ? { phone: normalizedPhone } : {},
                        email ? { email: email.toLowerCase() } : {},
                    ].filter(o => Object.keys(o).length > 0),
                },
            });

            if (existing) {
                // Merge missing data
                await prisma.contact.update({
                    where: { id: existing.id },
                    data: {
                        phone: existing.phone || normalizedPhone,
                        email: existing.email || email?.toLowerCase(),
                        company: existing.company || company,
                        role: existing.role || role,
                        avatarUrl: existing.avatarUrl || avatarUrl,
                        birthday: existing.birthday || (birthday ? new Date(birthday.year || 2000, (birthday.month || 1) - 1, birthday.day || 1) : null)
                    }
                });
                merged++;
            } else {
                // Create new
                await prisma.contact.create({
                    data: {
                        userId,
                        name,
                        phone: normalizedPhone,
                        email: email?.toLowerCase() || null,
                        company: company || null,
                        role: role || null,
                        avatarUrl: avatarUrl || null,
                        birthday: birthday ? new Date(birthday.year || 2000, (birthday.month || 1) - 1, birthday.day || 1) : null,
                        category: 'ACQUAINTANCE',
                        desiredFrequencyDays: 30,
                        warmthScore: 0,
                        warmthStatus: 'DEAD'
                    }
                });
                imported++;
            }
        }

        return { imported, merged, skipped };
    } catch (error) {
        console.error("Google Contacts Import Error:", error);
        throw error;
    }
}
