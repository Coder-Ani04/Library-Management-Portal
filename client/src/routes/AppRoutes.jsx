import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import StudentLayout from '../layouts/StudentLayout';
import Home from '../pages/Home';
import About from '../pages/About';
import Features from '../pages/Features';
import Contact from '../pages/Contact';
import Login from '../pages/Login';
import Register from '../pages/Register';
import NotFound from '../pages/NotFound';
import ProtectedRoute from '../components/ProtectedRoute';
import StudentOverview from '../pages/student/StudentOverview';
import SearchBooks from '../pages/student/SearchBooks';
import BorrowedBooks from '../pages/student/BorrowedBooks';
import FineStatus from '../pages/student/FineStatus';
import StudentProfile from '../pages/student/StudentProfile';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Student dashboard — nested routes share StudentLayout's sidebar/header */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentOverview />} />
        <Route path="books" element={<SearchBooks />} />
        <Route path="borrowed" element={<BorrowedBooks />} />
        <Route path="fines" element={<FineStatus />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>

      {/* Admin dashboard placeholder — built in Module 10 */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <div className="text-white text-center py-20">Admin Dashboard (coming in Module 10)</div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;