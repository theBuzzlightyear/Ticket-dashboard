"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle, X } from "lucide-react"

interface NotificationCenterProps {
  onClose: () => void
}

// Mock notification data
const notifications = [
  {
    id: 1,
    title: "New ticket assigned",
    description: "You have been assigned a new ticket #1234",
    time: "5 minutes ago",
    read: false,
    type: "ticket",
  },
  {
    id: 2,
    title: "QA review completed",
    description: "Tour 'Paris City Tour' has been fully reviewed",
    time: "1 hour ago",
    read: true,
    type: "review",
  },
  {
    id: 3,
    title: "Comment on field",
    description: "John added a comment on 'Entry Fee' field",
    time: "3 hours ago",
    read: false,
    type: "comment",
  },
  {
    id: 4,
    title: "Error report generated",
    description: "Weekly error report is now available",
    time: "1 day ago",
    read: true,
    type: "report",
  },
]

export function NotificationCenter({ onClose }: NotificationCenterProps) {
  const [activeTab, setActiveTab] = useState("all")
  const [notificationList, setNotificationList] = useState(notifications)

  const filteredNotifications = notificationList.filter((notification) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.read
    return notification.type === activeTab
  })

  const unreadCount = notificationList.filter((n) => !n.read).length

  const markAllAsRead = () => {
    setNotificationList(notificationList.map((n) => ({ ...n, read: true })))
  }

  const markAsRead = (id: number) => {
    setNotificationList(notificationList.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  return (
    <Card className="w-full mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <Bell className="mr-2 h-5 w-5" />
          <CardTitle>Notifications</CardTitle>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {unreadCount} unread
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            Mark all as read
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="ticket">Tickets</TabsTrigger>
            <TabsTrigger value="comment">Comments</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {filteredNotifications.length > 0 ? (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start justify-between p-3 rounded-lg border ${
                      notification.read ? "bg-background" : "bg-muted/30"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        {!notification.read && <span className="ml-2 h-2 w-2 rounded-full bg-blue-500"></span>}
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.description}</p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="h-8 w-8 p-0"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span className="sr-only">Mark as read</span>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">No notifications found</div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
