import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getAllConfig } from "@/lib/server/config";
import { ConfigProvider } from "@/components/providers/configProvider";
import { StateProvider } from "@/components/providers/stateProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MCC Live Show - Graphics",
  description: "Graphics for MCC Live Show",
};

export default async function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  const config = await getAllConfig();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <StateProvider>
          <ConfigProvider configData={config}>
            {children}
          </ConfigProvider>
        </StateProvider>
      </body>
    </html>
  );
}
