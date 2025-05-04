"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Loader2, FileText, Download, Calendar } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ErrorSummary } from "@/components/error-summary"

export default function ReportsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [reportType, setReportType] = useState("qa-summary")
  const [dateRange, setDateRange] = useState("last-week")
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeRawData, setIncludeRawData] = useState(false)
  const [recipients, setRecipients] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("generate")

  const handleGenerateReport = async () => {
    try {
      setLoading(true)

      // Simulate API call to generate report
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Report generated",
        description: "Your report has been generated successfully.",
      })

      setActiveTab("preview")
    } catch (err) {
      console.error("Failed to generate report:", err)
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSendReport = async () => {
    if (!recipients.trim()) {
      toast({
        title: "Error",
        description: "Please enter at least one recipient email",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)

      // Simulate API call to send report
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Report sent",
        description: "Your report has been sent successfully.",
      })
    } catch (err) {
      console.error("Failed to send report:", err)
      toast({
        title: "Error",
        description: "Failed to send report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadReport = () => {
    toast({
      title: "Downloading report",
      description: "Your report is being downloaded.",
    })
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Generate Reports</h1>
          <p className="text-muted-foreground">Create and share QA reports</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="generate">Generate Report</TabsTrigger>
            <TabsTrigger value="preview">Preview Report</TabsTrigger>
            <TabsTrigger value="history">Report History</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Report Configuration</CardTitle>
                <CardDescription>Configure your report settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="report-type">Report Type</Label>
                      <Select value={reportType} onValueChange={setReportType}>
                        <SelectTrigger id="report-type">
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="qa-summary">QA Summary Report</SelectItem>
                          <SelectItem value="error-analysis">Error Analysis Report</SelectItem>
                          <SelectItem value="tour-performance">Tour Performance Report</SelectItem>
                          <SelectItem value="team-productivity">Team Productivity Report</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="date-range">Date Range</Label>
                      <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger id="date-range">
                          <SelectValue placeholder="Select date range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="yesterday">Yesterday</SelectItem>
                          <SelectItem value="last-week">Last 7 days</SelectItem>
                          <SelectItem value="last-month">Last 30 days</SelectItem>
                          <SelectItem value="custom">Custom Range</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {dateRange === "custom" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="start-date">Start Date</Label>
                        <Input id="start-date" type="date" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="end-date">End Date</Label>
                        <Input id="end-date" type="date" />
                      </div>
                    </div>
                  )}

                  <div className="grid gap-2">
                    <Label>Report Options</Label>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="include-charts"
                          checked={includeCharts}
                          onCheckedChange={(checked) => setIncludeCharts(checked as boolean)}
                        />
                        <Label htmlFor="include-charts">Include charts and visualizations</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="include-raw-data"
                          checked={includeRawData}
                          onCheckedChange={(checked) => setIncludeRawData(checked as boolean)}
                        />
                        <Label htmlFor="include-raw-data">Include raw data tables</Label>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="recipients">Recipients (Optional)</Label>
                    <Input
                      id="recipients"
                      placeholder="email@example.com, email2@example.com"
                      value={recipients}
                      onChange={(e) => setRecipients(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">Leave blank to generate without sending</p>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => router.push("/")}>
                      Cancel
                    </Button>
                    <Button onClick={handleGenerateReport} disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4 mr-2" />
                          Generate Report
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Report Preview</CardTitle>
                  <CardDescription>QA Summary Report - Last 7 days</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleDownloadReport}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  {recipients ? (
                    <Button onClick={handleSendReport} disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Report"
                      )}
                    </Button>
                  ) : null}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h2 className="text-xl font-semibold mb-2">QA Summary Report</h2>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Apr 28, 2025 - May 4, 2025</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-600">85%</div>
                          <p className="text-sm text-muted-foreground">Correct Fields</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-red-600">8%</div>
                          <p className="text-sm text-muted-foreground">Incorrect Fields</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-amber-600">7%</div>
                          <p className="text-sm text-muted-foreground">Fixed by QA</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <ErrorSummary />

                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold mb-2">Team Performance</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Team Member</TableHead>
                          <TableHead>Fields Reviewed</TableHead>
                          <TableHead>Issues Fixed</TableHead>
                          <TableHead>Accuracy</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>John Doe</TableCell>
                          <TableCell>124</TableCell>
                          <TableCell>18</TableCell>
                          <TableCell>92%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Jane Smith</TableCell>
                          <TableCell>98</TableCell>
                          <TableCell>12</TableCell>
                          <TableCell>89%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Alex Johnson</TableCell>
                          <TableCell>76</TableCell>
                          <TableCell>9</TableCell>
                          <TableCell>87%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Report History</CardTitle>
                <CardDescription>Previously generated reports</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Report Type</TableHead>
                      <TableHead>Generated By</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>May 4, 2025</TableCell>
                      <TableCell>QA Summary Report</TableCell>
                      <TableCell>John Doe</TableCell>
                      <TableCell>3 recipients</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Apr 27, 2025</TableCell>
                      <TableCell>Error Analysis Report</TableCell>
                      <TableCell>Jane Smith</TableCell>
                      <TableCell>2 recipients</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Apr 20, 2025</TableCell>
                      <TableCell>Team Productivity Report</TableCell>
                      <TableCell>Alex Johnson</TableCell>
                      <TableCell>5 recipients</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
