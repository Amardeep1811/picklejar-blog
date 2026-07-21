export default function PostTitle({ title, size = 'medium', className = '' }) {
  const baseClasses = "font-['Inter'] font-black text-[var(--ink)] group-hover:text-[var(--green-dark)] transition-colors";
  
  const sizeClasses = {
    hero: "text-4xl leading-[1.15] mb-3",
    medium: "text-[19px] leading-[1.15]",
    small: "text-base leading-[1.15]",
    headline: "text-[15px] leading-[1.15]"
  };

  return (
    <h3 className={`${baseClasses} ${sizeClasses[size] || sizeClasses.medium} ${className}`}>
      {title}
    </h3>
  );
}
