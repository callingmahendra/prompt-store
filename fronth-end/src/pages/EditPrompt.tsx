import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { popularTags } from "@/lib/mockData";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const EditPrompt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: prompt, isLoading, isError } = useQuery({
    queryKey: ["prompt", id],
    queryFn: () => api.getPrompt(id!),
    enabled: !!id,
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [changeNotes, setChangeNotes] = useState("");

  // Update form fields when prompt data is loaded
  useEffect(() => {
    if (prompt) {
      setTitle(prompt.title || "");
      setDescription(prompt.description || "");
      setContent(prompt.content || "");
      setSelectedTags(prompt.tags || []);
    }
  }, [prompt]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
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
            The prompt you are trying to edit does not exist or could not be loaded.
          </p>
          <Link to="/browse">
            <Button>Back to Browse</Button>
          </Link>
        </div>
      </div>
    );
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const addCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags([...selectedTags, customTag.trim()]);
      setCustomTag("");
    }
  };

  const removeTag = (tag: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || !content.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (selectedTags.length === 0) {
      toast.error("Please select at least one tag");
      return;
    }

    if (!changeNotes.trim()) {
      toast.error("Please describe your changes");
      return;
    }

    try {
      // Update the prompt
      await api.updatePrompt(id!, {
        title: title.trim(),
        description: description.trim(),
        content: content.trim(),
        tags: selectedTags,
      });

      // Add version entry
      await api.addVersion(id!, {
        author: prompt.author, // In a real app, this would be the current user
        changes: changeNotes.trim(),
        date: new Date().toISOString(),
      });

      toast.success("Prompt updated successfully!");
      navigate(`/prompt/${id}`);
    } catch (error) {
      console.error('Failed to update prompt:', error);
      toast.error("Failed to update prompt. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Edit Prompt</h1>
            <p className="text-lg text-muted-foreground">
              Make improvements to this prompt. Your changes will be tracked in the version history.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Update the essential details about this prompt</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[100px]"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prompt Content</CardTitle>
                <CardDescription>Update the prompt text</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="content">Prompt *</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[250px] font-mono"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
                <CardDescription>Update tags to improve discoverability</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Tags *</Label>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map(tag => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "secondary"}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customTag">Add Custom Tag</Label>
                  <div className="flex gap-2">
                    <Input
                      id="customTag"
                      placeholder="Enter a custom tag"
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
                    />
                    <Button type="button" onClick={addCustomTag} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {selectedTags.length > 0 && (
                  <div className="space-y-2">
                    <Label>Selected Tags ({selectedTags.length})</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedTags.map(tag => (
                        <Badge key={tag} variant="default" className="gap-1">
                          {tag}
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-destructive"
                            onClick={() => removeTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Change Notes</CardTitle>
                <CardDescription>Describe what you changed and why</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="changeNotes">What did you change? *</Label>
                  <Textarea
                    id="changeNotes"
                    placeholder="e.g., Added more detailed instructions for edge cases, improved clarity of step 3"
                    value={changeNotes}
                    onChange={(e) => setChangeNotes(e.target.value)}
                    className="min-h-[100px]"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-end">
              <Button type="button" variant="outline" onClick={() => navigate(`/prompt/${id}`)}>
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPrompt;
