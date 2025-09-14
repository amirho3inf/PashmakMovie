
import React from 'react';

export const Loader = () => {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-red-600"></div>
    </div>
  );
};
