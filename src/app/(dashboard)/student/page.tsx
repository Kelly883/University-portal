export default function StudentDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Enrolled Courses Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-2">My Courses</h2>
          <p className="text-gray-600 mb-4">Access your enrolled courses and materials.</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Go to Courses</button>
        </div>

        {/* Grades Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-2">My Grades</h2>
          <p className="text-gray-600 mb-4">View your academic performance and results.</p>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">View Grades</button>
        </div>

        {/* Fee Payment Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-2">Fee Payment</h2>
          <p className="text-gray-600 mb-4">View outstanding fees and make payments.</p>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Pay Fees</button>
        </div>
      </div>
    </div>
  );
}
