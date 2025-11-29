import React from 'react';
import './ResultsPage.css';

const ResultsPage: React.FC = () => {
  // In a real application, this data would come from an API
  const user = {
    gpa: {
      '2022/2023': {
        'First Semester': 4.5,
        'Second Semester': 4.8,
      },
      '2023/2024': {
        'First Semester': 4.7,
        'Second Semester': 4.6,
      },
    },
    cgpa: 4.65,
  };

  return (
    <div className="results-page">
      <h1>Your Results</h1>
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
    </div>
  );
};

export default ResultsPage;
