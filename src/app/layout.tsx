import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { GoogleProvider } from "@/components/providers/GoogleProvider";
import { Navbar } from "@/components/layout/Navbar";
import { CommandPalette } from "@/components/common/CommandPalette";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/layout/Footer";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DCoderHub — 해커톤 운영 플랫폼",
  description: "해커톤 정보, 팀빌딩, 랭킹을 한 곳에서. 개발자 커뮤니티 해커톤 플랫폼 DCoderHub.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${spaceGrotesk.variable} ${dmSans.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-[family-name:var(--font-body)]">
        <GoogleProvider>
          <ThemeProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <CommandPalette />
            <Toaster richColors position="bottom-right" />
          </ThemeProvider>
        </GoogleProvider>
      </body>
    </html>
  );
}
