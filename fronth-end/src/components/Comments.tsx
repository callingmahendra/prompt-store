import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageCircle, User, Calendar } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
}

interface CommentsProps {
  promptId: string;
  comments: Comment[];
  onCommentAdded: (comment: Comment) => void;
}

const Comments = ({ promptId, comments, onCommentAdded }: CommentsProps) => {
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [newComment, setNewComment] = useState({
    author: "",
    content: ""
  });

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.author.trim() || !newComment.content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const comment = await api.addComment(promptId, newComment);
      onCommentAdded(comment);
      setNewComment({ author: "", content: "" });
      setIsAddingComment(false);
      toast.success("Comment added successfully!");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Comments ({comments.length})
        </h3>
        <Button
          variant="outline"
          onClick={() => setIsAddingComment(!isAddingComment)}
        >
          Add Comment
        </Button>
      </div>

      {isAddingComment && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add a Comment</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <div>
                <Label htmlFor="author">Your Name</Label>
                <Input
                  id="author"
                  value={newComment.author}
                  onChange={(e) => setNewComment(prev => ({ ...prev, author: e.target.value }))}
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <Label htmlFor="content">Comment</Label>
                <Textarea
                  id="content"
                  value={newComment.content}
                  onChange={(e) => setNewComment(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Share your thoughts about this prompt..."
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Submit Comment</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddingComment(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{comment.author}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(comment.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <p className="text-sm leading-relaxed">{comment.content}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;