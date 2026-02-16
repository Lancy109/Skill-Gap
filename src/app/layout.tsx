"use client"; // <--- Essential for Sidebar state

import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Import your UI Components 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Note: 'export const metadata' is removed because this is now a Client Component.
// We add <title> and <meta> tags inside the <head> below instead.

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {



  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <title>Skill Gap</title>
          <meta name="description" content="Identify and close your skill gaps" />
        </head>

        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#FDFDFE] text-slate-900`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}