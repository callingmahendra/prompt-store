import { Link, useLocation } from "react-router-dom";
import { GlassCard, GlassCardContent, GlassCardDescription, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Star, Copy, Calendar, User, MessageCircle, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface PromptCardProps {
  id: string;
  title: string;
  description: string;
  tags: string[];
  rating: number;
  author: string;
  date: string;
  usageCount: number;
  stars?: any[];
  comments?: any[];
}

const PromptCard = ({ id, title, description, tags, rating, author, date, usageCount, stars = [], comments = [] }: PromptCardProps) => {
  const location = useLocation();
  const [isStarred, setIsStarred] = useState(false);
  const [starCount, setStarCount] = useState(stars.length);
  const userId = "user-123"; // This should come from auth context

  useEffect(() => {
    const checkStarStatus = async () => {
      try {
        const { starred } = await api.getStarStatus(id, userId);
        setIsStarred(starred);
      } catch (error) {
        console.error('Failed to check star status:', error);
      }
    };
    checkStarStatus();
  }, [id, userId]);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      // Note: We can't access prompt content from the card, so we'll need to fetch it
      const prompt = await api.getPrompt(id);
      await navigator.clipboard.writeText(prompt.content);
      // Track usage when prompt is copied
      await api.trackUsage(id);
      toast.success("Prompt copied to clipboard!");
    } catch (error) {
      console.error('Failed to copy or track usage:', error);
      toast.error("Failed to copy prompt");
    }
  };

  const handleStar = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const { starred } = await api.toggleStar(id, userId);
      setIsStarred(starred);
      setStarCount(prev => starred ? prev + 1 : prev - 1);
      toast.success(starred ? "Prompt starred!" : "Prompt unstarred!");
    } catch (error) {
      console.error('Failed to toggle star:', error);
    }
  };

  return (
    <Link to={`/prompt/${id}${location.search}`}>
      <GlassCard className="group hover-lift hover-glow transition-all duration-500 cursor-pointer h-full relative overflow-hidden">
        {/* Trending indicator for high-rated prompts */}
        {rating >= 4.5 && (
          <div className="absolute top-3 right-3 z-10">
            <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-xs font-medium text-white shadow-glow">
              <TrendingUp className="h-3 w-3" />
              Hot
            </div>
          </div>
        )}

        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <GlassCardHeader className="relative">
          <div className="flex items-start justify-between gap-2">
            <GlassCardTitle className="group-hover:text-gradient transition-all duration-300 line-clamp-2 text-lg">
              {title}
            </GlassCardTitle>
            <div className="flex gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-primary/10"
                onClick={handleStar}
              >
                <Star className={`h-4 w-4 transition-all duration-300 ${
                  isStarred 
                    ? 'fill-yellow-400 text-yellow-400 scale-110' 
                    : 'text-muted-foreground hover:text-yellow-400'
                }`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-primary/10"
                onClick={handleCopy}
              >
                <Copy className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
              </Button>
            </div>
          </div>
          <GlassCardDescription className="line-clamp-2 text-sm leading-relaxed">
            {description}
          </GlassCardDescription>
        </GlassCardHeader>
        
        <GlassCardContent className="space-y-4 relative">
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 4).map((tag, index) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="text-xs hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {tag}
              </Badge>
            ))}
            {tags.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 4} more
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 hover:text-yellow-400 transition-colors">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{starCount}</span>
              </div>
              <div className="flex items-center gap-1 hover:text-primary transition-colors">
                <MessageCircle className="h-4 w-4" />
                <span className="font-medium">{comments.length}</span>
              </div>
              <div className="flex items-center gap-1 hover:text-primary transition-colors">
                <User className="h-4 w-4" />
                <span className="truncate max-w-20">{author}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Calendar className="h-3 w-3" />
              <span>{date}</span>
            </div>
          </div>

          {/* Usage indicator */}
          {usageCount > 10 && (
            <div className="flex items-center gap-1 text-xs text-primary">
              <Sparkles className="h-3 w-3" />
              <span>{usageCount} uses</span>
            </div>
          )}
        </GlassCardContent>
      </GlassCard>
    </Link>
  );
};

export default PromptCard;
