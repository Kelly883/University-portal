import { useState } from 'react';

const availableCourses = [
  { id: 1, title: 'Introduction to Computer Science', code: 'CSC101', unit: 3 },
  { id: 2, title: 'Calculus I', code: 'MTH101', unit: 4 },
  { id: 3, title: 'Introduction to Physics', code: 'PHY101', unit: 3 },
];

const CourseManagement = () => {
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const maxCreditUnits = 18; // This will be dynamic later

  const handleAddCourse = (course) => {
    setSelectedCourses([...selectedCourses, course]);
  };

  const handleRegisterCourses = () => {
    setRegisteredCourses([...registeredCourses, ...selectedCourses]);
    setSelectedCourses([]);
  };

  const handleDropCourse = (courseId) => {
    setRegisteredCourses(registeredCourses.filter((c) => c.id !== courseId));
  };

  const totalRegisteredCredits = registeredCourses.reduce((acc, course) => acc + course.unit, 0);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Course Registration</h1>

      {/* Available Courses */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Available Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableCourses.map((course) => (
            <div key={course.id} className="p-4 border rounded-lg">
              <h3 className="text-lg font-bold">{course.title}</h3>
              <p>{course.code}</p>
              <p>Credit Units: {course.unit}</p>
              <button onClick={() => handleAddCourse(course)} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">Add Course</button>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Courses */}
      {selectedCourses.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Selected Courses for Registration</h2>
          <ul>
            {selectedCourses.map((course) => (
              <li key={course.id} className="flex justify-between items-center p-2 border-b">
                <span>{course.title} ({course.code})</span>
                <span>{course.unit} units</span>
              </li>
            ))}
          </ul>
          <button onClick={handleRegisterCourses} className="mt-4 px-4 py-2 bg-green-500 text-white rounded">Register Selected Courses</button>
        </div>
      )}

      {/* Registered Courses */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Registered Courses</h2>
        <p className="mb-4">Total Credit Units: {totalRegisteredCredits} / {maxCreditUnits}</p>
        <ul>
          {registeredCourses.map((course) => (
            <li key={course.id} className="flex justify-between items-center p-2 border-b">
              <div>
                <p className="font-bold">{course.title}</p>
                <p>{course.code} - {course.unit} units</p>
              </div>
              <button onClick={() => handleDropCourse(course.id)} className="px-4 py-2 bg-red-500 text-white rounded">Drop Course</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CourseManagement;
