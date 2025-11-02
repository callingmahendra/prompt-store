import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Plus, Database, Sparkles } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/50 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="bg-gradient-primary p-2.5 rounded-xl shadow-glow group-hover:shadow-glow-lg transition-all duration-300 group-hover:scale-110">
                <Database className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse">
                <Sparkles className="w-2 h-2 text-white m-0.5" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gradient">
                Prompt Store
              </span>
              <span className="text-xs text-muted-foreground -mt-1">
                Enterprise AI Hub
              </span>
            </div>
          </Link>
          
          <div className="flex items-center gap-2">
            <Link to="/browse">
              <Button 
                variant={location.pathname === "/browse" ? "default" : "ghost"}
                className="gap-2 hover:scale-105 transition-all duration-300"
                size="sm"
              >
                <Search className="h-4 w-4" />
                Browse
              </Button>
            </Link>
            <Link to="/create">
              <Button 
                variant={location.pathname === "/create" ? "default" : "ghost"}
                className="gap-2 hover:scale-105 transition-all duration-300 hover:shadow-glow"
                size="sm"
              >
                <Plus className="h-4 w-4" />
                Create
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
