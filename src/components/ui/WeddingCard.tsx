import { ReactNode } from "react";

interface WeddingCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "gradient";
}

export default function WeddingCard({ children, className = "", variant = "default" }: WeddingCardProps) {
  const baseClasses = "backdrop-blur-lg shadow-2xl rounded-3xl p-8 mb-8 border border-white/50";
  const variantClasses = variant === "gradient" 
    ? "bg-gradient-to-r from-pink-100/90 to-blue-100/90" 
    : "bg-white/90";

  return (
    <div className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </div>
  );
} 