import React, { useState } from 'react';
import './SignUpPage.css';

const StudentSignUpPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: '',
    email: '',
    phoneNumber: '',
    address: '',
    department: '',
    faculty: '',
    enrollmentStatus: 'Full-time',
    level: '100',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, an admin would submit this form to create a new student
    console.log(formData);
    alert('Student account created successfully!');
  };

  return (
    <div className="signup-page">
      <h1>Create Student Account</h1>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input type="text" id="fullName" name="fullName" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="dob">Date of Birth</label>
          <input type="date" id="dob" name="dob" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select id="gender" name="gender" onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input type="tel" id="phoneNumber" name="phoneNumber" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input type="text" id="address" name="address" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="faculty">Faculty</label>
          <input type="text" id="faculty" name="faculty" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="department">Department</label>
          <input type="text" id="department" name="department" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="enrollmentStatus">Enrollment Status</label>
          <select id="enrollmentStatus" name="enrollmentStatus" value={formData.enrollmentStatus} onChange={handleChange} required>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="level">Level</label>
          <input type="text" id="level" name="level" value={formData.level} readOnly />
        </div>
        <button type="submit">Create Student</button>
      </form>
    </div>
  );
};

export default StudentSignUpPage;
