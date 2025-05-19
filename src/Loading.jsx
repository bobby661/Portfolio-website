  import React from 'react';
  import './Loading.css';

  const Loading = () => {
    return (
      <div className="loading-container">
        <div className="music-staff">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="staff-line"></div>
    ))}
    <div className="note note-1">&#9833;</div>
    <div className="note note-2">&#9834;</div>
    <div className="note note-3">&#9833;</div>
    <div className="note note-4">&#9834;</div>
  </div>
        <p className="loading-text">Loading music magic...</p>
      </div>
    );
  };

  export default Loading;
