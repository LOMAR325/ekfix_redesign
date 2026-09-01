import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Analytics } from "@/components/Analytics";
import { metadataBase } from "@/lib/seo";

// Defaults ported from the current index.html <head>; individual routes
// override title/description/canonical via lib/seo pageMetadata().
export const metadata: Metadata = {
  metadataBase,
  title: "EK Global — Same-Day Appliance Repair in Charlotte, NC",
  description:
    "Family-owned appliance repair in Charlotte, NC and surrounding towns. EPA 608 & OSHA certified technicians, same-day service, $75 diagnostic waived with repair.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "EK Global — Same-Day Appliance Repair in Charlotte, NC",
    description:
      "Family-owned appliance repair. EPA 608 & OSHA certified. Same-day service, warranty on every repair.",
    type: "website",
    url: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&display=optional"
          rel="stylesheet"
        />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
