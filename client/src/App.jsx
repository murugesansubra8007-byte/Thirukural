import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, RequireAdmin } from './context/AuthContext';
import { Layout, KolamStrip, ScrollToTop, EmptyState } from './components';
import Seo from './seo';

import Home from './pages/Home';
import Chapters from './pages/Chapters';
import ChapterDetail from './pages/ChapterDetail';
import KuralDetail from './pages/KuralDetail';
import Explore from './pages/Explore';
import Today from './pages/Today';
import { Categories as CategoriesPage, CategoryDetail } from './pages/Categories';
import Learn from './pages/Learn';
import LearnDeep from './pages/LearnDeep';
import AboutValluvar from './pages/AboutValluvar';
import Quiz from './pages/Quiz';
import Favorites from './pages/Favorites';
import PaalDetail from './pages/PaalDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Methodology from './pages/Methodology';

import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminKurals from './pages/admin/AdminKurals';
import AdminChapters from './pages/admin/AdminChapters';
import AdminCategories from './pages/admin/AdminCategories';
import AdminUsers from './pages/admin/AdminUsers';
import AdminQuiz from './pages/admin/AdminQuiz';
import AdminSettings from './pages/admin/AdminSettings';

function PublicLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

function AdminShell() {
  return (
    <RequireAdmin>
      <AdminLayout />
    </RequireAdmin>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/chapters" element={<Chapters />} />
            <Route path="/chapters/:number" element={<ChapterDetail />} />
            <Route path="/kural/:number" element={<KuralDetail />} />
            <Route path="/today" element={<Today />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:slug" element={<CategoryDetail />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/learn/:section" element={<LearnDeep />} />
            <Route path="/about-valluvar" element={<AboutValluvar />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/paal/:key" element={<PaalDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/methodology" element={<Methodology />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminShell />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="kurals" element={<AdminKurals />} />
            <Route path="chapters" element={<AdminChapters />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="quiz" element={<AdminQuiz />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <div className="container section">
      <Seo title="பக்கம் கிடைக்கவில்லை | குறளகம்" description="" canonical="https://thirukural.heymovox.com/" noIndex />
      <EmptyState icon="flower" title="இந்தப் பக்கம் கிடைக்கவில்லை" note="404 — முகப்பிற்குத் திரும்புக.">
        <a href="/" className="btn btn-primary">முகப்பு →</a>
      </EmptyState>
    </div>
  );
}