import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CourseManagementPage from './pages/CourseManagementPage';
import PaymentPortalPage from './pages/PaymentPortalPage';
import DocumentRepositoryPage from './pages/DocumentRepositoryPage';
import StudentSignUpPage from './pages/StudentSignUpPage';
import LecturerSignUpPage from './pages/LecturerSignUpPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
        <Route path="/courses" element={<Layout><CourseManagementPage /></Layout>} />
        <Route path="/payments" element={<Layout><PaymentPortalPage /></Layout>} />
        <Route path="/documents" element={<Layout><DocumentRepositoryPage /></Layout>} />
        <Route path="/admin/signup-student" element={<Layout><StudentSignUpPage /></Layout>} />
        <Route path="/admin/signup-lecturer" element={<Layout><LecturerSignUpPage /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
