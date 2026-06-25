import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/shared/components/layout/Header";
import { Toaster } from "@/shared/components/feedback/Toaster";

export const metadata: Metadata = {
  title: {
    default: "Feed Community",
    template: "%s · Feed Community",
  },
  description:
    "Ask questions and share answers — the Danajo Community MVP.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen" suppressHydrationWarning>
        <Providers>
          <Header />
          <main className="container max-w-5xl py-6">{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
