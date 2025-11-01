import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Zap, Search } from "lucide-react";
import { popularTags } from "@/lib/mockData";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Discover & Share
              </span>
              <br />
              AI Prompts
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your enterprise hub for AI prompt collaboration. Find, contribute, and optimize prompts across your organization.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search prompts by keyword or description..."
            />
            <Button 
              size="lg" 
              className="mt-4 shadow-md hover:shadow-glow transition-all"
              onClick={handleSearch}
            >
              <Search className="mr-2 h-5 w-5" />
              Search Prompts
            </Button>
          </div>

          {/* Popular Tags */}
          <div className="space-y-4">
            <p className="text-sm font-medium text-muted-foreground">Popular Tags:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {popularTags.slice(0, 10).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="border-border hover:shadow-md transition-shadow">
            <CardContent className="pt-6 text-center space-y-3">
              <div className="inline-flex p-3 bg-primary/10 rounded-lg">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Easy Discovery</h3>
              <p className="text-muted-foreground">
                Quickly find the perfect prompt with powerful search and filtering by tags
              </p>
            </CardContent>
          </Card>

          <Card className="border-border hover:shadow-md transition-shadow">
            <CardContent className="pt-6 text-center space-y-3">
              <div className="inline-flex p-3 bg-primary/10 rounded-lg">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Collaborative</h3>
              <p className="text-muted-foreground">
                Wiki-style editing allows anyone to improve and refine prompts over time
              </p>
            </CardContent>
          </Card>

          <Card className="border-border hover:shadow-md transition-shadow">
            <CardContent className="pt-6 text-center space-y-3">
              <div className="inline-flex p-3 bg-primary/10 rounded-lg">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Best Practices</h3>
              <p className="text-muted-foreground">
                Learn from top-rated prompts and community feedback to enhance your work
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto bg-gradient-primary border-0 text-primary-foreground shadow-glow">
          <CardContent className="p-12 text-center space-y-6">
            <Zap className="h-12 w-12 mx-auto" />
            <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Join your colleagues in building a knowledge base of effective AI prompts. Browse existing prompts or contribute your own.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/browse')}
                className="shadow-md"
              >
                Browse Prompts
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/create')}
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Create a Prompt
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Index;
