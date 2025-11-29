import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would handle authentication with a backend.
    // We will simulate the login logic here.

    // Check if identifier is an email
    if (identifier.includes('@')) {
        // Simulate a user with a login count
        const loginCount = 1; // This would come from your database
        if (loginCount >= 3) {
            alert('You have exceeded the maximum number of logins with your email. Please use your matric number or staff ID.');
            return;
        }
    }

    // If authentication is successful:
    alert('Login successful!');
    navigate('/dashboard');
  };

  return (
    <div className="login-page">
      <form onSubmit={handleLogin} className="login-form">
        <h1>Login</h1>
        <div className="form-group">
          <label htmlFor="identifier">Email, Matric Number, or Staff ID</label>
          <input
            type="text"
            id="identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
