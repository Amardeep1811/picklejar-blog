"use client";

export default function PostTitle({ title, size = 'medium', className = '', as = 'h3' }) {
  const baseClasses = "font-[var(--font-heading)] font-bold text-[var(--ink)] group-hover:text-[var(--green-dark)] transition-colors";
  
  const sizeClasses = {
    hero: "text-4xl leading-[1.15] mb-3",
    medium: "text-[19px] leading-[1.15]",
    small: "text-base leading-[1.15]",
    headline: "text-[15px] leading-[1.15]"
  };

  const Component = as;

  return (
    <Component className={`${baseClasses} ${sizeClasses[size] || sizeClasses.medium} ${className}`}>
      {title}
    </Component>
  );
}
