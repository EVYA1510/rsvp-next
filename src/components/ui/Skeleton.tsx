"use client";

import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: "sm" | "md" | "lg" | "xl" | "full";
}

export default function Skeleton({ 
  className = "", 
  width = "100%", 
  height = "20px", 
  rounded = "md" 
}: SkeletonProps) {
  const roundedClasses = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  };

  return (
    <motion.div
      className={`bg-gray-200 animate-pulse ${roundedClasses[rounded]} ${className}`}
      style={{ width, height }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    />
  );
}

// Predefined skeleton components
export function SkeletonText({ lines = 1, className = "" }: { lines?: number; className?: string }) {
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
    <div className={`bg-white/10 backdrop-blur-md rounded-3xl shadow-pink-200 p-8 ${className}`}>
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
    <Skeleton
      height="56px"
      className={`w-full rounded-xl ${className}`}
    />
  );
}

export function SkeletonInput({ className = "" }: { className?: string }) {
  return (
    <Skeleton
      height="48px"
      className={`w-full rounded-xl ${className}`}
    />
  );
}

export function SkeletonTextarea({ className = "" }: { className?: string }) {
  return (
    <Skeleton
      height="120px"
      className={`w-full rounded-xl ${className}`}
    />
  );
}
