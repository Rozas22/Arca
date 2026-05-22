import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { Navbar } from "@/components/layout/Navbar";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Arca - Productividad Estudiantil",
  description: "Constancia y enfoque para tus sesiones de estudio.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col md:flex-row">
            <Navbar />
            
            {/* Main Content Area */}
            <main className="flex-1 flex justify-center pb-16 md:pb-0 md:pl-20 lg:pl-64 transition-all duration-300 ease-in-out">
               {/* Contenedor central max-w-md para evitar que se estire en pantallas gigantes */}
               <div className="w-full max-w-md lg:max-w-lg p-4 md:p-8 animate-in fade-in duration-500">
                 {children}
               </div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
