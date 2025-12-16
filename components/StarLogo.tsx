import React from 'react';

const StarLogo: React.FC = () => {
  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {/* CSS Polygon Star for the exact shape feeling */}
      <div className="absolute inset-0 bg-book-star star-clip shadow-sm"></div>
      
      {/* Text centered in the star */}
      <div className="relative z-10 text-center leading-tight">
        <h1 className="text-2xl font-bold tracking-widest text-black">
          THE BOOK
        </h1>
        <h1 className="text-2xl font-bold tracking-widest text-black mt-1">
          OF ANSWERS
        </h1>
      </div>
    </div>
  );
};

export default StarLogo;
