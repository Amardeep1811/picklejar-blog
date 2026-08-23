"use client";

export default function PostExcerpt({ excerpt, size = 'medium', className = '' }) {
  if (!excerpt) return null;

  const baseClasses = "font-[var(--font-body)] text-[var(--gray-2)]";
  
  const sizeClasses = {
    medium: "text-[17px] leading-relaxed",
    small: "text-[14px] leading-relaxed"
  };

  return (
    <p className={`${baseClasses} ${sizeClasses[size] || sizeClasses.medium} ${className}`}>
      {excerpt}
    </p>
  );
}
