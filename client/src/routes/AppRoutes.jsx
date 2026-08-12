import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import VerticalPage from '../pages/VerticalPage';
import PostPage from '../pages/PostPage';
import SearchPage from '../pages/SearchPage';
import ProtectedRoute from './ProtectedRoute';
import PublicLayout from '../components/layout/PublicLayout';

const AdminLogin = lazy(() => import('../pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const ManagePosts = lazy(() => import('../pages/admin/ManagePosts'));
const ManageVerticals = lazy(() => import('../pages/admin/ManageVerticals'));
const ManagePetitions = lazy(() => import('../pages/admin/ManagePetitions'));
const ManageAds = lazy(() => import('../pages/admin/ManageAds'));
const ManagePostAds = lazy(() => import('../pages/admin/ManagePostAds'));
const ManageUsers = lazy(() => import('../pages/admin/ManageUsers'));
const ForgotPassword = lazy(() => import('../pages/admin/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/admin/ResetPassword'));

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/:verticalSlug" element={<VerticalPage />} />
        <Route path="/:verticalSlug/:postSlug" element={<PostPage />} />
      </Route>

      <Route path="/admin/login" element={<Suspense fallback={<div>Loading...</div>}><AdminLogin /></Suspense>} />
      <Route path="/admin/forgot-password" element={<Suspense fallback={<div>Loading...</div>}><ForgotPassword /></Suspense>} />
      <Route path="/admin/reset-password/:token" element={<Suspense fallback={<div>Loading...</div>}><ResetPassword /></Suspense>} />
      
      <Route path="/admin/dashboard" element={<ProtectedRoute><Suspense fallback={<div>Loading...</div>}><AdminDashboard /></Suspense></ProtectedRoute>} />
      <Route path="/admin/posts" element={<ProtectedRoute><Suspense fallback={<div>Loading...</div>}><ManagePosts /></Suspense></ProtectedRoute>} />
      <Route path="/admin/verticals" element={<ProtectedRoute><Suspense fallback={<div>Loading...</div>}><ManageVerticals /></Suspense></ProtectedRoute>} />
      <Route path="/admin/petitions" element={<ProtectedRoute><Suspense fallback={<div>Loading...</div>}><ManagePetitions /></Suspense></ProtectedRoute>} />
      <Route path="/admin/ads" element={<ProtectedRoute><Suspense fallback={<div>Loading...</div>}><ManageAds /></Suspense></ProtectedRoute>} />
      <Route path="/admin/post-ads" element={<ProtectedRoute><Suspense fallback={<div>Loading...</div>}><ManagePostAds /></Suspense></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute><Suspense fallback={<div>Loading...</div>}><ManageUsers /></Suspense></ProtectedRoute>} />
    </Routes>
  );
}