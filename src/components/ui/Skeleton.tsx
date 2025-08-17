"use client";

import React from "react";

interface SkeletonProps {
  className?: string;
  height?: string;
  width?: string;
}

export default function Skeleton({
  className = "",
  height = "h-4",
  width = "w-full",
}: SkeletonProps) {
  return (
    <div
      data-testid="skeleton"
      className={`animate-pulse bg-gray-200 rounded ${height} ${width} ${className}`}
    />
  );
}

export function RSVPSkeleton() {
  return (
    <div
      className="w-full max-w-md mx-auto space-y-6"
      data-testid="rsvp-skeleton"
    >
      {/* Name field skeleton */}
      <div>
        <div className="mb-2 h-4 w-20 animate-pulse bg-gray-200 rounded" />
        <div className="h-10 w-full animate-pulse bg-gray-200 rounded" />
      </div>

      {/* Status field skeleton */}
      <div>
        <div className="mb-2 h-4 w-32 animate-pulse bg-gray-200 rounded" />
        <div className="h-10 w-full animate-pulse bg-gray-200 rounded" />
      </div>

      {/* Guests field skeleton */}
      <div>
        <div className="mb-2 h-4 w-24 animate-pulse bg-gray-200 rounded" />
        <div className="flex items-center justify-center space-x-4 space-x-reverse">
          <div className="h-10 w-10 animate-pulse bg-gray-200 rounded-full" />
          <div className="h-10 w-16 animate-pulse bg-gray-200 rounded" />
          <div className="h-10 w-10 animate-pulse bg-gray-200 rounded-full" />
        </div>
        <div className="flex justify-center gap-2 mt-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-8 w-8 animate-pulse bg-gray-200 rounded-full"
            />
          ))}
        </div>
      </div>

      {/* Blessing field skeleton */}
      <div>
        <div className="mb-2 h-4 w-16 animate-pulse bg-gray-200 rounded" />
        <div className="h-20 w-full animate-pulse bg-gray-200 rounded" />
      </div>

      {/* Submit button skeleton */}
      <div className="h-12 w-full animate-pulse bg-gray-200 rounded" />
    </div>
  );
}

// Predefined skeleton components
export function SkeletonText({
  lines = 1,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height="16px"
          width={i === lines - 1 ? "80%" : "100%"}
          className="bg-gray-200"
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-white/10 backdrop-blur-md rounded-3xl shadow-pink-200 p-8 ${className}`}
    >
      <div className="space-y-6">
        <div className="text-center">
          <Skeleton className="w-16 h-16 mx-auto mb-4 rounded-full" />
          <SkeletonText lines={2} className="max-w-xs mx-auto" />
        </div>
        <div className="space-y-4">
          <Skeleton height="48px" className="w-full" />
          <Skeleton height="48px" className="w-full" />
          <Skeleton height="120px" className="w-full" />
        </div>
        <Skeleton height="56px" className="w-full" />
      </div>
    </div>
  );
}

export function SkeletonButton({ className = "" }: { className?: string }) {
  return (
    <Skeleton height="56px" className={`w-full rounded-xl ${className}`} />
  );
}

export function SkeletonInput({ className = "" }: { className?: string }) {
  return (
    <Skeleton height="48px" className={`w-full rounded-xl ${className}`} />
  );
}

export function SkeletonTextarea({ className = "" }: { className?: string }) {
  return (
    <Skeleton height="120px" className={`w-full rounded-xl ${className}`} />
  );
}
