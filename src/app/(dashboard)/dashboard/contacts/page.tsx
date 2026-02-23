export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { AddContactButton } from "@/components/contacts/AddContactButton";

export default async function ContactsPage() {
    const user = await getOrCreateUser();

    const contacts = user ? await prisma.contact.findMany({
        where: { userId: user.id },
        orderBy: { name: "asc" }
    }) : [];

    return (
        <div className="p-8 space-y-8 bg-zinc-50 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Contacts</h2>
                    <p className="text-muted-foreground">
                        Manage your network and relationships.
                    </p>
                </div>
                <AddContactButton />
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Last Interaction</TableHead>
                            <TableHead>Frequency</TableHead>
                            <TableHead className="text-right">Score</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {contacts.length > 0 ? (
                            contacts.map((contact) => (
                                <TableRow key={contact.id}>
                                    <TableCell className="font-semibold">{contact.name}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                contact.warmthStatus === "GREEN" ? "secondary" :
                                                    contact.warmthStatus === "YELLOW" ? "warning" : "destructive"
                                            }
                                        >
                                            {contact.warmthStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="capitalize">
                                        {contact.category.toLowerCase().replace("_", " ")}
                                    </TableCell>
                                    <TableCell>
                                        {contact.lastInteractionAt
                                            ? format(new Date(contact.lastInteractionAt), "MMM d, yyyy")
                                            : "Never"}
                                    </TableCell>
                                    <TableCell>{contact.desiredFrequencyDays} days</TableCell>
                                    <TableCell className="text-right font-mono">
                                        {Math.round(contact.warmthScore)}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                    No contacts found. Add your first one to get started!
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
