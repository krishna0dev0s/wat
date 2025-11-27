import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from '@clerk/themes';
import { Toaster } from "@/components/ui/sonner";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "watshibo",
  description: "bankai",
};

// Prevent hydration errors globally
export const dynamic = "force-dynamic";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} overflow-x-hidden`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {/* Background removed as requested */}

            {/* Content Layer */}
            <div className="relative z-10">
              {/* Header - Integrated */}
              <Header />

              {/* Main Content */}
              <main className="min-h-screen">{children}</main>

              {/* Footer */}
              <footer className="text-center py-4 text-sm text-muted-foreground relative z-10">
                made with ❤️ by krishna gupta
              </footer>
            </div>

            {/* Toaster */}
            <Toaster 
              position="top-center"
              expand={true}
              richColors
              closeButton
            />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}