"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminHeader } from "@/components/admin-header"
import { UserManagement } from "@/components/admin/user-management"
import { LiveMonitoring } from "@/components/admin/live-monitoring"
import { ReportsSection } from "@/components/admin/reports-section"
import { DatabaseInitializer } from "@/components/admin/database-initializer"
import { CandidateManagementFixed as CandidateManagement } from "@/components/admin/candidate-management-fixed"

export function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage elections, candidates, and monitor voting progress</p>
        </div>

        <Tabs defaultValue="monitoring" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="monitoring">Live Monitoring</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="monitoring">
            <LiveMonitoring />
          </TabsContent>

          <TabsContent value="database">
            <DatabaseInitializer />
          </TabsContent>

          <TabsContent value="candidates">
            <CandidateManagement />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsSection />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
