import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import SearchBar from "@/components/SearchBar";
import PromptCard from "@/components/PromptCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { popularTags } from "@/lib/mockData";
import { api } from "@/lib/api";
import type { Prompt } from "@/lib/mockData";
import { X } from "lucide-react";

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedTags, setSelectedTags] = useState<string[]>(
    searchParams.get("tag") ? [searchParams.get("tag")!] : []
  );
  const [sortBy, setSortBy] = useState<"date" | "rating" | "usage">("rating");
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching prompts...');
        const data = await api.getAllPrompts();
        console.log('Received prompts:', data);
        setPrompts(data);
      } catch (error) {
        console.error('Failed to fetch prompts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrompts();
  }, []);

  useEffect(() => {
    const q = searchParams.get("q");
    const tag = searchParams.get("tag");
    if (q) setSearchQuery(q);
    if (tag && !selectedTags.includes(tag)) setSelectedTags([tag]);
  }, [searchParams]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
    setSearchParams({});
  };

  const filteredPrompts = useMemo(() => {
    let filtered = prompts;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        prompt =>
          prompt.title.toLowerCase().includes(query) ||
          prompt.description.toLowerCase().includes(query) ||
          prompt.content.toLowerCase().includes(query)
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(prompt =>
        selectedTags.every(tag => prompt.tags.includes(tag))
      );
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "usage":
          return (b.usageCount || 0) - (a.usageCount || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [prompts, searchQuery, selectedTags, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <h1 className="text-4xl font-bold">Browse Prompts</h1>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by keyword, description, or content..."
            className="max-w-2xl"
          />
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Filter by tags:</p>
              <div className="flex flex-wrap gap-2">
                {popularTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "secondary"}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                    {selectedTags.includes(tag) && (
                      <X className="ml-1 h-3 w-3" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-muted-foreground">Sort by:</label>
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="usage">Usage</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(searchQuery || selectedTags.length > 0) && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">Loading prompts...</p>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground">
                {filteredPrompts.length} {filteredPrompts.length === 1 ? 'prompt' : 'prompts'} found
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPrompts.map(prompt => (
                  <PromptCard
                    key={prompt.id}
                    id={prompt.id}
                    title={prompt.title}
                    description={prompt.description}
                    tags={prompt.tags || []}
                    rating={prompt.rating || 0}
                    author={prompt.author}
                    date={new Date(prompt.date).toLocaleDateString()}
                    usageCount={prompt.usageCount || 0}
                    stars={prompt.stars || []}
                    comments={prompt.comments || []}
                  />
                ))}
              </div>

              {filteredPrompts.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-lg text-muted-foreground">
                    No prompts found. Try adjusting your filters or{" "}
                    <Button variant="link" className="p-0" onClick={clearFilters}>
                      clear all filters
                    </Button>
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Browse;
