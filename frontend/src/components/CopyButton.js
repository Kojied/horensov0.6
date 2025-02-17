import React from 'react';

function CopyButton({ lessonDetails }) {
  const handleCopyClick = () => {
    navigator.clipboard.writeText(lessonDetails)
      .then(() => {
        alert('Lesson details copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        alert('Failed to copy lesson details. Please try again.');
      });
  };

  return (
    <button onClick={handleCopyClick}>Copy</button>
  );
}

export default CopyButton;