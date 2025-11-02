import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "dots" | "pulse";
}

const Loading = ({ className, size = "md", variant = "default" }: LoadingProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  if (variant === "dots") {
    return (
      <div className={cn("flex space-x-1", className)}>
        <div className={cn("bg-primary rounded-full animate-bounce", sizeClasses[size])} style={{ animationDelay: '0ms' }} />
        <div className={cn("bg-primary rounded-full animate-bounce", sizeClasses[size])} style={{ animationDelay: '150ms' }} />
        <div className={cn("bg-primary rounded-full animate-bounce", sizeClasses[size])} style={{ animationDelay: '300ms' }} />
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={cn("bg-primary rounded-full animate-pulse", sizeClasses[size], className)} />
    );
  }

  return (
    <div className={cn("animate-spin rounded-full border-2 border-primary border-t-transparent", sizeClasses[size], className)} />
  );
};

export { Loading };