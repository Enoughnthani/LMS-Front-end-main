// src/App.jsx
import { Navigate, Route, Routes } from "react-router-dom";

import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminProfile from "@/components/admin/profile/AdminProfile";
import ProgramManagement from "@/components/admin/programs/ProgramManagement";
import UserManagement from "@/components/admin/users/UserManagement";
import ProtectedRoute from "@/components/common/ProtectedRoute.jsx";
import HomePage from "@/components/home/HomePage";
import PublicLayout from "@/components/layout/PublicLayout.jsx";
import { LearnerDashboard } from "@/components/learner/LearnerDashboard.jsx";
import { ROUTES } from "@/utils/routes";
import ForbiddenPage from "@/exceptions/ForbiddenPage.jsx";
import InternalError from "@/exceptions/InternalError.jsx";
import PageNotFound from "@/exceptions/PageNotFound.jsx";
import { Container } from "react-bootstrap";
import AdminDashboardOverview from "./components/admin/overview/AdminDashboardOverview";
import AssessorPage from "./components/assessor/AssessorPage";
import FacilitatorPage from "./components/facilitator/FacilitatorPage";
import InternPage from "./components/intern/InternPage";
import MentorPage from "./components/mentor/MentorPage";
import ModeratorPage from "./components/moderator/ModeratorPage";
import AuthLayout from "./components/auth/AuthLayout";
import Login from "./components/auth/Login";
import Register from "./components/auth/register";
import ProgramView from "./components/admin/programs/ProgramView";
import ProgramLayout from "./components/admin/programs/ProgramLayout";

export default function App() {

  return (
    <Container fluid className="p-0">
      <Routes>
        <Route path="/" element={<PublicLayout />} >
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path={ROUTES.UNAUTHORIZED} element={<ForbiddenPage />} />
          <Route path={ROUTES.NOT_FOUND} element={<PageNotFound />} />
          <Route path={ROUTES.INTERNAL_ERROR} element={<InternalError />} />
          {/*<Route path="*" element={<Navigate to={ROUTES.NOT_FOUND} replace />} />*/}
        </Route>



        <Route
          path={ROUTES.LEARNER}
          element={
            <ProtectedRoute role="LEARNER">
              <LearnerDashboard />
            </ProtectedRoute>
          }
        />

        <Route path={ROUTES.FACILITATOR} element={
          <ProtectedRoute role="FACILITATOR">
            <FacilitatorPage />
          </ProtectedRoute>
        } />

        <Route path={ROUTES.ACCESSOR} element={
          <ProtectedRoute role="ASSESSOR">
            <AssessorPage />
          </ProtectedRoute>
        } />

        <Route path={ROUTES.INTERN} element={
          <ProtectedRoute role="INTERN">
            <InternPage />
          </ProtectedRoute>
        } />

        <Route path={ROUTES.MODERATOR} element={
          <ProtectedRoute role="MODERATOR">
            <ModeratorPage />
          </ProtectedRoute>
        } />

        <Route path={ROUTES.MENTOR} element={
          <ProtectedRoute role="MENTOR">
            <MentorPage />
          </ProtectedRoute>
        } />

        <Route path={ROUTES.ADMIN} element={
          <ProtectedRoute role="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboardOverview />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="programs" element={<ProgramLayout />}>
            <Route index element={<ProgramManagement />} />
            <Route path=":id" element={<ProgramView />} />
          </Route>
          <Route path="settings" element={<AdminProfile />} />
        </Route>

      </Routes>
    </Container>
  );
}


