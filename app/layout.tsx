import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces, Michroma, VT323 } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ClubLights } from "@/components/club-lights";
import { CounterAIHost } from "@/components/chat/counter-ai-host";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

// Y2K layer: Michroma = extended "cyber" labels; VT323 = LED/terminal readouts.
const michroma = Michroma({
  variable: "--font-cyber",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const vt323 = VT323({
  variable: "--font-led",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Callum David Thomas — Software developer",
    template: "%s · Callum David Thomas",
  },
  description:
    "Portfolio of Callum David Thomas — software developer building clean, modular web apps. Melbourne / remote.",
  metadataBase: new URL("https://callumdavidthomas.com"),
  openGraph: {
    type: "website",
    title: "Callum David Thomas",
    description: "Software developer. Melbourne / remote.",
    url: "https://callumdavidthomas.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${michroma.variable} ${vt323.variable} h-full antialiased`}
    >
      <body className="grain relative min-h-full overflow-x-hidden bg-background text-foreground">
        <ClubLights />
        <div className="relative z-10 flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        <CounterAIHost />
      </body>
    </html>
  );
}
