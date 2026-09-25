import type { Metadata } from "next";
import Link from "next/link";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./(site)/site.css";
import { Header } from "@/components/site/header";
import { TitleBlock } from "@/components/site/title-block";

const interTight = Inter_Tight({ variable: "--font-inter-tight", subsets: ["latin"], display: "swap" });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], weight: ["400", "500"], display: "swap" });

export const metadata: Metadata = {
  title: "Not found · Callum Thomas",
};

export default function GlobalNotFound() {
  return (
    <html lang="en-AU" className={`${interTight.variable} ${jetbrains.variable}`}>
      <body>
        <Header />
        <main className="row" id="content">
          <div className="cell lost">
            <p className="label">
              <b>404</b> · Sheet not found
            </p>
            <h1>Lost.</h1>
            <p>This page doesn&apos;t exist. Even humans take a wrong turn sometimes.</p>
            <div className="ctas">
              <Link className="btn solid" href="/">
                Back to the homepage
              </Link>
            </div>
          </div>
        </main>
        <TitleBlock drawing="404" stamp={{ top: "Status", main: "Not found" }} />
      </body>
    </html>
  );
}
