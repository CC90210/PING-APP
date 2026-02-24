export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50/40 to-white px-4">
            {children}
        </div>
    );
}
