import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const MainLayout = ({ role }: { role: 'student' | 'lecturer' | 'admin' }) => {
  return (
    <div className="flex">
      <Sidebar role={role} />
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
