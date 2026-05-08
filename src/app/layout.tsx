import type { Metadata } from "next"
import "./globals.css"
import { Navigation } from "./navigation"

export const metadata: Metadata = {
  title: "Eureka Space",
  description:
    "Eureka Space — E16連星系の人類史と宇宙探査の百科プロジェクト",
  icons: { icon: "/favicon.ico" },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" suppressHydrationWarning className="dark">
      <body className="antialiased bg-background text-foreground">
        <Navigation />
        {children}
      </body>
    </html>
  )
}
