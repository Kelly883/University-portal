import React from 'react';
import './DashboardPage.css';

const DashboardPage: React.FC = () => {
  // In a real application, this data would come from an API
  const user = {
    role: 'student',
    name: 'John Doe',
    matricNumber: 'F/HD/21/3210089',
    loginCount: 2,
    gpa: {
      '2022/2023': {
        'First Semester': 4.5,
        'Second Semester': 4.8,
      },
    },
    cgpa: 4.65,
  };

  return (
    <div className="dashboard-page">
      <h1>Welcome, {user.name}</h1>

      {user.role === 'student' && (
        <>
          <div className="matric-number-section">
            <p>Your Matric Number: <strong>{user.matricNumber}</strong></p>
            {user.loginCount <= 3 && (
              <div className="login-notification">
                <p>You have logged in with your email {user.loginCount} time(s). You have {3 - user.loginCount} login(s) with email remaining.</p>
              </div>
            )}
          </div>

          <div className="gpa-cgpa-section">
            <h2>Academic Performance</h2>
            <p>CGPA: <strong>{user.cgpa}</strong></p>
            <h3>GPA per Semester</h3>
            {Object.entries(user.gpa).map(([session, semesters]) => (
              <div key={session}>
                <h4>{session}</h4>
                <ul>
                  {Object.entries(semesters).map(([semester, gpa]) => (
                    <li key={semester}>{semester}: {gpa}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="status-summary">
        <h2>Status Summary</h2>
        {/* Add status summary components here */}
      </div>

      <div className="quick-action-cards">
        <h2>Quick Actions</h2>
        <div className="cards">
          <div className="card">
            <h3>Register for Courses</h3>
            <p>View and register for courses for the upcoming semester.</p>
          </div>
          <div className="card">
            <h3>Make a Payment</h3>
            <p>Pay your tuition and other fees.</p>
          </div>
          <div className="card">
            <h3>View Documents</h3>
            <p>Access your academic and administrative documents.</p>
          </div>
        </div>
      </div>

      <div className="recent-notifications">
        <h2>Recent Notifications</h2>
        <ul>
          <li>Your course registration for the next semester is now open.</li>
          <li>Your payment for the last semester has been successfully processed.</li>
          <li>A new document has been uploaded to your repository.</li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;
