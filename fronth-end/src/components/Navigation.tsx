import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Plus, Database } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-primary p-2 rounded-lg shadow-md group-hover:shadow-glow transition-all duration-300">
              <Database className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Prompt Store
            </span>
          </Link>
          
          <div className="flex items-center gap-3">
            <Link to="/browse">
              <Button 
                variant={location.pathname === "/browse" ? "default" : "ghost"}
                className="gap-2"
              >
                <Search className="h-4 w-4" />
                Browse
              </Button>
            </Link>
            <Link to="/create">
              <Button 
                variant={location.pathname === "/create" ? "default" : "ghost"}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Create
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
