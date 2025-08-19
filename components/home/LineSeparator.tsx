import React from 'react';

export default function LineSeparator() {
  return (
    <div className="mx-4 sm:mx-8 md:mx-16 lg:mx-32">
      <div
        className="h-0.5 w-full bg-gradient-to-r from-transparent via-gray-400 to-transparent"
        style={{ opacity: 0.7 }}
      ></div>
    </div>
  );
}
