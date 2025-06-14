import React from "react";

function Loader() {
  return (
    <div className="w-screen h-screen z-[999] fixed top-0 left-0">
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80 backdrop-blur-sm">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-t-indigo-600 border-b-indigo-600 border-transparent"></div>
          <span className="mt-4 text-base font-semibold text-gray-700 tracking-wide">
            Loading...
          </span>
        </div>
      </div>
    </div>
  );
}

export default Loader;
