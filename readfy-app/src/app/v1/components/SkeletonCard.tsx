"use client";

export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse flex flex-col">
      <div className="w-full aspect-[2/3] mb-4 bg-gray-200 rounded-md"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3 mt-auto"></div>
    </div>
  );
}
