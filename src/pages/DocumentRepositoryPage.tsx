import React, { useState } from 'react';
import './DocumentRepositoryPage.css';

interface Document {
  id: number;
  name: string;
  type: string;
  url: string;
}

const DocumentRepositoryPage: React.FC = () => {
  // Mock data - in a real application, this would come from an API
  const [documents, setDocuments] = useState<Document[]>([
    { id: 1, name: 'Academic Transcript', type: 'pdf', url: '#' },
    { id: 2, name: 'Course Syllabus', type: 'pdf', url: '#' },
    { id: 3, name: 'Student ID Card', type: 'jpg', url: '#' },
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      // In a real application, you would upload the file to a server
      alert(`Uploading file: ${file.name}`);
    }
  };

  return (
    <div className="document-repository-page">
      <h1>Document Repository</h1>

      <div className="file-upload">
        <h2>Upload a Document</h2>
        <input type="file" onChange={handleFileUpload} />
      </div>

      <div className="document-browser">
        <h2>Your Documents</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.name}</td>
                <td>{doc.type}</td>
                <td>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer">View</a>
                  {/* In a real application, you would have permission settings */}
                  <button>Permissions</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentRepositoryPage;
