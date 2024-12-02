import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import { MainNav } from "@/components/main-nav";
import { Toaster } from "sonner";
import { ChatBox } from "@/components/chat-box";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Social AI - Content Management',
  description: 'AI-powered social media content management platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MainNav />
          {children}
          <ChatBox />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}