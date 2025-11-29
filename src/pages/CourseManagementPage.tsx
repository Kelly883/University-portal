import React, { useState } from 'react';
import './CourseManagementPage.css';

interface Course {
  id: number;
  title: string;
  code: string;
  unit: number;
}

const CourseManagementPage: React.FC = () => {
  // Mock data - in a real application, this would come from an API
  const [availableCourses, setAvailableCourses] = useState<Course[]>([
    { id: 1, title: 'Introduction to Computer Science', code: 'CSC101', unit: 3 },
    { id: 2, title: 'Calculus I', code: 'MTH101', unit: 4 },
    { id: 3, title: 'Physics for Engineers', code: 'PHY101', unit: 4 },
  ]);

  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [registeredCourses, setRegisteredCourses] = useState<Course[]>([]);

  const maxCreditUnits = 18;

  const handleAddCourse = (course: Course) => {
    setSelectedCourses([...selectedCourses, course]);
    setAvailableCourses(availableCourses.filter((c) => c.id !== course.id));
  };

  const handleRegisterCourses = () => {
    setRegisteredCourses([...registeredCourses, ...selectedCourses]);
    setSelectedCourses([]);
  };

  const handleDropCourse = (course: Course) => {
    setRegisteredCourses(registeredCourses.filter((c) => c.id !== course.id));
    setAvailableCourses([...availableCourses, course]);
  };

  const totalRegisteredCreditUnits = registeredCourses.reduce((total, course) => total + course.unit, 0);

  return (
    <div className="course-management-page">
      <h1>Course Management</h1>

      <div className="courses-section">
        <h2>Available Courses</h2>
        <ul>
          {availableCourses.map((course) => (
            <li key={course.id}>
              <span>{course.title} ({course.code}) - {course.unit} units</span>
              <button onClick={() => handleAddCourse(course)}>Add Course</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="courses-section">
        <h2>Selected Courses</h2>
        <ul>
          {selectedCourses.map((course) => (
            <li key={course.id}>
              <span>{course.title} ({course.code}) - {course.unit} units</span>
            </li>
          ))}
        </ul>
        {selectedCourses.length > 0 && (
          <button onClick={handleRegisterCourses}>Register Selected Courses</button>
        )}
      </div>

      <div className="courses-section">
        <h2>Registered Courses</h2>
        <ul>
          {registeredCourses.map((course) => (
            <li key={course.id}>
              <span>{course.title} ({course.code}) - {course.unit} units</span>
              <button onClick={() => handleDropCourse(course)}>Drop Course</button>
            </li>
          ))}
        </ul>
        <div className="credit-unit-summary">
            <p>Total Registered Credit Units: {totalRegisteredCreditUnits}</p>
            <p>Maximum Credit Units: {maxCreditUnits}</p>
        </div>
      </div>
    </div>
  );
};

export default CourseManagementPage;
