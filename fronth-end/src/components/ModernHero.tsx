import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { Search, Sparkles, ArrowRight } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import { api } from "@/lib/api";

const ModernHero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPopularTags = async () => {
      try {
        const tagsData = await api.getPopularTags(10);
        setPopularTags(tagsData.map((tagObj: any) => tagObj.tag));
      } catch (error) {
        console.error('Failed to fetch popular tags:', error);
      }
    };

    fetchPopularTags();
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/browse?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/browse');
    }
  };

  const handleTagClick = (tag: string) => {
    navigate(`/browse?tag=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="relative min-h-screen bg-mesh overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          {/* Hero Content */}
          <div className="text-center space-y-8 animate-slide-up">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary animate-fade-in">
                <Sparkles className="w-4 h-4" />
                Enterprise AI Prompt Hub
              </div>
              
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                <span className="text-gradient">
                  Discover & Share
                </span>
                <br />
                <span className="text-foreground">AI Prompts</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Your enterprise hub for AI prompt collaboration. Find, contribute, and optimize prompts across your organization with modern tools and seamless workflows.
              </p>
            </div>

            {/* Search Section */}
            <div className="max-w-2xl mx-auto space-y-6">
              <GlassCard className="p-6">
                <div className="space-y-4">
                  <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search prompts by keyword, description, or use case..."
                    className="text-lg"
                  />
                  <Button 
                    size="lg" 
                    className="w-full shadow-glow hover:shadow-glow-lg transition-all duration-300 group"
                    onClick={handleSearch}
                  >
                    <Search className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Search Prompts
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </GlassCard>

              {/* Popular Tags */}
              {popularTags.length > 0 && (
                <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  <p className="text-sm font-medium text-muted-foreground">Trending Tags:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {popularTags.slice(0, 8).map((tag, index) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-md"
                        onClick={() => handleTagClick(tag)}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4 justify-center flex-wrap animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <Button
                size="lg"
                onClick={() => navigate('/browse')}
                className="shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Browse Prompts
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/create')}
                className="hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105"
              >
                Create a Prompt
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernHero;