import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { ArrowRight, Sparkles, Users, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

const ModernCTA = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPrompts: 0,
    totalAuthors: 0,
    totalUsage: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsData = await api.getStats();
        setStats({
          totalPrompts: statsData.totalPrompts || 0,
          totalAuthors: statsData.totalAuthors || 0,
          totalUsage: statsData.totalUsage || 0
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Fallback to individual API calls if stats endpoint doesn't exist
        try {
          const promptsData = await api.getAllPrompts();
          const prompts = Array.isArray(promptsData) ? promptsData : promptsData.prompts || [];
          
          const uniqueAuthors = new Set(prompts.map((p: any) => p.author)).size;
          const totalUsage = prompts.reduce((sum: number, p: any) => sum + (p.usageCount || 0), 0);
          
          setStats({
            totalPrompts: prompts.length,
            totalAuthors: uniqueAuthors,
            totalUsage: totalUsage
          });
        } catch (fallbackError) {
          console.error('Failed to fetch stats with fallback:', fallbackError);
        }
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-hero opacity-10" />
      <div className="absolute inset-0 bg-mesh" />
      
      {/* Floating elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-float" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-accent/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-5xl mx-auto">
          <GlassCard className="overflow-hidden hover-glow">
            <GlassCardContent className="p-12 md:p-16 text-center space-y-8">
              {/* Icon */}
              <div className="inline-flex p-4 rounded-2xl bg-gradient-primary shadow-glow animate-glow">
                <Sparkles className="h-12 w-12 text-white" />
              </div>

              {/* Content */}
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Start building your
                  <span className="text-gradient block">prompt library</span>
                </h2>
                
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Collaborate with your team to create, share, and improve AI prompts. Build a knowledge base that grows with your organization.
                </p>
              </div>

              {/* Real Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">{stats.totalPrompts}</div>
                  <div className="text-sm text-muted-foreground">Total Prompts</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">{stats.totalAuthors}</div>
                  <div className="text-sm text-muted-foreground">Contributors</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">{stats.totalUsage}</div>
                  <div className="text-sm text-muted-foreground">Total Uses</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  size="lg"
                  onClick={() => navigate('/browse')}
                  className="group shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-105"
                >
                  <BookOpen className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Browse Prompts
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/create')}
                  className="group hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105"
                >
                  <Users className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Start Contributing
                </Button>
              </div>

              {/* Roadmap */}
              <div className="pt-8 border-t border-border/50">
                <p className="text-sm text-muted-foreground mb-6">Coming Soon</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                  <div className="space-y-2">
                    <div className="font-medium text-primary">🔍 Advanced Search</div>
                    <div className="text-muted-foreground">AI-powered semantic search and filtering</div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium text-primary">📊 Analytics Dashboard</div>
                    <div className="text-muted-foreground">Usage metrics and performance tracking</div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium text-primary">🔗 API Integration</div>
                    <div className="text-muted-foreground">Connect with your existing workflows</div>
                  </div>
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

export default ModernCTA;