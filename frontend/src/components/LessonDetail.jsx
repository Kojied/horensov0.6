import React from 'react';
import CopyButton from './CopyButton';
import PdfDownloadButton from './PdfDownloadButton';

function LessonDetail({ lesson }) {
  return (
    
      Lesson Detail
      <CopyButton lessonDetails={lesson?.details} />
      <PdfDownloadButton />
    
  );
}

export default LessonDetail;