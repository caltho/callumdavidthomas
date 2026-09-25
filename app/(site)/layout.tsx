import type { Metadata } from "next";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./site.css";
import { Header } from "@/components/site/header";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const description = "Callum Thomas. Builder, AI whisperer, solution seeker. A real person, in Melbourne.";

export const metadata: Metadata = {
  title: {
    default: "Callum Thomas · A person",
    template: "%s · Callum Thomas",
  },
  description,
  metadataBase: new URL("https://callum-thomas.com"),
  openGraph: {
    type: "website",
    title: "Callum Thomas · A person",
    description,
    url: "https://callum-thomas.com",
  },
};

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU" className={`${interTight.variable} ${jetbrains.variable}`}>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
