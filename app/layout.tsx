import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GV Admin - Sistema de Gerenciamento",
  description: "Painel administrativo para gerenciar projetos",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GV Admin",
  },
}

export const viewport: Viewport = {
  themeColor: "#a855f7",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={geist.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
