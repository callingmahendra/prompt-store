import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Plus, 
  Database, 
  Sparkles, 
  User, 
  Settings, 
  LogOut, 
  Bell,
  Menu,
  X
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/AuthModal";

const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "signup">("login");
  const { user, isLoggedIn, logout } = useAuth();
  
  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/50 shadow-lg backdrop-blur-xl">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
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
                Axiom Prompts
              </span>
              <span className="text-xs text-muted-foreground -mt-1">
                Enterprise AI Hub
              </span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
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
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              

              {/* User Profile Dropdown */}
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:scale-105 transition-all duration-300">
                      <Avatar className="h-9 w-9 ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                          {user.initials}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                              {user.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <p className="text-sm font-medium leading-none">{user.name}</p>
                            <p className="text-xs leading-none text-muted-foreground mt-1">
                              {user.email}
                            </p>
                            <Badge variant="secondary" className="w-fit mt-1 text-xs">
                              {user.role}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer" asChild>
                      <Link to="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer text-red-600 focus:text-red-600"
                      onClick={logout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setAuthModalTab("login");
                      setAuthModalOpen(true);
                    }}
                  >
                    Sign In
                  </Button>
                  <Button 
                    size="sm" 
                    className="shadow-glow hover:shadow-glow-lg"
                    onClick={() => {
                      setAuthModalTab("signup");
                      setAuthModalOpen(true);
                    }}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border/50">
            <div className="flex flex-col gap-2 mt-4">
              <Link to="/browse" onClick={() => setIsMobileMenuOpen(false)}>
                <Button 
                  variant={location.pathname === "/browse" ? "default" : "ghost"}
                  className="w-full justify-start gap-2"
                  size="sm"
                >
                  <Search className="h-4 w-4" />
                  Browse
                </Button>
              </Link>
              <Link to="/create" onClick={() => setIsMobileMenuOpen(false)}>
                <Button 
                  variant={location.pathname === "/create" ? "default" : "ghost"}
                  className="w-full justify-start gap-2"
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                  Create
                </Button>
              </Link>
              
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-3 p-3 mt-2 rounded-lg bg-muted/50">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                        {user.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
                      <User className="h-4 w-4" />
                      Profile
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-2 text-red-600" 
                    size="sm"
                    onClick={logout}
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  <Button 
                    variant="ghost" 
                    className="w-full" 
                    size="sm"
                    onClick={() => {
                      setAuthModalTab("login");
                      setAuthModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Sign In
                  </Button>
                  <Button 
                    className="w-full" 
                    size="sm"
                    onClick={() => {
                      setAuthModalTab("signup");
                      setAuthModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
    </nav>
  );
};

export default Navigation;
