import { useState } from 'react';

const documentTypesData = [
  { id: 1, name: 'O-Level Result' },
  { id: 2, name: 'Birth Certificate' },
  { id: 3, name: 'Letter of Recommendation' },
];

const uploadedDocsData = [
    {id: 1, studentName: 'John Doe', docType: 'O-Level Result', url: '/docs/john-doe-olevel.pdf'},
    {id: 2, studentName: 'Jane Smith', docType: 'Birth Certificate', url: '/docs/jane-smith-birth-cert.pdf'},
]

const DocumentManagement = () => {
  const [documentTypes, setDocumentTypes] = useState(documentTypesData);
  const [newDocType, setNewDocType] = useState('');
  const [uploadedDocs, setUploadedDocs] = useState(uploadedDocsData);

  const handleAddDocType = () => {
    setDocumentTypes([...documentTypes, { id: documentTypes.length + 1, name: newDocType }]);
    setNewDocType('');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Document Management</h1>

      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Define Required Documents</h2>
        <div className="flex">
          <input
            type="text"
            value={newDocType}
            onChange={(e) => setNewDocType(e.target.value)}
            placeholder="New Document Type"
            className="p-2 border rounded-l"
          />
          <button onClick={handleAddDocType} className="px-4 py-2 bg-blue-500 text-white rounded-r">Add</button>
        </div>
        <ul className="mt-4">
            {documentTypes.map(doc => <li key={doc.id}>{doc.name}</li>)}
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">View Uploaded Documents</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Student Name</th>
              <th className="py-2">Document Type</th>
              <th className="py-2">Link</th>
            </tr>
          </thead>
          <tbody>
            {uploadedDocs.map((doc) => (
              <tr key={doc.id} className="text-center border-b">
                <td className="py-2">{doc.studentName}</td>
                <td className="py-2">{doc.docType}</td>
                <td className="py-2"><a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">View Document</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentManagement;
