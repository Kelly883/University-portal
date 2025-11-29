import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <header className="hero-section">
        <h1>Welcome to the University Portal</h1>
        <p>Your one-stop solution for managing your academic journey.</p>
        <div className="auth-buttons">
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
      </header>

      <section className="feature-highlights">
        <h2>Features</h2>
        <div className="features">
          <div className="feature">
            <h3>Course Management</h3>
            <p>Register for courses, view your grades, and track your academic progress.</p>
          </div>
          <div className="feature">
            <h3>Payment Processing</h3>
            <p>Pay your tuition and other fees securely online.</p>
          </div>
          <div className="feature">
            <h3>Document Repository</h3>
            <p>Access and manage your academic documents in one place.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
