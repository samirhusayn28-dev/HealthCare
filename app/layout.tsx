import type { Metadata, Viewport } from "next"
import { Inter, Sora } from "next/font/google"
import "./globals.css"
import { LenisProvider } from "@/components/layout/LenisProvider"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { WhatsAppFAB } from "@/components/sections/WhatsAppCTA"
import { AiReceptionist } from "@/components/ai/AiReceptionist"
import { CLINIC_NAME, CLINIC_DESCRIPTION } from "@/lib/constants"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: CLINIC_NAME,
    template: `%s | ${CLINIC_NAME}`,
  },
  description: CLINIC_DESCRIPTION,
  keywords: ["clinic", "healthcare", "doctors", "appointments", "medical", "san francisco"],
  authors: [{ name: CLINIC_NAME }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: CLINIC_NAME,
    title: CLINIC_NAME,
    description: CLINIC_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: CLINIC_NAME,
    description: CLINIC_DESCRIPTION,
  },
}

export const viewport: Viewport = {
  themeColor: "#0f4c45",
  width: "device-width",
  initialScale: 1,
}

import { BookingModalProvider } from "@/context/BookingModalContext"
import { BookingModal } from "@/components/modal/BookingModal"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body>
        <BookingModalProvider>
          <LenisProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <WhatsAppFAB />
            <AiReceptionist />
            <BookingModal />
          </LenisProvider>
        </BookingModalProvider>
      </body>
    </html>
  )
}
