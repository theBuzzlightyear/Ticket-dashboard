"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ClipboardCheck,
  BarChart3,
  Home,
  Bell,
  Settings,
  PlusCircle,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react"
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { fetchTours } from "@/lib/api"
import { NotificationCenter } from "@/components/notification-center"

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [showNotifications, setShowNotifications] = useState(false)
  const [stats, setStats] = useState({
    correct: 0,
    incorrect: 0,
    fixed: 0,
    total: 0,
  })

  useEffect(() => {
    const loadStats = async () => {
      try {
        const tours = await fetchTours()

        // Calculate stats based on tour fields
        let correct = 0
        let incorrect = 0
        let fixed = 0
        let total = 0

        tours.forEach((tour) => {
          // Simulate field statuses
          const fieldCount = 7 // Typical fields per tour
          total += fieldCount

          // Random distribution for demo
          correct += Math.floor(Math.random() * 4) + 2 // 2-5 correct fields
          incorrect += Math.floor(Math.random() * 2) + 1 // 1-2 incorrect fields
        })

        fixed = total - correct - incorrect

        setStats({
          correct,
          incorrect,
          fixed,
          total,
        })
      } catch (error) {
        console.error("Failed to load stats:", error)
      }
    }

    loadStats()
  }, [])

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-3">
          <ClipboardCheck className="h-6 w-6 text-primary" />
          <div className="font-semibold text-lg">QA Dashboard</div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/" passHref legacyBehavior>
                  <SidebarMenuButton asChild isActive={pathname === "/"}>
                    <a>
                      <Home className="h-4 w-4" />
                      <span>Dashboard</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Link href="/qa-review" passHref legacyBehavior>
                  <SidebarMenuButton asChild isActive={pathname === "/qa-review"}>
                    <a>
                      <ClipboardCheck className="h-4 w-4" />
                      <span>QA Review</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Link href="/analytics" passHref legacyBehavior>
                  <SidebarMenuButton asChild isActive={pathname === "/analytics"}>
                    <a>
                      <BarChart3 className="h-4 w-4" />
                      <span>Analytics</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Status Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Correct Fields</span>
                </SidebarMenuButton>
                <SidebarMenuBadge>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {stats.correct}
                  </Badge>
                </SidebarMenuBadge>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton>
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span>Incorrect Fields</span>
                </SidebarMenuButton>
                <SidebarMenuBadge>
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    {stats.incorrect}
                  </Badge>
                </SidebarMenuBadge>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton>
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span>Fixed by QA</span>
                </SidebarMenuButton>
                <SidebarMenuBadge>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    {stats.fixed}
                  </Badge>
                </SidebarMenuBadge>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => router.push("/create-ticket")}>
                  <PlusCircle className="h-4 w-4" />
                  <span>Create Ticket</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => router.push("/team")}>
                  <Users className="h-4 w-4" />
                  <span>Notify Team</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => router.push("/reports")}>
                  <FileText className="h-4 w-4" />
                  <span>Generate Report</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
              <AvatarFallback>QA</AvatarFallback>
            </Avatar>
            <div className="text-sm font-medium">QA Team</div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SidebarFooter>

      {showNotifications && <NotificationCenter onClose={() => setShowNotifications(false)} />}
    </>
  )
}
