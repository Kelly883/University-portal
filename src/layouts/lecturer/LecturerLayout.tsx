import React from 'react';
import { Outlet } from 'react-router-dom';

const LecturerLayout: React.FC = () => {
  return (
    <div>
      {/* Sidebar for lecturer */}
      <nav>
        <ul>
          <li>Lecturer Dashboard</li>
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default LecturerLayout;
