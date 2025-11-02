import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
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
          <div className="text-center space-y-12 animate-slide-up">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary animate-fade-in">
                <Sparkles className="w-4 h-4" />
                Enterprise AI Prompt Hub
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="text-gradient">
                  Discover & Share
                </span>
                <br />
                <span className="text-foreground">AI Prompts</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Find, contribute, and optimize AI prompts across your organization
              </p>
            </div>

            {/* Enhanced Search Section */}
            <div className="max-w-3xl mx-auto space-y-8">
              <GlassCard className="p-8 border-2 border-primary/20 shadow-2xl">
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-semibold text-foreground">Start Your Search</h2>
                    <p className="text-muted-foreground">Discover the perfect prompt for your needs</p>
                  </div>
                  
                  <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search prompts by keyword, description, or use case..."
                    className="text-lg h-14"
                  />
                  
                  <Button 
                    size="lg" 
                    className="w-full h-14 text-lg shadow-glow hover:shadow-glow-lg transition-all duration-300 group"
                    onClick={handleSearch}
                  >
                    <Search className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                    Search Prompts
                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </GlassCard>

              {/* Popular Tags */}
              {popularTags.length > 0 && (
                <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  <div className="text-center">
                    <p className="text-lg font-medium text-foreground mb-2">Popular Tags</p>
                    <p className="text-sm text-muted-foreground">Quick search by trending topics</p>
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {popularTags.slice(0, 8).map((tag, index) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-md px-4 py-2 text-sm font-medium"
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
            <div className="flex gap-6 justify-center flex-wrap animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <Button
                size="lg"
                onClick={() => navigate('/browse')}
                className="shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 px-8"
                variant="outline"
              >
                Browse All Prompts
              </Button>
              <Button
                size="lg"
                onClick={() => navigate('/create')}
                className="hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 px-8"
                variant="outline"
              >
                Create New Prompt
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernHero;