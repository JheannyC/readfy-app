"use client";

export default function SkeletonCard() {
  return (
    <div className="bg-card rounded-lg shadow-sm border p-6 animate-pulse flex flex-col">
      <div className="w-full aspect-[4/5] mb-4 bg-muted rounded-md"></div>
      <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-muted rounded w-1/2 mb-1"></div>
      <div className="h-4 bg-muted rounded w-1/3 mt-auto"></div>
    </div>
  );
}
