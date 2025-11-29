import React, { useState } from 'react';
import './SignUpPage.css';

const LecturerSignUpPage: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    department: '',
    faculty: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, an admin would submit this form to create a new lecturer
    console.log(formData);
    alert('Lecturer account created successfully!');
  };

  return (
    <div className="signup-page">
      <h1>Create Lecturer Account</h1>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <select id="title" name="title" onChange={handleChange} required>
            <option value="">Select Title</option>
            <option value="Mr">Mr</option>
            <option value="Mrs">Mrs</option>
            <option value="Ms">Ms</option>
            <option value="Dr">Dr</option>
            <option value="Prof">Prof</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input type="text" id="fullName" name="fullName" onChange={handleChange} required />
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
        <button type="submit">Create Lecturer</button>
      </form>
    </div>
  );
};

export default LecturerSignUpPage;
