import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { popularTags } from "@/lib/mockData";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import { api } from "@/lib/api";

const CreatePrompt = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");

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

    try {
      await api.createPrompt({
        title,
        description,
        content,
        tags: selectedTags,
        author: "anonymous", // You can replace this with actual user info if available
      });
      toast.success("Prompt created successfully!");
      navigate("/browse");
    } catch (error: any) {
      toast.error(error?.message || "Failed to create prompt");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Create New Prompt</h1>
            <p className="text-lg text-muted-foreground">
              Share your prompt with the organization to help others work more effectively
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Provide the essential details about your prompt</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Code Review Assistant"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Briefly describe what this prompt does and when to use it"
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
                <CardDescription>The actual prompt text that users will copy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="content">Prompt *</Label>
                  <Textarea
                    id="content"
                    placeholder="Enter your prompt here. Use [PLACEHOLDERS] to indicate where users should input their own information."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[250px] font-mono"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Tip: Use clear placeholders like [CODE HERE] or [DESCRIPTION] to guide users
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
                <CardDescription>Help others discover your prompt</CardDescription>
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

            <div className="flex gap-4 justify-end">
              <Button type="button" variant="outline" onClick={() => navigate("/browse")}>
                Cancel
              </Button>
              <Button type="submit">
                Create Prompt
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePrompt;
