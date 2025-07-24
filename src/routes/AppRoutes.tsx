import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import AdminDashboard from "../pages/AdminDashboard";
import UserDashboard from "../pages/UserDashboard";
import UserHistory from "../pages/UserHistory";
import QuizPage from "../pages/QuizPage";
import ResultsPage from "../pages/ResultsPage";
import Register from "../pages/Register";
import BadgeManager from "../pages/BadgeManager";
import QuizManager from "../pages/QuizManager";
import ManageUsers from "../pages/ManageUsers";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Privacy from "../pages/Privacy";
import Terms from "../pages/Terms";
import ProfilePage from "../pages/ProfilePage";
import UserStats from "../pages/AdminUserStats";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      
      {/* Admin Routes - Protected */}
      <Route 
        path="/badges" 
        element={
          <ProtectedRoute requireAuth={true} requireAdmin={true} redirectTo="/">
            <BadgeManager />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/quizzes" 
        element={
          <ProtectedRoute requireAuth={true} requireAdmin={true} redirectTo="/">
            <QuizManager />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requireAuth={true} requireAdmin={true} redirectTo="/">
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/user-stats" 
        element={
          <ProtectedRoute requireAuth={true} requireAdmin={true} redirectTo="/">
            <UserStats />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/users" 
        element={
          <ProtectedRoute requireAuth={true} requireAdmin={true} redirectTo="/">
            <ManageUsers />
          </ProtectedRoute>
        } 
      />
      
      {/* User Routes - Protected */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute requireAuth={true} requireAdmin={false} redirectTo="/">
            <UserDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/history" 
        element={
          <ProtectedRoute requireAuth={true} requireAdmin={false} redirectTo="/">
            <UserHistory />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute requireAuth={true} requireAdmin={false} redirectTo="/">
            <ProfilePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/quiz/:quizId" 
        element={
          <ProtectedRoute requireAuth={true} requireAdmin={false} redirectTo="/">
            <QuizPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/results/:quizId" 
        element={
          <ProtectedRoute requireAuth={true} requireAdmin={false} redirectTo="/">
            <ResultsPage />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}
