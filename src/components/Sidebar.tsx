import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  // In a real application, you'd get the user's role from context or a hook
  const userRole = 'student'; // or 'lecturer', 'admin'

  return (
    <aside className="sidebar">
      <nav>
        <ul>
          {userRole === 'student' && (
            <>
              <li><NavLink to="/dashboard">Dashboard</NavLink></li>
              <li><NavLink to="/courses">Courses</NavLink></li>
              <li><NavLink to="/payments">Payments</NavLink></li>
              <li><NavLink to="/documents">Documents</NavLink></li>
            </>
          )}
          {userRole === 'lecturer' && (
            <>
              <li><NavLink to="/dashboard">Dashboard</NavLink></li>
              <li><NavLink to="/courses">Course Management</NavLink></li>
              <li><NavLink to="/documents">Documents</NavLink></li>
            </>
          )}
          {userRole === 'admin' && (
            <>
              <li><NavLink to="/dashboard">Dashboard</NavLink></li>
              <li><NavLink to="/courses">Course Management</NavLink></li>
              <li><NavLink to="/payments">Payments</NavLink></li>
              <li><NavLink to="/documents">Documents</NavLink></li>
              <li><NavLink to="/admin/signup-student">Add Student</NavLink></li>
              <li><NavLink to="/admin/signup-lecturer">Add Lecturer</NavLink></li>
            </>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
