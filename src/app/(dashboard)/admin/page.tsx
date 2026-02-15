export default function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* User Management Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-2">User Management</h2>
          <p className="text-gray-600 mb-4">Manage students, faculty, and other admins.</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Manage Users</button>
        </div>

        {/* Course Management Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-2">Course Management</h2>
          <p className="text-gray-600 mb-4">Create, edit, and assign courses.</p>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Manage Courses</button>
        </div>

        {/* Analytics Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-2">Analytics</h2>
          <p className="text-gray-600 mb-4">View system-wide statistics and reports.</p>
          <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">View Analytics</button>
        </div>
      </div>
    </div>
  );
}
