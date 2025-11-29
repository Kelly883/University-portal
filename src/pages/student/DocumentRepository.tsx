import { useState } from 'react';

const requiredDocs = [
  { id: 1, name: 'O-Level Result', uploaded: false },
  { id: 2, name: 'Birth Certificate', uploaded: false },
  { id: 3, name: 'Letter of Recommendation', uploaded: false },
];

const DocumentRepository = () => {
  const [documents, setDocuments] = useState(requiredDocs);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingDocId, setUploadingDocId] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 5MB limit
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit.');
        return;
      }
      // Type validation
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Invalid file type. Only DOC, DOCX, and PDF are allowed.');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = (docId) => {
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }
    // Mock upload process
    console.log(`Uploading ${selectedFile.name} for document ID ${docId}`);
    setDocuments(documents.map(doc => doc.id === docId ? { ...doc, uploaded: true } : doc));
    setSelectedFile(null);
    setUploadingDocId(null);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Upload Your Documents</h1>

      <div className="space-y-4">
        {documents.map(doc => (
          <div key={doc.id} className="p-4 border rounded-lg flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">{doc.name}</h3>
              <p className={doc.uploaded ? 'text-green-500' : 'text-red-500'}>
                {doc.uploaded ? 'Uploaded' : 'Not Uploaded'}
              </p>
            </div>
            {!doc.uploaded && (
              <div className="flex items-center">
                <input type="file" onChange={handleFileChange} className="mr-2" />
                <button onClick={() => handleUpload(doc.id)} className="px-4 py-2 bg-blue-500 text-white rounded">Upload</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentRepository;
