import { useParams, Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Copy, Edit, Star, Calendar, User, TrendingUp, History } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Comments from "@/components/Comments";

const PromptDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isStarred, setIsStarred] = useState(false);
  const [starCount, setStarCount] = useState(0);
  const [comments, setComments] = useState([]);
  const userId = "user-123"; // This should come from auth context

  const { data: prompt, isLoading, isError } = useQuery({
    queryKey: ["prompt", id],
    queryFn: () => api.getPrompt(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (prompt) {
      setStarCount(prompt.stars?.length || 0);
      setComments(prompt.comments || []);
      
      // Check star status
      const checkStarStatus = async () => {
        try {
          const { starred } = await api.getStarStatus(id!, userId);
          setIsStarred(starred);
        } catch (error) {
          console.error('Failed to check star status:', error);
        }
      };
      checkStarStatus();
    }
  }, [prompt, id, userId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto space-y-8">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-1/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-40 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !prompt) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Prompt Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The prompt you are looking for does not exist or could not be loaded.
          </p>
          <Link to="/browse">
            <Button>Back to Browse</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      // Track usage when prompt is copied
      await api.trackUsage(id!);
      toast.success("Prompt copied to clipboard!");
    } catch (error) {
      console.error('Failed to copy or track usage:', error);
      toast.success("Prompt copied to clipboard!");
    }
  };

  const handleEdit = () => {
    navigate(`/edit/${id}`);
  };

  const handleStar = async () => {
    try {
      const { starred } = await api.toggleStar(id!, userId);
      setIsStarred(starred);
      setStarCount(prev => starred ? prev + 1 : prev - 1);
      toast.success(starred ? "Prompt starred!" : "Prompt unstarred!");
    } catch (error) {
      console.error('Failed to toggle star:', error);
    }
  };

  const handleCommentAdded = (newComment: any) => {
    setComments(prev => [...prev, newComment]);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <h1 className="text-4xl font-bold">{prompt.title}</h1>
                <p className="text-xl text-muted-foreground">{prompt.description}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleStar} variant="outline" className="gap-2">
                  <Star className={`h-4 w-4 ${isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                  {starCount}
                </Button>
                <Button onClick={handleCopy} className="gap-2">
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
                <Button onClick={handleEdit} variant="outline" className="gap-2">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {prompt.tags.map(tag => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{starCount} Stars</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>{prompt.usageCount} Uses</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>By {prompt.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{prompt.date}</span>
              </div>
            </div>
          </div>

          {/* Prompt Content */}
          <Card>
            <CardHeader>
              <CardTitle>Prompt</CardTitle>
              <CardDescription>Click the copy button to use this prompt</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-6 rounded-lg font-mono text-sm whitespace-pre-wrap">
                {prompt.content || 'No content available'}
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card>
            <CardContent className="pt-6">
              <Comments
                promptId={id!}
                comments={comments}
                onCommentAdded={handleCommentAdded}
              />
            </CardContent>
          </Card>

          {/* Version History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Version History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(prompt.versions || []).length > 0 ? (
                  // Sort versions by date (newest first) for proper version numbering
                  [...prompt.versions]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((version, index) => (
                      <div
                        key={version.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Version {prompt.versions.length - index}</span>
                            {index === 0 && (
                              <Badge variant="default">Current</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{version.changes}</p>
                        </div>
                        <div className="text-sm text-muted-foreground text-right">
                          <p>{version.author}</p>
                          <p>{new Date(version.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="p-3 bg-muted rounded-lg text-center text-muted-foreground">
                    No version history available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PromptDetail;
