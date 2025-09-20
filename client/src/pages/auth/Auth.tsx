import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore, type UserRole } from "../../store/useAuthStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Palette, User, Users, Shield } from "lucide-react";
import { toast } from "sonner";

export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer" as UserRole,
  });

  const handleSubmit = async (
    e: React.FormEvent,
    _type: "signin" | "signup"
  ) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const user = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name || "John Doe",
        email: formData.email,
        role: formData.role,
        createdAt: new Date().toISOString(),
      };

      login(user);
      toast.success(`Welcome to TeeCustom, ${user.name}!`);

      // Redirect based on role
      switch (user.role) {
        case "admin":
          navigate("/admin");
          break;
        case "freelancer":
          navigate("/seller-dashboard");
          break;
        default:
          navigate("/dashboard");
      }

      setIsLoading(false);
    }, 1500);
  };

  const roleOptions = [
    {
      value: "buyer",
      label: "Buyer",
      description: "I want to create and order custom t-shirts",
      icon: User,
    },
    {
      value: "freelancer",
      label: "Freelancer/Seller",
      description: "I want to sell designs and offer services",
      icon: Users,
    },
    {
      value: "admin",
      label: "Admin",
      description: "Platform administration (demo only)",
      icon: Shield,
    },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 gradient-primary rounded-full opacity-10 blur-3xl animate-float"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 gradient-accent rounded-full opacity-10 blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Palette className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold hero-text">TeeCustom</span>
        </div>

        <Card className="glass-card border-0 shadow-glow">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome</CardTitle>
            <CardDescription>
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <form
                  onSubmit={(e) => handleSubmit(e, "signin")}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full gradient-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form
                  onSubmit={(e) => handleSubmit(e, "signup")}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Account Type</Label>
                    <RadioGroup
                      value={formData.role}
                      onValueChange={(value) =>
                        setFormData({ ...formData, role: value as UserRole })
                      }
                    >
                      {roleOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <div
                            key={option.value}
                            className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-accent transition-smooth"
                          >
                            <RadioGroupItem
                              value={option.value}
                              id={option.value}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <Label
                                htmlFor={option.value}
                                className="flex items-center space-x-2 cursor-pointer"
                              >
                                <Icon className="w-4 h-4" />
                                <span className="font-medium">
                                  {option.label}
                                </span>
                              </Label>
                              <p className="text-sm text-muted-foreground mt-1">
                                {option.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </div>

                  <Button
                    type="submit"
                    className="w-full gradient-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="text-muted-foreground"
              >
                ← Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
