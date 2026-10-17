import { Geist_Mono, Manrope } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
})
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata = {
  title: "ScopeGuard — The AI Statement of Work & Scope-Creep Protector",
  description: "Convert messy client notes into binding, legally defensive Statements of Work with explicit out-of-scope protection.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={cn("light antialiased", fontMono.variable, "font-sans", manrope.variable)}
    >
      <body className="min-h-screen bg-background text-foreground selection:bg-[#5D5FEF]/20 selection:text-[#1B1C31]">
        {children}
      </body>
    </html>
  )
}
