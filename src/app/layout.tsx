import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

// System fonts - no Google Fonts dependency for offline builds
// Variables are defined in globals.css for CSS engine to use

export const metadata: Metadata = {
  title: "Shopwave Fusion",
  description: "Catálogo y detalle de productos con Next.js y Shadcn",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col text-foreground">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
