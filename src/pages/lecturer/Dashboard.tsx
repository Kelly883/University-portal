import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';

const LecturerDashboard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setProfile(profile);
        }
      }
      setLoading(false);
    };

    fetchUserAndProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in.</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Welcome, {user.email}</h1>
      <div className="mt-4">
        <p>Staff ID: {profile?.staff_id}</p>
        <p>You have {3 - (profile?.login_count || 0)} email logins remaining.</p>
      </div>
    </div>
  );
};

export default LecturerDashboard;
