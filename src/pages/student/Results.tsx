import { useState } from 'react';

const resultsData = {
  cgpa: 3.85,
  sessions: [
    {
      session: '2023/2024',
      semesters: [
        {
          semester: 'First',
          gpa: 3.8,
          courses: [
            { code: 'CSC101', title: 'Intro to CS', unit: 3, grade: 'A' },
            { code: 'MTH101', title: 'Calculus I', unit: 4, grade: 'B' },
            { code: 'PHY101', title: 'Physics I', unit: 3, grade: 'A' },
          ],
        },
        {
          semester: 'Second',
          gpa: 3.9,
          courses: [
            { code: 'CSC102', title: 'Intro to Programming', unit: 3, grade: 'A' },
            { code: 'MTH102', title: 'Calculus II', unit: 4, grade: 'A' },
            { code: 'PHY102', title: 'Physics II', unit: 3, grade: 'B' },
          ],
        },
      ],
    },
  ],
};

const Results = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState(resultsData.sessions);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term === '') {
      setFilteredResults(resultsData.sessions);
      return;
    }
    const filtered = resultsData.sessions.map(session => ({
      ...session,
      semesters: session.semesters.filter(semester =>
        semester.semester.toLowerCase().includes(term.toLowerCase()) ||
        session.session.toLowerCase().includes(term.toLowerCase())
      ),
    })).filter(session => session.semesters.length > 0);
    setFilteredResults(filtered);
  };


  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Your Results</h1>
      <div className="mb-6 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-2xl font-semibold">Overall CGPA: {resultsData.cgpa}</h2>
      </div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by semester or session (e.g., 'First' or '2023/2024')"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-2 border rounded"
        />
      </div>
      {filteredResults.map((session) => (
        <div key={session.session} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Session: {session.session}</h2>
          {session.semesters.map((semester) => (
            <div key={semester.semester} className="mb-6 p-4 border rounded-lg">
              <h3 className="text-xl font-bold mb-2">{semester.semester} Semester</h3>
              <p className="mb-4 font-semibold">GPA: {semester.gpa}</p>
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2">Course Code</th>
                    <th className="py-2">Course Title</th>
                    <th className="py-2">Credit Unit</th>
                    <th className="py-2">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {semester.courses.map((course) => (
                    <tr key={course.code} className="text-center border-b">
                      <td className="py-2">{course.code}</td>
                      <td className="py-2">{course.title}</td>
                      <td className="py-2">{course.unit}</td>
                      <td className="py-2">{course.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Results;
