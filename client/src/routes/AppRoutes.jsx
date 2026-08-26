import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import StudentLayout from '../layouts/StudentLayout';
import AdminLayout from '../layouts/AdminLayout';
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
import AdminOverview from '../pages/admin/AdminOverview';
import ManageBooks from '../pages/admin/ManageBooks';
import ManageCategories from '../pages/admin/ManageCategories';
import ManageStudents from '../pages/admin/ManageStudents';
import IssueBook from '../pages/admin/IssueBook';
import ManageFines from '../pages/admin/ManageFines';
import MyRequests from '../pages/student/MyRequests';
import BookRequests from '../pages/admin/BookRequests';

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
        <Route path="requests" element={<MyRequests />} />
        <Route path="borrowed" element={<BorrowedBooks />} />
        <Route path="fines" element={<FineStatus />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="books" element={<ManageBooks />} />
        <Route path="categories" element={<ManageCategories />} />
        <Route path="students" element={<ManageStudents />} />
        <Route path="requests" element={<BookRequests />} />
        <Route path="issue" element={<IssueBook />} />
        <Route path="fines" element={<ManageFines />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;