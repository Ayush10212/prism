import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import ClientLayout from "./ClientLayout";

export const metadata: Metadata = {
  title: "PRISM | Decision Intelligence",
  description: "Advanced market and behavioral intelligence agent.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col" style={{ backgroundColor: '#050505', color: '#ffffff' }}>
        <AuthProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
