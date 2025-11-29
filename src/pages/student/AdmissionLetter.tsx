import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';

const AdmissionLetter = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (error) console.error('Error fetching profile:', error);
        else setStudent(profile);
      }
      setLoading(false);
    };
    fetchStudentData();
  }, []);

  const handleDownload = () => {
    // This would ideally generate a PDF. For now, we'll just print.
    window.print();
  };

  if (loading) return <div>Loading...</div>;
  if (!student) return <div>You are not logged in.</div>;
  if (student.admission_status !== 'admitted') {
    return <div>Your admission is still being processed.</div>;
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 border" id="admission-letter">
        <h1 className="text-3xl font-bold text-center mb-6">Letter of Admission</h1>
        <p className="mb-4">Dear {student.full_name},</p>
        <p className="mb-4">
          We are pleased to offer you admission to the <strong>{student.department}</strong> department in the Faculty of <strong>{student.faculty}</strong> at our prestigious university for the {new Date().getFullYear()}/{new Date().getFullYear() + 1} academic session.
        </p>
        <p className="mb-4">Your matriculation number is <strong>{student.matric_number}</strong>.</p>
        <p>We congratulate you on your admission and look forward to welcoming you.</p>
      </div>
      <div className="text-center mt-6">
        <button onClick={handleDownload} className="px-6 py-2 bg-green-500 text-white rounded">Download Letter</button>
      </div>
    </div>
  );
};

export default AdmissionLetter;
