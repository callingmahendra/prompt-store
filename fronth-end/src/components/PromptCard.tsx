import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Copy, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PromptCardProps {
  id: string;
  title: string;
  description: string;
  tags: string[];
  rating: number;
  author: string;
  date: string;
  usageCount: number;
}

const PromptCard = ({ id, title, description, tags, rating, author, date, usageCount }: PromptCardProps) => {
  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.success("Prompt copied to clipboard!");
  };

  return (
    <Link to={`/prompt/${id}`}>
      <Card className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border-border bg-card h-full">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
              {title}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="line-clamp-2">{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{author}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{date}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PromptCard;
