import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Nav from "@/components/ui/nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SRTIFY",
  description: "Generated SRT files from your videos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col h-screen container">
            <div className="flex-none h-20">
              <Nav />
            </div>
            <div className="grow">{children}</div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
