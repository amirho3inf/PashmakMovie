import React from 'react';

export const Loader = () => {
  return (
    <div className="fixed inset-0 z-[999] flex justify-center items-center bg-gray-900/75" role="status">
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-red-600"></div>
    </div>
  );
};
