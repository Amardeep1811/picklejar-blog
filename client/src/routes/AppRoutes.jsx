import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import VerticalPage from '../pages/VerticalPage';
import PostPage from '../pages/PostPage';
import SearchPage from '../pages/SearchPage';
import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManagePosts from '../pages/admin/ManagePosts';
import ManageVerticals from '../pages/admin/ManageVerticals';
import ManagePetitions from '../pages/admin/ManagePetitions';
import ManageAds from '../pages/admin/ManageAds';
import ManageUsers from '../pages/admin/ManageUsers';
import ProtectedRoute from './ProtectedRoute';
import PublicLayout from '../components/layout/PublicLayout';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/:verticalSlug" element={<VerticalPage />} />
        <Route path="/:verticalSlug/:postSlug" element={<PostPage />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/posts" element={<ProtectedRoute><ManagePosts /></ProtectedRoute>} />
      <Route path="/admin/verticals" element={<ProtectedRoute><ManageVerticals /></ProtectedRoute>} />
      <Route path="/admin/petitions" element={<ProtectedRoute><ManagePetitions /></ProtectedRoute>} />
      <Route path="/admin/ads" element={<ProtectedRoute><ManageAds /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute><ManageUsers /></ProtectedRoute>} />
    </Routes>
  );
}