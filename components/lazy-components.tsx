// Lazy-loaded components for code splitting
import { lazy } from "react"

// Admin components
export const AdminDashboard = lazy(() =>
  import("@/components/admin-dashboard").then((module) => ({ default: module.AdminDashboard })),
)
export const CandidateManagement = lazy(() =>
  import("@/components/admin/candidate-management").then((module) => ({ default: module.CandidateManagement })),
)
export const UserManagement = lazy(() =>
  import("@/components/admin/user-management").then((module) => ({ default: module.UserManagement })),
)
export const LiveMonitoring = lazy(() =>
  import("@/components/admin/live-monitoring").then((module) => ({ default: module.LiveMonitoring })),
)
export const ReportsSection = lazy(() =>
  import("@/components/admin/reports-section").then((module) => ({ default: module.ReportsSection })),
)

// Voting components
export const VotingInterface = lazy(() =>
  import("@/components/voting-interface").then((module) => ({ default: module.VotingInterface })),
)
export const ResultsView = lazy(() =>
  import("@/components/results-view").then((module) => ({ default: module.ResultsView })),
)

// Dashboard components
export const PostsList = lazy(() => import("@/components/posts-list").then((module) => ({ default: module.PostsList })))
export const ElectionCountdown = lazy(() =>
  import("@/components/election-countdown").then((module) => ({ default: module.ElectionCountdown })),
)
