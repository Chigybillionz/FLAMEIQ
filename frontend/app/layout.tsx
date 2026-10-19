import "./globals.css";
import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: "FlameIntel",
  description: "FlameIntel — Local Impact Hackathon 2026",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

/**
 * The root layout component for the entire application.
 * It wraps the entire app in a ThemeProvider and an AuthProvider.
 * The ThemeProvider is responsible for handling the theme state and toggling
 * between light and dark mode. The AuthProvider is responsible for handling
 * the authentication state and providing the authentication context to the
 * entire app.
 * @param {React.ReactNode} children - The children components to render.
 * @returns {JSX.Element} The root layout component with the theme and
 * authentication providers wrapped around the children components.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}