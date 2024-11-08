import React, { useState } from 'react';
import "./Alerts.css"

interface FileInfo {
  fileName: string;
  virusType: string;
  confidenceLevel: number;
}

const Alerts: React.FC = () => {
  const [showRecommendations, setShowRecommendations] = useState(false);
  const files: FileInfo[] = [
    { fileName: "file1.exe", virusType: "Trojan.Win32", confidenceLevel: 80 },
    { fileName: "file2.doc", virusType: "Adware.Generic", confidenceLevel: 60 },
    { fileName: "file3.pdf", virusType: "Worm.Python", confidenceLevel: 90 },
    { fileName: "file4.jpg", virusType: "Multipartite Virus", confidenceLevel: 75 },
    { fileName: "file5.zip", virusType: "Rootkit", confidenceLevel: 85 },
  ];
  const handleViewRecommendations = (virusType: string, confidenceLevel: number) => {
    // Construct the URL with the virus type and confidence level as query parameters
    const url = `http://127.0.0.1:5001/?virusType=${encodeURIComponent(virusType)}&confidenceLevel=${confidenceLevel}`;
    const chatWindow = window.open(url, "_blank", "width=400,height=600");

    if (chatWindow) {
      chatWindow.document.title = "Chatbot Recommendations";
    }
  };

  return (
    <div className="alerts">
      <h1>Alerts</h1>
      <p>Dashboard alerts page</p>
      <div className="files-list">
        {files.map((file, index) => (
          <div key={index} className="file-item">
            <p><strong>File Name:</strong> {file.fileName}</p>
            <p><strong>Virus Type:</strong> {file.virusType}</p>
            <p><strong>Confidence Level:</strong> {file.confidenceLevel}%</p>
            <button
              className="view-recommendations-button"
              onClick={() => handleViewRecommendations(file.virusType, file.confidenceLevel)}
            >
              View Recommendations
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alerts;
