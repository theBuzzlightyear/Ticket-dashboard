"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Users, Mail, Send } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function TeamPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [subject, setSubject] = useState("QA Review Update")
  const [message, setMessage] = useState("")
  const [selectedMembers, setSelectedMembers] = useState<string[]>(["user1", "user2"])
  const [notificationType, setNotificationType] = useState("email")
  const [includeReport, setIncludeReport] = useState(true)
  const [loading, setLoading] = useState(false)

  // Mock team members data
  const teamMembers = [
    {
      id: "user1",
      name: "John Doe",
      email: "john@example.com",
      role: "QA Lead",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "user2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "QA Analyst",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "user3",
      name: "Alex Johnson",
      email: "alex@example.com",
      role: "Tour Manager",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "user4",
      name: "Sarah Williams",
      email: "sarah@example.com",
      role: "Content Reviewer",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "user5",
      name: "Michael Brown",
      email: "michael@example.com",
      role: "Developer",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const handleSendNotification = async () => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      })
      return
    }

    if (selectedMembers.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one team member",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)

      // Simulate API call to send notification
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Notification sent",
        description: `Notification sent to ${selectedMembers.length} team members`,
      })

      // Reset form
      setMessage("")
    } catch (err) {
      console.error("Failed to send notification:", err)
      toast({
        title: "Error",
        description: "Failed to send notification. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleMember = (memberId: string) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== memberId))
    } else {
      setSelectedMembers([...selectedMembers, memberId])
    }
  }

  const selectAll = () => {
    setSelectedMembers(teamMembers.map((member) => member.id))
  }

  const selectNone = () => {
    setSelectedMembers([])
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Notify Team</h1>
          <p className="text-muted-foreground">Send notifications to team members about QA updates</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Compose Notification</CardTitle>
                <CardDescription>Create a message to send to team members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Notification subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Enter your message here"
                      className="min-h-[150px]"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="notification-type">Notification Type</Label>
                      <Select value={notificationType} onValueChange={setNotificationType}>
                        <SelectTrigger id="notification-type">
                          <SelectValue placeholder="Select notification type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="slack">Slack</SelectItem>
                          <SelectItem value="both">Both Email & Slack</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select defaultValue="normal">
                        <SelectTrigger id="priority">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-report"
                      checked={includeReport}
                      onCheckedChange={(checked) => setIncludeReport(checked as boolean)}
                    />
                    <Label htmlFor="include-report">Include latest QA report</Label>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => router.push("/")}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSendNotification}
                      disabled={loading || !message.trim() || selectedMembers.length === 0}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Notification
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Team Members
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={selectAll}>
                      Select All
                    </Button>
                    <Button variant="outline" size="sm" onClick={selectNone}>
                      Clear
                    </Button>
                  </div>
                </div>
                <CardDescription>Select team members to notify</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted">
                      <Checkbox
                        id={`member-${member.id}`}
                        checked={selectedMembers.includes(member.id)}
                        onCheckedChange={() => toggleMember(member.id)}
                      />
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{member.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>History of notifications sent to the team</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Sent By</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>May 3, 2025</TableCell>
                  <TableCell>Weekly QA Report</TableCell>
                  <TableCell>John Doe</TableCell>
                  <TableCell>All Team (5)</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      Email
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>May 1, 2025</TableCell>
                  <TableCell>Urgent: Paris Tour Issues</TableCell>
                  <TableCell>Jane Smith</TableCell>
                  <TableCell>Tour Managers (2)</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      Email
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Apr 28, 2025</TableCell>
                  <TableCell>New QA Process Update</TableCell>
                  <TableCell>Alex Johnson</TableCell>
                  <TableCell>All Team (5)</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      Email
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
