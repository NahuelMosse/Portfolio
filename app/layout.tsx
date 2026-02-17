import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
  preload: true,
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: "Nahuel Mosse | Software Engineer - Full Stack Developer",
  description:
    "Software Engineer specializing in full-stack development with Node.js, React, TypeScript, and PostgreSQL. Over 3 years of experience building scalable B2C platforms.",
  keywords: [
    "Software Engineer",
    "Full Stack Developer",
    "Node.js",
    "React",
    "TypeScript",
    "NestJS",
    "PostgreSQL",
    "Next.js",
    "Angular",
    "Web Development",
    "Buenos Aires",
    "Argentina",
    "API Development",
    "Frontend Developer",
    "Backend Developer",
    "JavaScript",
  ],
  authors: [{ name: "Nahuel Mosse", url: "https://github.com/NahuelMosse" }],
  creator: "Nahuel Mosse",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://nahuelmosse.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Nahuel Mosse | Software Engineer Portfolio",
    description: "Software Engineer specializing in full-stack development with Node.js, React, and TypeScript.",
    siteName: "Nahuel Mosse Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nahuel Mosse | Software Engineer",
    description: "Software Engineer specializing in full-stack development",
    creator: "@NahuelMosse",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Suppress known React 19 + Next.js 16 Performance.measure error in development */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && '${process.env.NODE_ENV}' === 'development') {
                const originalError = console.error;
                console.error = (...args) => {
                  if (
                    typeof args[0] === 'string' &&
                    args[0].includes("Failed to execute 'measure' on 'Performance'")
                  ) {
                    return;
                  }
                  originalError.apply(console, args);
                };
              }
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
        {process.env.VERCEL_ENV && <Analytics />}
      </body>
    </html>
  )
}
