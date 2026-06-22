import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import type { CSSProperties } from "react";
import { getProfile, getActiveThemeTokens } from "@server/lib/queries";
import { themeStyle } from "@/lib/theme";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const profile = await getProfile();
    if (profile) {
      return {
        title: `${profile.name} — ${profile.title}`,
        description: profile.tagline,
      };
    }
  } catch {
  }
  return { title: "Portfolio" };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let style: Record<string, string>;
  try {
    style = themeStyle(await getActiveThemeTokens());
  } catch {
    style = themeStyle();
  }

  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      style={style as CSSProperties}
    >
      <body>{children}</body>
    </html>
  );
}
