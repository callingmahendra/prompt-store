import { Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar = ({ value, onChange, placeholder = "Search prompts...", className = "" }: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative group ${className}`}>
      <div className="absolute inset-0 bg-gradient-primary rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm" />
      <div className="relative">
        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-all duration-300 ${
          isFocused ? 'text-primary scale-110' : 'text-muted-foreground'
        }`} />
        {isFocused && (
          <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary animate-pulse" />
        )}
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`pl-12 pr-12 py-6 text-lg shadow-md hover:shadow-lg focus:shadow-glow transition-all duration-300 border-2 ${
            isFocused 
              ? 'border-primary/50 bg-background/90' 
              : 'border-border hover:border-primary/30'
          }`}
        />
      </div>
    </div>
  );
};

export default SearchBar;
