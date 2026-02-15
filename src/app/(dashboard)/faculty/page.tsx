export default function FacultyDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Faculty Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Assigned Courses Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-2">My Courses</h2>
          <p className="text-gray-600 mb-4">View and manage your assigned courses.</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">View Courses</button>
        </div>

        {/* Student List Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-2">My Students</h2>
          <p className="text-gray-600 mb-4">View enrolled students and their details.</p>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">View Students</button>
        </div>

        {/* Grade Submission Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-2">Grade Submission</h2>
          <p className="text-gray-600 mb-4">Submit grades for exams and assignments.</p>
          <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">Submit Grades</button>
        </div>
      </div>
    </div>
  );
}
