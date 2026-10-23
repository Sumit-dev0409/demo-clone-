import type { Metadata, Viewport } from "next";
import { Fraunces, Figtree, Shantell_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
});

const figtree = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-figtree",
});

const shantell = Shantell_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-shantell",
  axes: ["INFM", "BNCE"],
});

export const metadata: Metadata = {
  title: "TeddyPups — Premium teacup puppies in Dubai",
  description:
    "Meet your new best friend in our Dubai showroom, or order a rare miniature breed from trusted breeders worldwide.",
};

export const viewport: Viewport = {
  themeColor: "#fffdf8",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${figtree.variable} ${shantell.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}