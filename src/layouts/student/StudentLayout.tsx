import React from 'react';
import { Outlet } from 'react-router-dom';

const StudentLayout: React.FC = () => {
  return (
    <div>
      {/* Sidebar for student */}
      <nav>
        <ul>
          <li>Student Dashboard</li>
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;
