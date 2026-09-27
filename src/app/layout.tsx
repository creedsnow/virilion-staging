import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Spectral } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthSessionProvider } from "@/components/AuthSessionProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const displaySerif = Spectral({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Virilion — Staging",
  description:
    "Adult queer mythic fantasy RP site — desktop and mobile. Staging for Creed Snow.",
  applicationName: "Virilion",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Virilion",
  },
};

export const viewport: Viewport = {
  // Moonlight chrome by default — do NOT follow prefers-color-scheme here.
  // ThemeProvider updates theme-color when the player picks Parchment.
  themeColor: "#0c0a12",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

const THEME_BOOT = `(function(){try{var k='virilion_theme_v1';var t=localStorage.getItem(k);if(t!=='light'&&t!=='dark'){try{localStorage.removeItem('virilion_theme');}catch(e){}t='dark';}var m=t==='light'?'light':'dark';var r=document.documentElement;r.setAttribute('data-theme',m);r.style.colorScheme=m;}catch(e){var r2=document.documentElement;r2.setAttribute('data-theme','dark');r2.style.colorScheme='dark';}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      style={{ colorScheme: "dark" }}
      className={`${geistSans.variable} ${geistMono.variable} ${displaySerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html: THEME_BOOT,
          }}
        />
        <ThemeProvider>
          <AuthSessionProvider>
            <AppShell>{children}</AppShell>
          </AuthSessionProvider>
        </ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(function(){});});}`,
          }}
        />
      </body>
    </html>
  );
}
