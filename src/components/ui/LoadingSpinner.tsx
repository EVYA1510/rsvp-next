"use client";

import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "pink" | "blue" | "white";
  text?: string;
  className?: string;
}

export default function LoadingSpinner({
  size = "md",
  color = "pink",
  text,
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const colorClasses = {
    pink: "border-pink-500",
    blue: "border-blue-500",
    white: "border-white",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
    >
      <motion.div
        className={`${sizeClasses[size]} ${colorClasses[color]} border-2 border-t-transparent rounded-full animate-spin`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      />
      {text && (
        <motion.p
          className="text-sm text-gray-600 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

// Loading overlay for full-screen loading
export function LoadingOverlay({
  text = "טוען...",
  className = "",
}: {
  text?: string;
  className?: string;
}) {
  return (
    <motion.div
      className={`fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/60">
        <LoadingSpinner size="lg" text={text} />
      </div>
    </motion.div>
  );
}

// Loading button state
export function LoadingButton({
  children,
  loading,
  className = "",
  ...props
}: {
  children: React.ReactNode;
  loading?: boolean;
  className?: string;
  [key: string]: unknown;
}) {
  return (
    <button className={`relative ${className}`} disabled={loading} {...props}>
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-inherit rounded-inherit"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <LoadingSpinner size="sm" color="white" />
        </motion.div>
      )}
      <span className={loading ? "opacity-0" : ""}>{children}</span>
    </button>
  );
}
