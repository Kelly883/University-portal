import { useState } from 'react';
import { supabase } from '../../utils/supabase';

const StudentSignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phoneNumber: '',
    address: '',
    department: '',
    faculty: '',
    enrollmentStatus: '',
    level: '100',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { fullName, email, faculty, department } = formData;
    const year = new Date().getFullYear().toString().slice(-2);
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(10 + Math.random() * 90);
    const matricNumber = `${faculty.slice(0, 3).toUpperCase()}/${department.slice(0, 3).toUpperCase()}/${year}${month}${random}`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password: 'password', // Default password, user should change it
      options: {
        data: {
          full_name: fullName,
          role: 'student',
          matric_number: matricNumber,
          login_count: 0,
        },
      },
    });

    if (error) {
      console.error('Error signing up:', error);
    } else {
      console.log('Student created successfully:', data);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Create Student Account</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} className="input-style" />
            <input type="date" name="dateOfBirth" placeholder="Date of Birth" onChange={handleChange} className="input-style" />
            <input type="text" name="gender" placeholder="Gender" onChange={handleChange} className="input-style" />
            <input type="email" name="email" placeholder="Email Address" onChange={handleChange} className="input-style" />
            <input type="tel" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} className="input-style" />
            <input type="text" name="address" placeholder="Address" onChange={handleChange} className="input-style" />
            <input type="text" name="department" placeholder="Department" onChange={handleChange} className="input-style" />
            <input type="text" name="faculty" placeholder="Faculty" onChange={handleChange} className="input-style" />
            <input type="text" name="enrollmentStatus" placeholder="Enrollment Status" onChange={handleChange} className="input-style" />
            <input type="text" name="level" placeholder="Level (default: 100)" onChange={handleChange} className="input-style" />
          </div>
          <button type="submit" className="w-full button-style">
            Create Account
          </button>
        </form>
      </div>
      <style>{`
        .input-style {
          display: block;
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
        .button-style {
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: white;
          background-color: #4f46e5;
          border: 1px solid transparent;
          border-radius: 0.375rem;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </div>
  );
};

export default StudentSignUp;
