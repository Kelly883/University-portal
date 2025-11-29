import { Link } from 'react-router-dom';

const studentLinks = [
  { path: '/student/dashboard', label: 'Dashboard' },
  { path: '/student/courses', label: 'Course Registration' },
  { path: '/student/payments', label: 'Fee Payment' },
  { path: '/student/documents', label: 'Documents' },
  { path: '/student/results', label: 'Results' },
  { path: '/student/admission-letter', label: 'Admission Letter' },
];

const lecturerLinks = [
  { path: '/lecturer/dashboard', label: 'Dashboard' },
  { path: '/lecturer/results', label: 'Upload Results' },
];

const adminLinks = [
  { path: '/admin/dashboard', label: 'Dashboard' },
  { path: '/admin/signup/student', label: 'Add Student' },
  { path: '/admin/signup/lecturer', label: 'Add Lecturer' },
  { path: '/admin/courses', label: 'Manage Courses' },
  { path: '/admin/payments', label: 'Manage Payments' },
  { path: '/admin/documents', label: 'Manage Documents' },
  { path: '/admin/admissions', label: 'Manage Admissions' },
];

const Sidebar = ({ role }: { role: 'student' | 'lecturer' | 'admin' }) => {
  const links =
    role === 'student'
      ? studentLinks
      : role === 'lecturer'
      ? lecturerLinks
      : adminLinks;

  return (
    <div className="w-64 h-screen bg-gray-800 text-white">
      <div className="p-4 text-xl font-bold">University Portal</div>
      <nav>
        <ul>
          {links.map((link) => (
            <li key={link.path}>
              <Link to={link.path} className="block p-4 hover:bg-gray-700">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
