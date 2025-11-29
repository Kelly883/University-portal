import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';

const AdmissionManagement = () => {
  const [pendingStudents, setPendingStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingStudents = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .eq('admission_status', 'pending');

      if (error) console.error('Error fetching students:', error);
      else setPendingStudents(data);
      setLoading(false);
    };
    fetchPendingStudents();
  }, []);

  const admitStudent = async (studentId) => {
    const { error } = await supabase
      .from('profiles')
      .update({ admission_status: 'admitted' })
      .eq('id', studentId);

    if (error) console.error('Error admitting student:', error);
    else setPendingStudents(pendingStudents.filter(s => s.id !== studentId));
  };

  const admitAll = async () => {
    const { error } = await supabase
      .from('profiles')
      .update({ admission_status: 'admitted' })
      .eq('role', 'student')
      .eq('admission_status', 'pending');

    if (error) console.error('Error admitting all students:', error);
    else setPendingStudents([]);
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admission Management</h1>
      <button onClick={admitAll} className="mb-4 px-4 py-2 bg-green-500 text-white rounded">Admit All Students</button>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Full Name</th>
            <th className="py-2">Email</th>
            <th className="py-2">Department</th>
            <th className="py-2">Faculty</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingStudents.map((student) => (
            <tr key={student.id} className="text-center border-b">
              <td className="py-2">{student.full_name}</td>
              <td className="py-2">{student.email}</td>
              <td className="py-2">{student.department}</td>
              <td className="py-2">{student.faculty}</td>
              <td className="py-2">
                <button onClick={() => admitStudent(student.id)} className="px-4 py-2 bg-blue-500 text-white rounded">Admit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdmissionManagement;
