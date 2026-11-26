import "@/lib/fonts";
import "../globals.css";

export const metadata = { title: "KARAM Admin", robots: { index: false, follow: false } };

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-bg text-white antialiased">{children}</body>
    </html>
  );
}
