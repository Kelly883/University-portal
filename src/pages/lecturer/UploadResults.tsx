import { useState } from 'react';

const UploadResults = () => {
  const [uploadType, setUploadType] = useState('individual'); // 'individual' or 'bulk'
  const [individualResult, setIndividualResult] = useState({ studentId: '', courseCode: '', score: '' });
  const [bulkFile, setBulkFile] = useState(null);

  const handleIndividualChange = (e) => {
    const { name, value } = e.target;
    setIndividualResult({ ...individualResult, [name]: value });
  };

  const handleFileChange = (e) => {
    setBulkFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (uploadType === 'individual') {
      console.log('Submitting individual result:', individualResult);
    } else {
      console.log('Submitting bulk results from file:', bulkFile);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Upload Results</h1>

      <div className="mb-6">
        <button onClick={() => setUploadType('individual')} className={`mr-4 px-4 py-2 ${uploadType === 'individual' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}>Individual Upload</button>
        <button onClick={() => setUploadType('bulk')} className={`px-4 py-2 ${uploadType === 'bulk' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}>Bulk Upload</button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 border rounded-lg">
        {uploadType === 'individual' ? (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Individual Result Upload</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" name="studentId" value={individualResult.studentId} onChange={handleIndividualChange} placeholder="Student ID/Matric Number" className="p-2 border rounded" />
              <input type="text" name="courseCode" value={individualResult.courseCode} onChange={handleIndividualChange} placeholder="Course Code" className="p-2 border rounded" />
              <input type="number" name="score" value={individualResult.score} onChange={handleIndividualChange} placeholder="Score" className="p-2 border rounded" />
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Bulk Result Upload</h2>
            <p className="mb-2">Upload a CSV or Excel file with columns: StudentID, CourseCode, Score</p>
            <input type="file" onChange={handleFileChange} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" className="p-2 border rounded" />
          </div>
        )}
        <button type="submit" className="mt-4 px-4 py-2 bg-green-500 text-white rounded">Submit Results</button>
      </form>
    </div>
  );
};

export default UploadResults;
