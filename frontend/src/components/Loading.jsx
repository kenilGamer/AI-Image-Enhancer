import React from 'react';

function Loading() {
  return (
    <div className="flex items-center justify-center h-full">
      <div
        className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"
        role="status"
        aria-label="Loading"
      ></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default Loading;