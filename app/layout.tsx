import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "QA Dashboard",
  description: "Quality Assurance Dashboard for Tour Management",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <SidebarProvider defaultOpen={true}>
            <div className="flex h-screen">
              <Sidebar variant="inset" collapsible="icon">
                <DashboardSidebar />
              </Sidebar>
              <SidebarInset>
                <div className="flex flex-col min-h-screen">
                  <main className="flex-1 overflow-auto">{children}</main>
                </div>
              </SidebarInset>
            </div>
            <Toaster />
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
