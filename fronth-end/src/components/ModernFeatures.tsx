import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { Search, Users, TrendingUp, Zap } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Smart Discovery",
    description: "Powerful search functionality with filtering by tags, keywords, and descriptions to find the perfect prompt quickly.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Users,
    title: "Collaborative Editing",
    description: "Wiki-style collaborative editing allows teams to improve and refine prompts together over time.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: TrendingUp,
    title: "Community Ratings",
    description: "Rate and review prompts to help the community identify the most effective and useful content.",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: Zap,
    title: "Easy Sharing",
    description: "One-click copying and sharing of prompts with your team to accelerate your AI workflows.",
    gradient: "from-yellow-500 to-orange-500"
  }
];

const ModernFeatures = () => {
  return (
    <section className="py-24 bg-gradient-subtle relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center space-y-6 mb-16 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary">
              <Zap className="w-4 h-4" />
              Powerful Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Everything you need for
              <span className="text-gradient block">AI prompt management</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Built for modern teams who need to collaborate, iterate, and scale their AI prompt workflows efficiently.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <GlassCard
                  key={feature.title}
                  className="group hover-glow transition-all duration-500 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <GlassCardContent className="p-8 text-center space-y-4">
                    <div className="relative">
                      <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-300`} />
                    </div>
                    
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </GlassCardContent>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernFeatures;