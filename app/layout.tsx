import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider, NO_FLASH_SCRIPT } from "@/providers/ThemeProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import { CommandPaletteProvider } from "@/providers/CommandPaletteProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "HashVault Connect",
    template: "%s · HashVault",
  },
  description:
    "HashVault Connect — institutional yield vaults powered by Bitcoin mining. Daily distributions, 3-year lock, capital recovery safeguard.",
  applicationName: "HashVault",
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBFBFD" },
    { media: "(prefers-color-scheme: dark)",  color: "#0A0B0E" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />
      </head>
      <body>
        <ThemeProvider>
          <ToastProvider>
            <CommandPaletteProvider>
              {children}
            </CommandPaletteProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
