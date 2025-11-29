import { useState } from 'react';

const coursesData = [
  { id: 1, title: 'Introduction to Computer Science', code: 'CSC101', unit: 3, level: 100 },
  { id: 2, title: 'Calculus I', code: 'MTH101', unit: 4, level: 100 },
];

const CourseManagement = () => {
  const [courses, setCourses] = useState(coursesData);
  const [newCourse, setNewCourse] = useState({ title: '', code: '', unit: '', level: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse({ ...newCourse, [name]: value });
  };

  const handleAddCourse = () => {
    setCourses([...courses, { ...newCourse, id: courses.length + 1, unit: parseInt(newCourse.unit), level: parseInt(newCourse.level) }]);
    setNewCourse({ title: '', code: '', unit: '', level: '' });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Course Management</h1>

      {/* Course Creation Form */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Create New Course</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="title" value={newCourse.title} onChange={handleInputChange} placeholder="Course Title" className="p-2 border rounded" />
          <input type="text" name="code" value={newCourse.code} onChange={handleInputChange} placeholder="Course Code" className="p-2 border rounded" />
          <input type="number" name="unit" value={newCourse.unit} onChange={handleInputChange} placeholder="Credit Unit" className="p-2 border rounded" />
          <input type="number" name="level" value={newCourse.level} onChange={handleInputChange} placeholder="Level" className="p-2 border rounded" />
        </div>
        <button onClick={handleAddCourse} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Add Course</button>
      </div>

      {/* Existing Courses Table */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Existing Courses</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Title</th>
              <th className="py-2">Code</th>
              <th className="py-2">Unit</th>
              <th className="py-2">Level</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="text-center border-b">
                <td className="py-2">{course.title}</td>
                <td className="py-2">{course.code}</td>
                <td className="py-2">{course.unit}</td>
                <td className="py-2">{course.level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseManagement;
