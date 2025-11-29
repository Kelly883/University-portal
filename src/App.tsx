import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import StudentDashboard from './pages/student/Dashboard';
import LecturerDashboard from './pages/lecturer/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import PaymentManagement from './pages/admin/PaymentManagement';
import UploadResults from './pages/lecturer/UploadResults';
import CourseManagement from './pages/student/CourseManagement';
import AdminCourseManagement from './pages/admin/CourseManagement';
import AdmissionManagement from './pages/admin/AdmissionManagement';
import DocumentManagement from './pages/admin/DocumentManagement';
import PaymentPortal from './pages/student/PaymentPortal';
import DocumentRepository from './pages/student/DocumentRepository';
import AdmissionLetter from './pages/student/AdmissionLetter';
import Results from './pages/student/Results';
import MainLayout from './layouts/MainLayout';
import StudentLogin from './pages/student/Login';
import LecturerLogin from './pages/lecturer/Login';
import AdminLogin from './pages/admin/Login';
import StudentSignUp from './pages/admin/StudentSignUp';
import LecturerSignUp from './pages/admin/LecturerSignUp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/lecturer/login" element={<LecturerLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Student Routes */}
        <Route path="/student" element={<MainLayout role="student" />}>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="courses" element={<CourseManagement />} />
          <Route path="payments" element={<PaymentPortal />} />
          <Route path="documents" element={<DocumentRepository />} />
          <Route path="results" element={<Results />} />
          <Route path="admission-letter" element={<AdmissionLetter />} />
        </Route>

        {/* Lecturer Routes */}
        <Route path="/lecturer" element={<MainLayout role="lecturer" />}>
          <Route path="dashboard" element={<LecturerDashboard />} />
          <Route path="results" element={<UploadResults />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<MainLayout role="admin" />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="signup/student" element={<StudentSignUp />} />
          <Route path="signup/lecturer" element={<LecturerSignUp />} />
          <Route path="results" element={<UploadResults />} />
          <Route path="payments" element={<PaymentManagement />} />
          <Route path="courses" element={<AdminCourseManagement />} />
          <Route path="documents" element={<DocumentManagement />} />
          <Route path="admissions" element={<AdmissionManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
