import Navigation from "@/components/Navigation";
import ModernHero from "@/components/ModernHero";
import ModernFeatures from "@/components/ModernFeatures";
import ModernCTA from "@/components/ModernCTA";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <ModernHero />
      <ModernFeatures />
      <ModernCTA />
    </div>
  );
};

export default Index;
