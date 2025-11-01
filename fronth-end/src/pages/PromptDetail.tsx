import { useParams, Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { mockPrompts } from "@/lib/mockData";
import { Copy, Edit, Star, Calendar, User, TrendingUp, MessageSquare, History } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const PromptDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const prompt = mockPrompts.find(p => p.id === id);
  const [newComment, setNewComment] = useState("");

  if (!prompt) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Prompt Not Found</h1>
          <Link to="/browse">
            <Button>Back to Browse</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.content);
    toast.success("Prompt copied to clipboard!");
  };

  const handleEdit = () => {
    navigate(`/edit/${id}`);
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      toast.success("Comment added successfully!");
      setNewComment("");
    }
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
                <span className="font-medium">{prompt.rating} Rating</span>
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
                {prompt.content}
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Comments & Feedback
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* New Comment */}
              <div className="space-y-3">
                <Textarea
                  placeholder="Share your experience or suggestions..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button onClick={handleCommentSubmit}>
                  Post Comment
                </Button>
              </div>

              <Separator />

              {/* Existing Comments */}
              <div className="space-y-4">
                {prompt.comments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No comments yet. Be the first to share your feedback!
                  </p>
                ) : (
                  prompt.comments.map(comment => (
                    <div key={comment.id} className="space-y-2 p-4 bg-muted rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{comment.author}</span>
                          <span className="text-sm text-muted-foreground">{comment.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{comment.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>
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
                {prompt.versions.map((version, index) => (
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
                      <p>{version.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PromptDetail;
