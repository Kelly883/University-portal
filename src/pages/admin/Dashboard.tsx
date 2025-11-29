import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="mt-4">
        <p>Welcome, Admin!</p>
        <div className="mt-8">
          <Link to="/admin/signup/student" className="text-indigo-600 hover:underline">
            Create Student Account
          </Link>
        </div>
        <div className="mt-4">
          <Link to="/admin/signup/lecturer" className="text-indigo-600 hover:underline">
            Create Lecturer Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
