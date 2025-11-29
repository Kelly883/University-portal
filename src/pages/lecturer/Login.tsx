import { useState } from 'react';
import { supabase } from '../../utils/supabase';
import { useNavigate } from 'react-router-dom';

const LecturerLogin = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const isEmail = identifier.includes('@');
    let user = null;

    if (isEmail) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: identifier,
        password,
      });

      if (error) {
        console.error('Error logging in:', error);
        return;
      }

      user = data.user;

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('login_count')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return;
      }

      if (profile.login_count >= 3) {
        alert('You have exceeded the number of logins with your email. Please use your staff ID.');
        await supabase.auth.signOut();
        return;
      }

      await supabase
        .from('profiles')
        .update({ login_count: profile.login_count + 1 })
        .eq('id', user.id);

      alert(`You have logged in ${profile.login_count + 1} times with your email. You have ${2 - profile.login_count} logins left with your email.`);
    } else {
      // Logic for logging in with staff ID
    }

    if (user) {
      navigate('/lecturer/dashboard');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Lecturer Login</h2>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="identifier"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address / Staff ID
            </label>
            <input
              type="text"
              name="identifier"
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LecturerLogin;
