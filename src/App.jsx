// src/App.jsx
import { Route, Routes } from "react-router-dom";

import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminProfile from "@/components/admin/profile/AdminProfile";
import UserManagement from "@/components/admin/users/UserManagement";
import ProtectedRoute from "@/components/common/ProtectedRoute.jsx";
import HomePage from "@/components/home/HomePage";
import PublicLayout from "@/components/layout/PublicLayout.jsx";
import { LearnerDashboard } from "@/components/learner/LearnerDashboard.jsx";
import ForbiddenPage from "@/exceptions/ForbiddenPage.jsx";
import InternalError from "@/exceptions/InternalError.jsx";
import PageNotFound from "@/exceptions/PageNotFound.jsx";
import { ROUTES } from "@/utils/routes";
import { Container } from "react-bootstrap";
import AdminActivities from "./components/admin/activities/AdminActivities";
import HelpPage from "./components/admin/Help/HelpPage";
import NotificationPage from "./components/admin/notifications/NotificationPage";
import AdminDashboardOverview from "./components/admin/overview/AdminDashboardOverview";
import Login from "./components/auth/Login";
import Layout from "./components/common/Layout";
import FacilitatorProgramView from "./components/facilitator/view/FacilitatorProgramView";
import InternPage from "./components/intern/InternPage";
import MentorPage from "./components/mentor/MentorPage";
import MentorLearnerView from "./components/mentor/view/MentorLearnerView";
import MentorProgramView from "./components/mentor/view/MentorProgramView";
import ModeratorLearnerView from "./components/moderator/view/ModeratorLearnerView";
import ModeratorProgramView from "./components/moderator/view/ModeratorProgramView";
import ProgramAnalyticsPage from "./components/program_manager/analysis/ProgramAnalyticsPage";
import ProgramManagement from "./components/program_manager/ProgramManagement";
import ProgramView from "./components/program_manager/view/ProgramView";
import StaffDashboard from "./components/staff/StaffDashboard";
import ProgramLayout from "./components/program_manager/layout/ProgramLayout";
import ProgramManagementOverview from "./components/program_manager/overview/ProgramManagementOverview";
import ProgramManagerProfile from "./components/program_manager/profile/ProgramManagerProfile";
import ProfilePage from "./components/common/ProfilePage";
import  CourseViewPage  from "./components/learner/course_view/CourseViewPage";

export default function App() {

  return (
    <Container fluid className="p-0">
      <Routes>
        <Route path="/" element={<PublicLayout />} >
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path={ROUTES.UNAUTHORIZED} element={<ForbiddenPage />} />
          <Route path={ROUTES.NOT_FOUND} element={<PageNotFound />} />
          <Route path={ROUTES.INTERNAL_ERROR} element={<InternalError />} />
          {/*<Route path="*" element={<Navigate to={ROUTES.NOT_FOUND} replace />} />*/}
        </Route>

        <Route
          path={ROUTES.LEARNER}
          element={
            <ProtectedRoute role="LEARNER">
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<LearnerDashboard />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="course-view/:id" element={<CourseViewPage />} >
            <Route index element={<CourseContentPage />} />
             
            
            <Route path="assessment" element={<CourseAssessmentPage/>} />
            <Route path="discussion" element={<CourseDiscussionPage/>} />
          </Route>
        </Route>

        <Route path={ROUTES.FACILITATOR} element={
          <ProtectedRoute role="FACILITATOR">
            <Layout />
          </ProtectedRoute>
        } >

          <Route index element={<StaffDashboard />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="program-view/:id" element={<FacilitatorProgramView />} />
        </Route>

        <Route path={ROUTES.ACCESSOR} element={
          <ProtectedRoute role="ASSESSOR">
            <Layout />
          </ProtectedRoute>
        }>

          <Route index element={<StaffDashboard />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route path={ROUTES.INTERN} element={
          <ProtectedRoute role="INTERN">
            <InternPage />
          </ProtectedRoute>
        } >

          <Route index element={<InternPage />} />
        </Route>

        <Route path={ROUTES.MODERATOR} element={
          <ProtectedRoute role="MODERATOR">
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<StaffDashboard />} />
          <Route path="program-view/:id" element={<ModeratorProgramView />} />
          <Route path="learner/:learnerId" element={<ModeratorLearnerView />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route path={ROUTES.MENTOR} element={
          <ProtectedRoute role="MENTOR">
            <Layout />
          </ProtectedRoute>
        } >

          <Route index element={<MentorPage />} />
          <Route path="program-view/:id" element={<MentorProgramView />} />
          <Route path="intern-view/:internId" element={<MentorLearnerView />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route path={ROUTES.PROGRAM_MANGER} element={
          <ProtectedRoute role="PROGRAM_MANAGER">
            <ProgramLayout />
          </ProtectedRoute>
        }>
          <Route index element={<ProgramManagementOverview />} />
          <Route path="programs" element={<ProgramManagement />} />
          <Route path="programs/:id" element={<ProgramView />} />
          <Route path="program/analytics/:id" element={<ProgramAnalyticsPage />} />
          <Route path="profile" element={<ProgramManagerProfile />} />
        </Route>

        <Route path={ROUTES.ADMIN} element={
          <ProtectedRoute role="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboardOverview />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="settings" element={<AdminProfile />} />
          <Route path="activities" element={<AdminActivities />} />
          <Route path="notifications" element={<NotificationPage />} />
          <Route path="help" element={<HelpPage />} />
        </Route>

      </Routes>
    </Container>
  );
}


