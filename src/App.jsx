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
import ProfilePage from "./components/common/ProfilePage";
import FacilitatorProgramView from "./components/facilitator/view/FacilitatorProgramView";
import InternPage from "./components/intern/InternPage";
import CourseAnnouncementPage from "./components/learner/anouncement/CourseAnnouncementPage";
import AssessmentDetailPage from "./components/learner/assessment/AssessmentDetailPage";
import AssessmentPage from "./components/learner/assessment/AssessmentPage";
import ContentPage from "./components/learner/content/ContentPage";
import PreviewPage from "./components/learner/content/preview/PreviewPage";
import { CourseViewPage } from "./components/learner/course_view/CourseViewPage";
import DiscussionPage from "./components/learner/discussion/DiscussionPage";
import MentorPage from "./components/mentor/MentorPage";
import InternsList from "./components/mentor/view/InternsList";
import MentorProgramView from "./components/mentor/view/MentorProgramView";
import ModeratorLearnerView from "./components/moderator/view/ModeratorLearnerView";
import ModeratorProgramView from "./components/moderator/view/ModeratorProgramView";
import ProgramAnalyticsPage from "./components/program_manager/analysis/ProgramAnalyticsPage";
import ProgramLayout from "./components/program_manager/layout/ProgramLayout";
import ProgramManagementOverview from "./components/program_manager/overview/ProgramManagementOverview";
import ProgramManagerProfile from "./components/program_manager/profile/ProgramManagerProfile";
import ProgramManagement from "./components/program_manager/ProgramManagement";
import ProgramView from "./components/program_manager/view/ProgramView";
import StaffDashboard from "./components/staff/StaffDashboard";
import InternReports from "./components/mentor/view/InternReports";
import ProgramOverview from "./components/mentor/overview/ProgramOverview";
import ProgramForm from "./components/program_manager/program_form/ProgramForm";
import UserFormPage from "./components/admin/users/UserFormModal";
import UserProfilePage from "./components/admin/users/UserProfilePage";
import BulkUploadPage from "./components/admin/users/BulkUploadModal";
import InternOverview from "./components/intern/overview/InternOverview";
import InternReportPage from "./components/intern/reports/InternReportPage";
import FacilitatorProgramOverview from "./components/facilitator/overview/FacilitatorProgramOverview";
import ProgramResources from "./components/facilitator/program_resources/ProgramResources";
import UnitStandardsPage from "./components/facilitator/unit-standard/UnitStandardPage";
import UnitStandardFormPage from "./components/facilitator/unit-standard/UnitStandardFormPage";
import EnrolledLearnerView from "./components/facilitator/enronlled_learners_view/EnrolledLearnerView";

export default function App() {

  return (
    <Container fluid className="p-0">
      <Routes>
        {/*ADMIN ROUTES */}
        <Route path={ROUTES.ADMIN} element={
          <ProtectedRoute role="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboardOverview />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="users/new" element={<UserFormPage />} />
          <Route path="users/new/bulk" element={<BulkUploadPage />} />
          <Route path="users/:id/edit" element={<UserFormPage />} />
          <Route path="users/:id" element={<UserProfilePage />} />
          <Route path="settings" element={<AdminProfile />} />
          <Route path="activities" element={<AdminActivities />} />
          <Route path="notifications" element={<NotificationPage />} />
          <Route path="help" element={<HelpPage />} />
        </Route>

        {/*PROGRAM MANEGR ROUTES */}
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
          <Route path="programs/new" element={<ProgramForm />} />
          <Route path="programs/:id/edit" element={<ProgramForm />} />
        </Route>

        {/*MODERATOR ROUTES */}
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

        {/*ASSESSOR ROUTES */}
        <Route path={ROUTES.ACCESSOR} element={
          <ProtectedRoute role="ASSESSOR">
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<StaffDashboard />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/*FACILITATOR ROUTES */}
        <Route path={ROUTES.FACILITATOR} element={
          <ProtectedRoute role="FACILITATOR">
            <Layout />
          </ProtectedRoute>
        } >

          <Route index element={<StaffDashboard />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="program-view/:programId" element={<FacilitatorProgramView />} >
            <Route index element={<FacilitatorProgramOverview />} />
            <Route path="content" element={<ProgramResources />} />
            <Route path="unit-standards" element={<UnitStandardsPage />}/>
            <Route path="unit-standards/new" element={<UnitStandardFormPage />}/>
            <Route path="unit-standards/:id/edit" element={<UnitStandardFormPage />}/>
            <Route path="learners" element={<EnrolledLearnerView />}/>
          </Route>
        </Route>

        {/*MENTOR ROUTES */}
        <Route path={ROUTES.MENTOR} element={
          <ProtectedRoute role="MENTOR">
            <Layout />
          </ProtectedRoute>
        } >

          <Route index element={<MentorPage />} />
          <Route path="program-view/:programId" element={<MentorProgramView />} >
            <Route index element={<ProgramOverview />} />
            <Route path='interns' element={<InternsList />} />
            <Route path="interns/:internId" element={<InternReports />} />
          </Route>
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/*INTERN ROUTES */}
        <Route path={ROUTES.INTERN} element={
          <ProtectedRoute role="INTERN">
            <InternPage />
          </ProtectedRoute>
        } >
          <Route index element={<InternOverview />} />
          <Route path="reports" element={<InternReportPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/*LEARNER ROUTES */}
        <Route path={ROUTES.LEARNER}
          element={
            <ProtectedRoute role="LEARNER">
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<LearnerDashboard />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="course-view/:id" element={<CourseViewPage />} >

            <Route index element={<CourseAnnouncementPage />} />
            <Route path="content" element={<ContentPage />} />
            <Route path="content/preview/:name" element={<PreviewPage />} />
            <Route path="assessment" element={<AssessmentPage />} />
            <Route path="assessment/:title" element={<AssessmentDetailPage />} />
            <Route path="discussion" element={<DiscussionPage />} />

          </Route>
        </Route>


        {/*PUBLIC ROUTES */}
        <Route path="/" element={<PublicLayout />} >
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path={ROUTES.UNAUTHORIZED} element={<ForbiddenPage />} />
          <Route path={ROUTES.NOT_FOUND} element={<PageNotFound />} />
          <Route path={ROUTES.INTERNAL_ERROR} element={<InternalError />} />
          {/*<Route path="*" element={<Navigate to={ROUTES.NOT_FOUND} replace />} />*/}
        </Route>

      </Routes>
    </Container>
  );
}


