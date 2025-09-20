import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { Button } from "../../components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Palette,
  User,
  LogOut,
  Home,
  ShoppingBag,
  Settings,
} from "lucide-react";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Designer", href: "/designer", icon: Palette },
    { name: "Marketplace", href: "/marketplace", icon: ShoppingBag },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center space-x-2 cursor-pointer transition-smooth hover:scale-105"
          onClick={() => navigate("/")}
        >
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Palette className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold hero-text">TeeCustom</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.href)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-smooth ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent transition-smooth">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {user.role}
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
              <Button onClick={() => navigate("/auth")}>Get Started</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
